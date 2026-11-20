// GET /api/downloads/<token> - expiring download link from the delivery email.
// No login required (the token IS the credential - a random UUID, 7 days, 5 uses).
// Redirects to the tool's file (tools.file_url, set in /admin/tools) or, if no
// file is attached, to the tool's access URL. The file itself must live in
// private storage - never put customer PDFs under public/.
import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { consumeDownloadToken } from "@/lib/downloads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const result = await consumeDownloadToken(params.token);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 410 });
  }
  const [tool] = await q("SELECT url, file_url FROM tools WHERE slug=?", [result.row.tool_slug]);
  const target = tool?.file_url || tool?.url;
  if (!target) return NextResponse.json({ error: "No file is attached to this tool yet. Your license key is in your dashboard." }, { status: 404 });
  return NextResponse.redirect(target);
}
