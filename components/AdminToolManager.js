"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories, iconNames } from "@/lib/tools";
import { formatPKR } from "@/lib/format";

const empty = { id: null, name: "", slug: "", brand: "", category: "AI Chat", icon: "sparkle", price: 999, rating: 4.5, reviews: 0, from: "#F3A620", to: "#0EA5E9", description: "", features: "", url: "", file_url: "", active: true, duration: "1 Month", accessType: "Private", warranty: "Full warranty", delivery: "Instant" };

export default function AdminToolManager({ tools }) {
  const [f, setF] = useState(empty);
  const [msg, setMsg] = useState(null);
  const router = useRouter();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function save(e) {
    e.preventDefault();
    const r = await fetch("/api/admin/tools", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const d = await r.json();
    setMsg({ ok: r.ok, text: r.ok ? "Saved!" : d.error });
    if (r.ok) { setF(empty); router.refresh(); }
  }
  async function del(id) {
    if (!confirm("Delete this tool?")) return;
    await fetch(`/api/admin/tools?id=${id}`, { method: "DELETE" }); router.refresh();
  }
  const edit = (t) => { setF({ id: t.id, name: t.name, slug: t.slug, brand: t.brand || "", category: t.category, icon: t.icon, price: t.price, rating: t.rating, reviews: t.reviews, from: t.from, to: t.to, description: t.desc, features: t.features.join("\n"), url: t.url, file_url: t.file_url || "", active: !!t.active, duration: t.duration || "1 Month", accessType: t.accessType || "Private", warranty: t.warranty || "Full warranty", delivery: t.delivery || "Instant" }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="space-y-8">
      <form onSubmit={save} className="glass space-y-4 rounded-3xl p-6">
        <h2 className="text-xl font-bold">{f.id ? "Edit tool" : "Add new tool"}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="label">Name</label><input className="input" required value={f.name} onChange={set("name")} /></div>
          <div><label className="label">Brand</label><input className="input" value={f.brand} onChange={set("brand")} placeholder="ChatGPT" /></div>
          <div><label className="label">Duration</label><input className="input" value={f.duration} onChange={set("duration")} placeholder="1 Month" /></div>
          <div><label className="label">Access type</label><select className="input" value={f.accessType} onChange={set("accessType")}>{["Private", "Shared", "Invite", "CDK", "Redeem Link", "Slot", "API Key"].map((x) => <option key={x}>{x}</option>)}</select></div>
          <div><label className="label">Warranty</label><input className="input" value={f.warranty} onChange={set("warranty")} placeholder="Full warranty" /></div>
          <div><label className="label">Delivery</label><select className="input" value={f.delivery} onChange={set("delivery")}>{["Instant", "Manual review"].map((x) => <option key={x}>{x}</option>)}</select></div>
          <div><label className="label">Category</label><select className="input" value={f.category} onChange={set("category")}>{categories.slice(1).map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Icon</label><select className="input" value={f.icon} onChange={set("icon")}>{iconNames.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Price (PKR, whole rupees)</label><input className="input" type="number" step="1" min="0" value={f.price} onChange={set("price")} /></div>
          <div><label className="label">Rating</label><input className="input" type="number" step="0.1" min="0" max="5" value={f.rating} onChange={set("rating")} /></div>
          <div><label className="label">Reviews count</label><input className="input" type="number" min="0" value={f.reviews} onChange={set("reviews")} /></div>
          <div><label className="label">Gradient from</label><input className="input !p-1 h-12" type="color" value={f.from} onChange={set("from")} /></div>
          <div><label className="label">Gradient to</label><input className="input !p-1 h-12" type="color" value={f.to} onChange={set("to")} /></div>
          <div><label className="label">Access URL (customers see "Launch tool")</label><input className="input" value={f.url} onChange={set("url")} placeholder="https://..." /></div>
          <div><label className="label">File URL for download (private PDF / file link - leave empty for web tools)</label><input className="input" value={f.file_url} onChange={set("file_url")} placeholder="https://... (Supabase / R2 signed link)" /></div>
        </div>
        <div><label className="label">Description</label><input className="input" required value={f.description} onChange={set("description")} /></div>
        <div><label className="label">Features (one per line)</label><textarea className="input min-h-[100px]" value={f.features} onChange={set("features")} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.active} onChange={set("active")} className="accent-violet-500" /> Visible in store</label>
        {msg && <p className={`rounded-xl px-4 py-3 text-sm ${msg.ok ? "bg-cyan-brand/10 text-cyan-brand" : "bg-pink-brand/10 text-pink-brand"}`}>{msg.text}</p>}
        <div className="flex gap-3"><button className="btn-primary">{f.id ? "Update tool" : "Add tool"}</button>{f.id && <button type="button" onClick={() => setF(empty)} className="btn-ghost">Cancel edit</button>}</div>
      </form>
      <div className="overflow-x-auto rounded-3xl border border-line bg-card">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-line text-muted"><tr>{["Tool", "Brand", "Category", "Price", "Status", ""].map((h) => <th key={h} className="px-5 py-4 font-medium">{h}</th>)}</tr></thead>
          <tbody>{tools.map((t) => (
            <tr key={t.id} className="border-b border-line last:border-0">
              <td className="px-5 py-4 font-semibold">{t.name}</td><td className="px-5 py-4 text-muted">{t.brand || "-"}</td><td className="px-5 py-4 text-muted">{t.category}</td><td className="px-5 py-4">{formatPKR(t.price)}</td>
              <td className="px-5 py-4">{t.active ? <span className="text-emerald-400">Visible</span> : <span className="text-muted">Hidden</span>}</td>
              <td className="px-5 py-4 text-right"><button onClick={() => edit(t)} className="mr-3 text-cyan-brand hover:underline">Edit</button><button onClick={() => del(t.id)} className="text-pink-brand hover:underline">Delete</button></td>
            </tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
