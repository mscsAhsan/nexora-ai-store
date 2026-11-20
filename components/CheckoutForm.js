"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { plans } from "@/lib/tools";
import { formatPKR } from "@/lib/format";

export default function CheckoutForm({ plan, options }) {
  const { items, total: cartTotal, clear } = useCart();
  const planObj = plan ? plans.find((p) => p.name === plan && p.monthly > 0) : null;
  const lines = planObj ? [{ slug: "plan", name: `${planObj.name} plan (1 month)`, price: planObj.monthly }] : items;
  const total = planObj ? planObj.monthly : cartTotal;
  const [method, setMethod] = useState(options.safepay ? "safepay" : options.demo ? "demo" : "manual");
  const [ref, setRef] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const methods = [
    options.safepay && ["safepay", "Card / JazzCash / Easypaisa / Raast", "Secure payment via Safepay - pay with a local card, JazzCash wallet, Easypaisa wallet, Raast or bank transfer."],
    options.demo && ["demo", "Test payment", "No money is charged. Use this to try the full flow."],
    ["manual", "Manual payment", "JazzCash / Easypaisa / Bank transfer. Approved by our team."],
  ].filter(Boolean);

  async function pay() {
    setBusy(true); setErr("");
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slugs: planObj ? [] : items.map((i) => i.slug), plan: planObj?.name, method, reference: ref }) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error); setBusy(false); return; }
    if (!planObj) clear();
    if (d.url) window.location.href = d.url; else router.push(`/checkout/success?order=${d.orderId}`);
  }

  if (!lines.length) return <div className="glass rounded-3xl p-10 text-center"><p className="text-muted">Your cart is empty.</p><Link href="/tools" className="btn-primary mt-6">Browse tools</Link></div>;

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6">
        <h2 className="mb-4 text-xl font-bold">Order summary</h2>
        {lines.map((l) => <div key={l.slug} className="flex justify-between border-b border-line py-3 last:border-0"><span>{l.name}</span><span className="font-semibold">{formatPKR(l.price)}</span></div>)}
        <div className="mt-3 flex justify-between text-xl font-bold"><span>Total</span><span>{formatPKR(total)}</span></div>
      </div>
      {!options.safepay && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">Online card / wallet payment is not set up yet - add your Safepay keys to .env.local (see README, “Safepay setup”). Manual payment still works.</p>
      )}
      <div className="glass rounded-3xl p-6">
        <h2 className="mb-4 text-xl font-bold">Payment method</h2>
        <div className="space-y-3">
          {methods.map(([id, t, d]) => (
            <label key={id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${method === id ? "border-violet-brand bg-violet-brand/10" : "border-line hover:border-violet-brand/50"}`}>
              <input type="radio" name="m" checked={method === id} onChange={() => setMethod(id)} className="mt-1 accent-violet-500" />
              <span><b>{t}</b><span className="block text-sm text-muted">{d}</span></span>
            </label>
          ))}
        </div>
        {method === "manual" && (
          <div className="mt-5 space-y-3 rounded-2xl bg-white/70 p-4">
            <p className="text-sm text-muted">{options.instructions}</p>
            <input className="input" placeholder="Transaction ID / reference" value={ref} onChange={(e) => setRef(e.target.value)} />
          </div>
        )}
      </div>
      {err && <p className="rounded-xl bg-pink-brand/10 px-4 py-3 text-sm text-pink-brand">{err}</p>}
      <button onClick={pay} disabled={busy} className="btn-primary w-full text-lg disabled:opacity-50">{busy ? "Processing..." : method === "manual" ? `Submit order - ${formatPKR(total)}` : `Pay ${formatPKR(total)}`}</button>
    </div>
  );
}
