import { serve } from "std/server";
import { json, preflight } from "../_shared/response.ts";
import { createClientFromRequest } from "../_shared/supabaseClient.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "GET") {
    return json({ error: { code: "method_not_allowed", message: "Only GET is allowed." } }, 405);
  }

  try {
    const supabase = createClientFromRequest(req);

    // Enforce JWT and get user id
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      return json({ error: { code: "unauthorized", message: "Invalid or missing bearer token." } }, 401);
    }
    const userId = authData.user.id;

    // Fetch rows (RLS: user_id = auth.uid())
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }); // match your other endpoints

    if (error) {
      return json({ error: { code: "db_error", message: error.message, hint: (error as any).hint ?? null } }, 500);
    }

    return json({ data: data ?? [], next_cursor: null }, 200);
  } catch (e: any) {
    return json({ error: { code: "internal_error", message: e?.message ?? "Unexpected error." } }, 500);
  }
});
