"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const QUICK = ["How do I buy?", "Payment methods?", "ChatGPT Plus price?", "How fast is delivery?"];
const FIRST = "Hi! I am the Nexavo AI assistant. Ask me about any tool, price, payment or delivery — for example 'ChatGPT Plus price?' or 'How do I buy?'";

// Render a bot reply as structured text — no new dependency.
// Supports **bold**, - bullet lists, 1. numbered lists, paragraphs, and
// markdown links [text](/tools/slug) rendered as real links.
function renderInline(text, key) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const b = part.match(/^\*\*(.+)\*\*$/);
    if (b) return <b key={`${key}-${i}`}>{b[1]}</b>;
    const l = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (l) return <Link key={`${key}-${i}`} href={l[2]} className="font-semibold text-[#AD5A00] underline">{l[1]}</Link>;
    return <span key={`${key}-${i}`}>{part}</span>;
  });
}

function renderRich(text) {
  const lines = String(text).split("\n");
  const blocks = [];
  let list = null;
  const flush = () => { if (list) { blocks.push(list); list = null; } };
  lines.forEach((line, i) => {
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    const num = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (bullet || num) {
      if (!list || list.kind !== (bullet ? "ul" : "ol")) { flush(); list = { kind: bullet ? "ul" : "ol", items: [] }; }
      list.items.push(bullet ? bullet[1] : num[1]);
    } else if (line.trim()) {
      flush();
      blocks.push({ kind: "p", text: line.trim() });
    } else {
      flush();
    }
  });
  flush();
  return blocks.map((b, i) =>
    b.kind === "ul" ? (
      <ul key={i} className="list-disc space-y-1 pl-5">{b.items.map((it, j) => <li key={j}>{renderInline(it, `b${i}-${j}`)}</li>)}</ul>
    ) : b.kind === "ol" ? (
      <ol key={i} className="list-decimal space-y-1 pl-5">{b.items.map((it, j) => <li key={j}>{renderInline(it, `b${i}-${j}`)}</li>)}</ol>
    ) : (
      <p key={i}>{renderInline(b.text, `p${i}`)}</p>
    )
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "bot", text: FIRST }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState(null);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy, open]);
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem("nexavo-chat") || "[]"); if (Array.isArray(s) && s.length) setMsgs(s); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("nexavo-chat", JSON.stringify(msgs.slice(-30))); } catch {}
  }, [msgs]);

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: q }) });
      const d = await r.json();
      setAi(d.aiConnected === true ? "Cohere AI" : d.aiConnected === false ? "FAQ" : ai);
      setMsgs((m) => [...m, { role: "bot", text: d.reply || d.error || "Sorry, I could not answer that. Please try again or contact support at /contact." }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "Sorry, the chat is unreachable right now. Please try again, or contact support at /contact." }]);
    } finally { setBusy(false); }
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="Open chat" className="fixed bottom-[84px] right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#F3A620] to-[#0EA5E9] text-xl text-white shadow-xl shadow-amber-900/30 transition hover:scale-110 active:scale-95 md:bottom-5 md:right-5 md:h-14 md:w-14 md:text-2xl">
          💬
        </button>
      )}
      {open && (
        <div className="chat-panel fixed bottom-3 right-3 z-[80] flex h-[min(560px,calc(100dvh-1.5rem))] w-[calc(100vw-1.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl md:bottom-5 md:right-5 md:h-[540px]">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#F3A620] to-[#0EA5E9] px-5 py-4 text-white">
            <div>
              <p className="font-bold">Nexavo Assistant</p>
              <p className="text-xs opacity-80">{ai ? `Answering with ${ai}` : "Ask about tools, prices, payment & delivery"}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-2 text-xl hover:bg-white/20">✕</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#FBF9F5] p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[85%] space-y-2 rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "ml-auto bg-[#F3A620] text-white" : "bg-white text-[#282330] shadow-sm"}`}>{m.role === "bot" ? renderRich(m.text) : m.text}</div>
            ))}
            {busy && (
              <div className="flex w-fit gap-1.5 rounded-2xl bg-white px-4 py-3 shadow-sm">
                {[0, 1, 2].map((i) => <span key={i} className="typing-dot h-2 w-2 rounded-full bg-[#F3A620]" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line bg-white px-4 pt-3">
            {QUICK.map((q) => <button key={q} onClick={() => send(q)} className="rounded-full border border-line bg-[#FBF9F5] px-3 py-1.5 text-xs font-semibold text-[#AD5A00] hover:border-[#F3A620]">{q}</button>)}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 bg-white p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a tool or price..." maxLength={500} className="input !py-2.5" />
            <button disabled={busy} className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-50">Send</button>
          </form>
          <p className="bg-white px-4 pb-3 text-center text-[11px] text-muted">Answers only about this store. Prices in PKR. <Link href="/contact" className="underline">Contact support</Link></p>
        </div>
      )}
    </>
  );
}
