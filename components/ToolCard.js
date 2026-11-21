"use client";
import Link from "next/link";
import { Star, ToolTile } from "./Icons";
import { useCart } from "./CartContext";
import { formatPKR } from "@/lib/format";
import { categoryColors } from "@/lib/tools";

// Mobile: compact 2-per-row card (tile, name, price, full-width Buy now).
// sm and up: the full original card.
export default function ToolCard({ tool }) {
  const { add } = useCart();
  const col = categoryColors[tool.category];
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-sm transition duration-300 hover:border-[#F3A620] hover:shadow-xl sm:rounded-3xl sm:p-6 md:hover:-translate-y-2">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-30" style={{ background: tool.from }} />
      <div className="relative flex items-start justify-between gap-2">
        <span className="sm:hidden"><ToolTile tool={tool} size={40} /></span>
        <span className="hidden sm:block"><ToolTile tool={tool} /></span>
        <span className="max-w-[60%] truncate rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold sm:max-w-none sm:px-3.5 sm:py-1.5 sm:text-xs" style={{ color: col }}>{tool.category}</span>
      </div>
      <Link href={`/tools/${tool.slug}`} className="relative mt-3 line-clamp-2 block text-[14px] font-bold leading-snug hover:text-cyan-brand sm:mt-5 sm:line-clamp-none sm:text-[20px]">{tool.name}</Link>
      <p className="relative mt-1 line-clamp-1 text-[11px] font-semibold text-muted sm:line-clamp-none sm:text-xs">{tool.brand}{tool.duration ? ` · ${tool.duration}` : ""}{tool.accessType ? ` · ${tool.accessType}` : ""}</p>
      <p className="relative mt-2 hidden min-h-[44px] text-[14.5px] leading-relaxed text-muted sm:block">{tool.desc}</p>
      <div className="relative mt-2 flex flex-wrap gap-1.5 pb-3 sm:mt-3 sm:gap-2 sm:pb-5">
        {tool.delivery && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-[#B9770A] sm:px-2.5 sm:py-1 sm:text-[11px] sm:text-[#F3A620]">{tool.delivery === "Instant" ? "⚡ Instant" : "Manual review"}<span className="hidden sm:inline">{tool.delivery === "Instant" ? " delivery" : ""}</span></span>}
        {tool.warranty && <span className="max-w-full truncate rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 sm:px-2.5 sm:py-1 sm:text-[11px]">{tool.warranty}</span>}
        <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 sm:inline">In stock</span>
      </div>
      <div className="relative mt-auto h-px bg-line" />
      <div className="relative mt-3 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="hidden items-center gap-1.5 text-sm sm:flex"><Star size={16} /><b>{tool.rating}</b><span className="text-xs text-muted">({(tool.reviews / 1000).toFixed(1)}k)</span></div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-[17px] font-extrabold sm:text-[22px] sm:font-bold">{formatPKR(tool.price)}</span>
          <button onClick={() => add(tool)} className="btn-primary w-full !px-4 !py-2 text-sm sm:w-auto">Buy<span className="sm:hidden">&nbsp;now</span></button>
        </div>
      </div>
    </div>
  );
}
