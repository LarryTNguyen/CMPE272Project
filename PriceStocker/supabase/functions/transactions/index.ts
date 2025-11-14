// supabase/functions/transactions/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL =
  Deno.env.get("_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY =
  Deno.env.get("_SUPABASE_SERVICE_ROLE_KEY") ??
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: {
    headers: { apikey: SERVICE_ROLE_KEY },
  },
});

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type, x-ps-api-key, authorization",
    "access-control-allow-methods": "GET, OPTIONS",
  };
}

async function sha256hex(s) {
  const b = new TextEncoder().encode(s);
  const d = await crypto.subtle.digest("SHA-256", b);
  return Array.from(new Uint8Array(d)).map(x=>x.toString(16).padStart(2,"0")).join("");
}

async function validateApiKeyOr401(req: Request) {
  const key = req.headers.get("x-ps-api-key") || "";
  if (!key) return false;
  const hash = await sha256hex(key);
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, revoked_at")
    .eq("key_hash", hash)
    .is("revoked_at", null)
    .limit(1);
  return !error && data && data.length === 1;
}


function validateApiKey(req: Request): Response | null {
  const cors = corsHeaders();
  // Fallback to TEST_123 if PS_VALID_KEYS isn't set in secrets
  const envKeys = (Deno.env.get("PS_VALID_KEYS") || "TEST_123")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const key = req.headers.get("x-ps-api-key") || "";
  if (!envKeys.includes(key)) {
    return new Response(JSON.stringify({ error: "Missing or invalid API key" }), {
      status: 401,
      headers: { "content-type": "application/json", ...cors },
    });
  }
  return null;
}



// Simple key store (replace later with a table)
const VALID_KEYS = new Set([
  "TEST_123" // rotate later in a dashboard
]);

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type, x-ps-api-key",
  "access-control-allow-methods": "GET, OPTIONS",
};

function bad(status: number, msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}
function keyInfo(k?: string | null) {
  if (!k) return { present: false, kind: null, suffix: null };
  const kind = k.startsWith("sb_secret_")
    ? "service_role"
    : k.startsWith("sb_publishable_")
    ? "anon_or_publishable"
    : "unknown";
  return { present: true, kind, suffix: k.slice(-8) };
}
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }
  if (req.method !== "GET") return bad(405, "Method not allowed");
  if (new URL(req.url).searchParams.get("debug") === "key") {
  return new Response(JSON.stringify({
    env_SUPABASE_URL: SUPABASE_URL,
    key_present: !!SERVICE_ROLE_KEY,
    key_prefix: SERVICE_ROLE_KEY?.slice(0, 12) || null  // expect "sb_secret_..."
  }), { headers: { "content-type": "application/json" } });
}

  const apiKey = req.headers.get("x-ps-api-key") || "";
  if (!VALID_KEYS.has(apiKey)) return bad(401, "Missing or invalid API key");

  const url = new URL(req.url);
  if (url.searchParams.get("debug") === "1") {
    return new Response(
      JSON.stringify({
        env_SUPABASE_URL: SUPABASE_URL,
        project_ref_guess:
          (() => {
            try { return new URL(SUPABASE_URL).host.split(".")[0]; }
            catch { return null; }
          })(),
      }),
      { headers: { "content-type": "application/json" } }
    );
  }
 if (url.searchParams.get("debug") === "user" || url.searchParams.get("diag") === "user") {
  const target = url.searchParams.get("user_id") || "";
  const { data, count, error } = await supabase
    .from("transactions")
    .select("*", { count: "exact", head: false })
    .eq("user_id", target)
    .limit(1);

  return new Response(
    JSON.stringify({
      project_ref_guess: (() => { try { return new URL(SUPABASE_URL).host.split(".")[0]; } catch { return null; } })(),
      user_id: target,
      match_count: count ?? null,
      sample: data?.[0] ?? null,
      error: error?.message ?? null,
      // 🔎 key peek (suffix only)
      key: keyInfo(SERVICE_ROLE_KEY)
    }),
    { headers: { "content-type": "application/json", ...corsHeaders() } }
  );
}

  const userId = url.searchParams.get("user_id");
  if (!userId) return bad(400, "user_id is required");

  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const ticker = url.searchParams.get("ticker");
  const status = url.searchParams.get("status");
  const since = url.searchParams.get("since");   // ISO date
  const until = url.searchParams.get("until");   // ISO date
  const cursor = url.searchParams.get("cursor"); // base64(JSON: {created_at,id})

  // decode cursor → { created_at, id }
  const after = cursor ? JSON.parse(atob(cursor)) : null;

  // Base query
  let q = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit + 1); // fetch one extra to detect "has more"

  if (ticker) q = q.eq("ticker", ticker);
  if (status) q = q.eq("status", status);
  if (since) q = q.gte("created_at", since);
  if (until) q = q.lt("created_at", until);

  if (after) {
    // keyset pagination: rows where (created_at,id) < (after.created_at, after.id)
    q = q
      .lt("created_at", after.created_at)
      .or(`created_at.eq.${after.created_at},id.lt.${after.id}`);
  }

  const { data, error } = await q;
  if (error) return bad(400, error.message);

  const hasMore = (data?.length || 0) > limit;
  const page = hasMore ? data!.slice(0, limit) : data || [];
  const nextCursor = hasMore
    ? btoa(JSON.stringify({ created_at: page[page.length - 1].created_at, id: page[page.length - 1].id }))
    : null;

  return new Response(JSON.stringify({ data: page, next_cursor: nextCursor }), {
    headers: { "content-type": "application/json", ...cors },
  });
});
