// supabase/functions/_shared/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

export function createClientFromRequest(req: Request) {
  // 1) Try env (works when secrets are injected)
  let SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? undefined;
  let SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? undefined;

  // 2) Fallback: derive URL from the function host (prod) or use header (local/other)
  if (!SUPABASE_URL) {
    const { protocol, hostname } = new URL(req.url);
    if (hostname.endsWith(".functions.supabase.co")) {
      SUPABASE_URL = `${protocol}//${hostname.replace(".functions.supabase.co", ".supabase.co")}`;
    } else {
      SUPABASE_URL = req.headers.get("x-supabase-url") ?? undefined;
    }
  }

  // 3) Fallback: use the caller’s apikey header as anon key (you already send this)
  if (!SUPABASE_ANON_KEY) {
    SUPABASE_ANON_KEY =
      req.headers.get("apikey") ||
      req.headers.get("x-supabase-anon-key") ||
      undefined;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY (set as secrets, or pass headers 'apikey' and 'x-supabase-url')."
    );
  }

  const authHeader = req.headers.get("Authorization") ?? "";

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}
