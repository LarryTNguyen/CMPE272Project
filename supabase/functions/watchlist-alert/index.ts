import { serve } from "https://deno.land/std/http/server.ts";
import { Resend } from "npm:resend";

const resend = new Resend("re_SVTieMV2_CHDYREF3TEsFwLur2ezURcY6");
serve(async (_req) => {
  try {
    await resend.emails.send({
      from: "george.luu@sjsu.com", // must be verified in Resend
      to: "george.luu@sjsu.com",                 // your test email
      subject: "✅ Test Supabase Email Alert",
      html: "<h2>This is a test email</h2><p>Sent from Supabase Edge Function.</p>",
    });

    console.log("Test email sent successfully!");
    return new Response("Test email sent successfully", { status: 200 });
  } catch (err) {
    console.error("Error sending test email:", err);
    return new Response("Failed to send test email", { status: 500 });
  }
});