"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  async function submit(e) {
    e.preventDefault();
    const r = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const d = await r.json();
    setMsg(r.ok ? "Thanks for subscribing!" : d.error); if (r.ok) setEmail("");
  }
  return (
    <form onSubmit={submit} className="mt-5 max-w-xs">
      <div className="flex gap-2">
        <input className="input !py-2.5" type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn-primary !px-4 !py-2.5 text-sm">Join</button>
      </div>
      {msg && <p className="mt-2 text-xs text-cyan-brand">{msg}</p>}
    </form>
  );
}
