"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const QUICK = ["How do I buy?", "Payment methods?", "ChatGPT Plus price?", "How fast is delivery?"];
const FIRST = "Hi! I am the Nexavo AI assistant. Ask me about any tool, price, payment or delivery — for example 'ChatGPT Plus price?' or 'How do I buy?'";

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
        <button onClick={() => setOpen(true)} aria-label="Open chat" className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#0E7A5F] to-[#0F766E] text-2xl text-white shadow-xl shadow-emerald-900/30 transition hover:scale-110 active:scale-95">
          💬
        </button>
      )}
      {open && (
        <div className="chat-panel fixed bottom-5 right-5 z-50 flex h-[540px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#0E7A5F] to-[#0F766E] px-5 py-4 text-white">
            <div>
              <p className="font-bold">Nexavo Assistant</p>
              <p className="text-xs opacity-80">{ai ? `Answering with ${ai}` : "Ask about tools, prices, payment & delivery"}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-2 text-xl hover:bg-white/20">✕</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#FAF7F0] p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "ml-auto bg-[#0E7A5F] text-white" : "bg-white text-[#1F2937] shadow-sm"}`}>{m.text}</div>
            ))}
            {busy && (
              <div className="flex w-fit gap-1.5 rounded-2xl bg-white px-4 py-3 shadow-sm">
                {[0, 1, 2].map((i) => <span key={i} className="typing-dot h-2 w-2 rounded-full bg-[#0E7A5F]" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line bg-white px-4 pt-3">
            {QUICK.map((q) => <button key={q} onClick={() => send(q)} className="rounded-full border border-line bg-[#FAF7F0] px-3 py-1.5 text-xs font-semibold text-[#0E7A5F] hover:border-[#0E7A5F]">{q}</button>)}
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
