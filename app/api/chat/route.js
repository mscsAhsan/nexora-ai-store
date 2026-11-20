import { NextResponse } from "next/server";
import { askCohere, cohereConfigured, cohereModel, localFaqAnswer } from "@/lib/chat";

// POST { message } -> { reply, source: "cohere" | "faq", aiConnected }
// No login required. Server only — the Cohere key never leaves the server.
// Simple in-memory rate limit: 20 requests / minute per IP.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) for (const k of hits.keys()) { if (k !== ip) hits.delete(k); }
  return list.length > 20;
}

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many messages — please wait a minute and try again." }, { status: 429 });
  const { message } = await req.json().catch(() => ({}));
  const text = String(message || "").trim().slice(0, 500);
  if (!text) return NextResponse.json({ error: "Type a message first." }, { status: 400 });
  try {
    if (cohereConfigured()) {
      const reply = await askCohere(text);
      if (reply) return NextResponse.json({ reply, source: "cohere", aiConnected: true, model: cohereModel() });
    }
  } catch (e) {
    console.error("[chat] Cohere failed, using FAQ fallback:", e?.message || e);
  }
  const reply = await localFaqAnswer(text);
  return NextResponse.json({
    reply,
    source: "faq",
    aiConnected: false,
    note: "AI chat is not connected yet — add COHERE_API_KEY in Vercel to enable live AI answers. This answer comes from the store FAQ and live catalogue.",
  });
}
