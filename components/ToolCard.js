"use client";
import Link from "next/link";
import { Icon, Star, ToolTile } from "./Icons";
import { useCart } from "./CartContext";
import { categoryColors } from "@/lib/tools";

export default function ToolCard({ tool }) {
  const { add } = useCart();
  const col = categoryColors[tool.category];
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-line bg-card p-6 transition duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl"
      style={{ ["--glow"]: tool.from }}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-60" style={{ background: tool.from }} />
      <div className="relative flex items-start justify-between">
        <ToolTile tool={tool} />
        <span className="rounded-full bg-[#1D2650] px-3.5 py-1.5 text-xs font-bold" style={{ color: col }}>{tool.category}</span>
      </div>
      <Link href={`/tools/${tool.slug}`} className="relative mt-5 block text-[22px] font-bold hover:text-cyan-brand">{tool.name}</Link>
      <p className="relative mt-2 min-h-[44px] text-[14.5px] leading-relaxed text-muted">{tool.desc}</p>
      <div className="relative my-5 h-px bg-line" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm"><Star size={16} /><b>{tool.rating}</b><span className="text-xs text-muted">({(tool.reviews / 1000).toFixed(1)}k reviews)</span></div>
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-bold">${tool.price}</span>
          <button onClick={() => add(tool)} className="btn-primary !px-4 !py-2 text-sm">Buy</button>
        </div>
      </div>
    </div>
  );
}
