// Download tokens - how a paid customer gets their PDF / file.
// A token is a random UUID stored in download_tokens, valid 7 days,
// max 5 downloads. It is ONLY ever sent by email and shown in the
// customer's own dashboard - never in a public API response.
//   /api/downloads/<token>  -> checks expiry + count, then redirects to
//   the tool's file (tools.file_url, set in /admin/tools) or, if no file
//   is attached yet, to the tool's access URL.
// Files themselves are NOT in this repo and NOT in public/:
//   - Put the PDF in private storage (Supabase Storage private bucket or
//     Cloudflare R2) and paste its signed URL as the tool's "File URL"
//     in /admin/tools, OR paste a long-lived private link.
//   - For a tool that is a web app (not a file), leave File URL empty -
//     the customer gets the Launch link + license key instead.
import crypto from "crypto";
import { q, run } from "./db";

export const DOWNLOAD_TTL_DAYS = 7;
export const DOWNLOAD_MAX_USES = 5;

export async function createDownloadTokens(orderId, items) {
  const out = [];
  const expiresAt = new Date(Date.now() + DOWNLOAD_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  for (const it of items) {
    if (it.tool_slug.startsWith("plan:")) continue;
    const token = crypto.randomUUID();
    await run(
      "INSERT INTO download_tokens (token, order_id, tool_slug, expires_at, download_count) VALUES (?,?,?,?,?)",
      [token, orderId, it.tool_slug, expiresAt, 0]
    );
    out.push({ tool_slug: it.tool_slug, token, expires_at: expiresAt });
  }
  return out;
}

export async function getDownloadToken(token) {
  const [row] = await q("SELECT * FROM download_tokens WHERE token=?", [token]);
  return row || null;
}

export async function consumeDownloadToken(token) {
  const row = await getDownloadToken(token);
  if (!row) return { ok: false, error: "This download link is not valid." };
  if (new Date(row.expires_at) < new Date()) return { ok: false, error: "This download link has expired (7 days). Your license key is still in your dashboard - email support for a fresh link." };
  if (Number(row.download_count) >= DOWNLOAD_MAX_USES) return { ok: false, error: "This download link has reached its 5-download limit. Email support for a fresh link." };
  await run("UPDATE download_tokens SET download_count = download_count + 1 WHERE token=?", [token]);
  return { ok: true, row };
}
