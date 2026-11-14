"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({ user }) {
  const [f, setF] = useState({ name: user.name, currentPassword: "", newPassword: "" });
  const [msg, setMsg] = useState(null);
  const router = useRouter();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    const r = await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const d = await r.json();
    setMsg({ ok: r.ok, text: r.ok ? "Saved!" : d.error });
    if (r.ok) { setF({ ...f, currentPassword: "", newPassword: "" }); router.refresh(); }
  }
  return (
    <form onSubmit={submit} className="glass max-w-lg space-y-5 rounded-3xl p-8">
      <div><label className="label">Email</label><input className="input opacity-60" value={user.email} disabled /></div>
      <div><label className="label">Name</label><input className="input" value={f.name} onChange={set("name")} required /></div>
      <hr className="border-line" />
      <p className="text-sm text-muted">Change password (optional)</p>
      <div><label className="label">Current password</label><input className="input" type="password" value={f.currentPassword} onChange={set("currentPassword")} /></div>
      <div><label className="label">New password</label><input className="input" type="password" minLength={8} value={f.newPassword} onChange={set("newPassword")} /></div>
      {msg && <p className={`rounded-xl px-4 py-3 text-sm ${msg.ok ? "bg-cyan-brand/10 text-cyan-brand" : "bg-pink-brand/10 text-pink-brand"}`}>{msg.text}</p>}
      <button className="btn-primary">Save changes</button>
    </form>
  );
}
