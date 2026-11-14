"use client";
import { useState } from "react";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", subject: "General", body: "" });
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const d = await r.json();
    setMsg({ ok: r.ok, text: r.ok ? "Message sent! We will reply by email soon." : d.error });
    if (r.ok) setF({ name: "", email: "", subject: "General", body: "" });
  }
  return (
    <form onSubmit={submit} className="glass space-y-5 rounded-3xl p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="label">Name</label><input className="input" required value={f.name} onChange={set("name")} /></div>
        <div><label className="label">Email</label><input className="input" type="email" required value={f.email} onChange={set("email")} /></div>
      </div>
      <div><label className="label">Topic</label>
        <select className="input" value={f.subject} onChange={set("subject")}>{["General", "Billing", "Technical support", "Partnership", "Refund"].map((s) => <option key={s}>{s}</option>)}</select></div>
      <div><label className="label">Message</label><textarea className="input min-h-[140px]" required value={f.body} onChange={set("body")} /></div>
      {msg && <p className={`rounded-xl px-4 py-3 text-sm ${msg.ok ? "bg-cyan-brand/10 text-cyan-brand" : "bg-pink-brand/10 text-pink-brand"}`}>{msg.text}</p>}
      <button className="btn-primary w-full">Send message</button>
    </form>
  );
}
