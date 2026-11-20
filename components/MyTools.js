"use client";
import { useState } from "react";
import Link from "next/link";

// Interactive client dashboard: search your tools, copy a license key,
// see delivery / warranty status per item.
export default function MyTools({ items }) {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(null);
  const [tab, setTab] = useState("all");
  const filtered = items.filter((i) => {
    const hay = `${i.name} ${i.tool_slug}`.toLowerCase();
    return (!q || hay.includes(q.toLowerCase())) && (tab === "all" || (tab === "download" ? i.download_token : !i.download_token));
  });
  async function copy(key, id) {
    try { await navigator.clipboard.writeText(key); } catch { /* clipboard unavailable */ }
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your tools..." className="input !w-72 !py-2.5" />
        {[["all", "All tools"], ["download", "With download"], ["keys", "Keys only"]].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === v ? "bg-brand-gradient text-white" : "border border-line bg-white text-muted hover:text-[#F3A620]"}`}>{l}</button>
        ))}
        <span className="text-sm text-muted">{filtered.length} of {items.length} tools</span>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((i) => (
          <div key={i.id} className="rounded-3xl border border-line bg-white p-6 shadow-sm">
            <div className="mb-4 h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${i.from_color || "#F3A620"}, ${i.to_color || "#0EA5E9"})` }} />
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-bold">{i.name}</h3>
              <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-[#F3A620]">Active · {i.warranty || "Warranty as listed"}</span>
            </div>
            <p className="mt-1 text-sm text-muted">Bought {new Date(i.created_at).toLocaleDateString("en-PK")} · {i.delivery || "Instant"} delivery</p>
            <p className="mt-3 text-sm text-muted">License key</p>
            <div className="mt-1 flex gap-2">
              <code className="flex-1 overflow-x-auto rounded-xl bg-[#FAF7F0] px-4 py-3 text-[#0EA5E9]">{i.license_key}</code>
              <button onClick={() => copy(i.license_key, i.id)} className="btn-ghost !px-4 !py-2 text-sm">{copied === i.id ? "Copied ✓" : "Copy"}</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {i.url && <a href={i.url} target="_blank" rel="noreferrer" className="btn-primary !py-2 text-sm">Launch tool</a>}
              {i.download_token && <a href={`/api/downloads/${i.download_token}`} className="btn-ghost !py-2 text-sm">Download file</a>}
              <Link href={`/tools/${i.tool_slug}`} className="btn-ghost !py-2 text-sm">Details</Link>
            </div>
            {i.download_token && <p className="mt-3 text-xs text-muted">Download link expires {new Date(i.download_expires).toLocaleDateString("en-PK")} (7 days from purchase, 5 downloads). Your license key above never expires.</p>}
          </div>
        ))}
      </div>
      {!filtered.length && <p className="py-10 text-center text-muted">No tools match this search.</p>}
    </div>
  );
}
