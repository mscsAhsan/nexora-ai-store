"use client";
import Link from "next/link";
import { Star, ToolTile } from "./Icons";
import { useCart } from "./CartContext";
import { formatPKR } from "@/lib/format";
import { categoryColors } from "@/lib/tools";

export default function ToolCard({ tool }) {
  const { add } = useCart();
  const col = categoryColors[tool.category];
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#0E7A5F] hover:shadow-xl">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-30" style={{ background: tool.from }} />
      <div className="relative flex items-start justify-between">
        <ToolTile tool={tool} />
        <span className="rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold" style={{ color: col }}>{tool.category}</span>
      </div>
      <Link href={`/tools/${tool.slug}`} className="relative mt-5 block text-[20px] font-bold leading-snug hover:text-cyan-brand">{tool.name}</Link>
      <p className="relative mt-1 text-xs font-semibold text-muted">{tool.brand}{tool.duration ? ` · ${tool.duration}` : ""}{tool.accessType ? ` · ${tool.accessType}` : ""}</p>
      <p className="relative mt-2 min-h-[44px] text-[14.5px] leading-relaxed text-muted">{tool.desc}</p>
      <div className="relative mt-3 flex flex-wrap gap-2">
        {tool.delivery && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-[#0E7A5F]">{tool.delivery === "Instant" ? "⚡ Instant delivery" : "Manual review"}</span>}
        {tool.warranty && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">{tool.warranty}</span>}
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">In stock</span>
      </div>
      <div className="relative my-5 h-px bg-line" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm"><Star size={16} /><b>{tool.rating}</b><span className="text-xs text-muted">({(tool.reviews / 1000).toFixed(1)}k)</span></div>
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-bold">{formatPKR(tool.price)}</span>
          <button onClick={() => add(tool)} className="btn-primary !px-4 !py-2 text-sm">Buy</button>
        </div>
      </div>
    </div>
  );
}
