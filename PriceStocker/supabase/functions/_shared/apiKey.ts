export function validateApiKey(req: Request): Response | null {
  const cors = {
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type, x-ps-api-key",
    "access-control-allow-methods": "GET, OPTIONS",
  };
  const key = req.headers.get("x-ps-api-key") || "";
  // Allow comma-separated keys from env (PS_VALID_KEYS="TEST_123,PARTNER_ABC")
  const envKeys = (Deno.env.get("PS_VALID_KEYS") || "TEST_123")
    .split(",").map(s => s.trim());
  const valid = new Set(envKeys);
  if (!valid.has(key)) {
    return new Response(JSON.stringify({ error: "Missing or invalid API key" }), {
      status: 401, headers: { "content-type": "application/json", ...cors },
    });
  }
  return null; // ok
}
