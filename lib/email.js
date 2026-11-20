// Delivery email via Resend - server only, never from the browser.
// Free tier: 3,000 emails/month (100/day). Until your sending domain is
// verified in Resend (SPF + DKIM + DMARC), Resend only lets you send to
// the email address that owns the Resend account - verify the domain
// before going live, or delivery emails will fail silently for customers.
//   RESEND_API_KEY= re_...
//   EMAIL_FROM=     Nexavo AI <orders@yourdomain.com>   (must be a verified domain)
//   SUPPORT_EMAIL=  support@yourdomain.com
// If RESEND_API_KEY is not set, sending is skipped (logged) instead of
// crashing checkout - the license + download link are still in /dashboard.
import { Resend } from "resend";
import { formatPKR } from "./format";

let resend = null;
function client() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export async function sendDeliveryEmail({ to, name, order, items, origin }) {
  const api = client();
  if (!api) {
    console.warn("[email] RESEND_API_KEY not set - skipping delivery email for order", order.id);
    return { skipped: true };
  }
  const from = process.env.EMAIL_FROM || "Nexavo AI <onboarding@resend.dev>";
  const rows = items.map((it) => {
    const dl = it.download_url
      ? `<br><a href="${esc(it.download_url)}">Download / access your file</a> (link expires in 7 days)`
      : "";
    const launch = it.access_url
      ? `<br><a href="${esc(it.access_url)}">Launch tool</a>`
      : "";
    const key = it.license_key ? `<br>License key: <code>${esc(it.license_key)}</code>` : "";
    return `<li style="margin-bottom:14px"><b>${esc(it.name)}</b> - ${formatPKR(it.price)}${key}${dl}${launch}</li>`;
  }).join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111">
      <h2>Your Nexavo AI order is ready - Order #${order.id}</h2>
      <p>Hi ${esc(name || "there")},</p>
      <p>Thank you - your payment of <b>${formatPKR(order.total)}</b> via Safepay was successful. Your tools are below. Keep this email safe - the download links expire in 7 days, but your license keys are also saved in your dashboard.</p>
      <ul>${rows}</ul>
      <p><a href="${esc(origin)}/dashboard">Open your dashboard</a></p>
      <p style="color:#666;font-size:13px">Order #${order.id} &middot; Paid via Safepay (card / JazzCash / Easypaisa / Raast). Questions? Reply to this email or write to ${esc(process.env.SUPPORT_EMAIL || "support@yourdomain.com")}.</p>
      <p style="color:#666;font-size:13px">This email is prepared with the assistance of Muse, Meta's AI agent.</p>
    </div>`;

  try {
    const { data, error } = await api.emails.send({
      from,
      to: [to],
      subject: `Your Nexavo AI order #${order.id} - license keys + download links`,
      html,
    });
    if (error) {
      console.error("[email] Resend error for order", order.id, error);
      return { ok: false, error: String(error?.message || error) };
    }
    return { ok: true, id: data?.id || null };
  } catch (e) {
    console.error("[email] send failed for order", order.id, e?.message || e);
    return { ok: false, error: String(e?.message || e) };
  }
}
