import { corsHeaders } from "./cors.ts";

export function json(body: unknown, status = 200, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...extraHeaders
    }
  });
}

export function preflight() {
  return new Response("ok", { headers: corsHeaders });
}
