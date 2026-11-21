"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode, next = "/dashboard" }) {
  const reg = mode === "register";
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error); setBusy(false); return; }
    router.push(next); router.refresh();
  }

  return (
    <form onSubmit={submit} className="glass mx-auto w-full max-w-md space-y-5 rounded-3xl p-8">
      <img src="/images/login-art.webp" alt="Nexavo AI marketplace" className="h-auto w-full rounded-2xl" />
      {reg && <div><label className="label">Full name</label><input className="input" required value={f.name} onChange={set("name")} placeholder="Your name" /></div>}
      <div><label className="label">Email</label><input className="input" type="email" required value={f.email} onChange={set("email")} placeholder="you@example.com" /></div>
      <div><label className="label">Password</label><input className="input" type="password" required minLength={reg ? 8 : 1} value={f.password} onChange={set("password")} placeholder={reg ? "At least 8 characters" : "Your password"} /></div>
      {err && <p className="rounded-xl bg-pink-brand/10 px-4 py-3 text-sm text-pink-brand">{err}</p>}
      <button disabled={busy} className="btn-primary w-full disabled:opacity-50">{busy ? "Please wait..." : reg ? "Create account" : "Sign in"}</button>
      <p className="text-center text-sm text-muted">
        {reg ? <>Already have an account? <Link href="/login" className="text-cyan-brand hover:underline">Sign in</Link></> : <>New here? <Link href="/register" className="text-cyan-brand hover:underline">Create an account</Link></>}
      </p>
    </form>
  );
}
