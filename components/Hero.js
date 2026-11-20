"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon, ToolTile } from "./Icons";
import { formatPKR } from "@/lib/format";

// Sample hero (aitoolspro.org), rebranded to Nexavo AI:
// eyebrow "#1 AI TOOLS MARKETPLACE", headline "Premium AI Tools at
// Unbeatable Prices", search, benefits row, marketplace visual.
const BENEFITS = [
  ["Up to", "90% OFF"],
  ["100%", "Genuine Accounts"],
  ["Instant", "Delivery"],
  ["24/7", "Support"],
  ["Premium", "Access"],
];

export default function Hero({ tools }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const go = (e) => { e.preventDefault(); router.push(`/tools?q=${encodeURIComponent(q)}`); };

  return (
    <section className="relative overflow-hidden border-b border-[#FFE9C9] pb-16 pt-36" style={{ background: "linear-gradient(135deg,#fff 0%,#FFFDF8 54%,#FFF7F0 100%)" }}>
      <div className="section grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <span className="eyebrow">#1 AI TOOLS MARKETPLACE</span>
          <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-[#15111F] sm:text-6xl md:text-[4.2rem]">
            Premium AI Tools<br />at <span style={{ color: "#F3A620" }}>Unbeatable Prices</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            ChatGPT, Claude, Gemini, Canva, CapCut, Adobe, Microsoft, VPNs and 349 premium digital tools — in PKR, with Safepay, JazzCash, Easypaisa and Raast.
          </p>
          <form onSubmit={go} className="mt-8 flex max-w-xl items-center gap-3 rounded-full border border-[#FFB466] bg-white p-2 pl-6 shadow-[0_12px_32px_rgba(101,80,45,.10)]">
            <Icon name="search" className="text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search premium tools" className="w-full bg-transparent py-3 text-base outline-none placeholder:text-[#857D8E]" aria-label="Search premium tools" />
            <button className="btn-primary !px-7">Search</button>
          </form>
          <div className="mt-8 flex flex-wrap gap-3">
            {BENEFITS.map(([a, b]) => (
              <div key={b} className="rounded-2xl border border-[rgba(112,97,72,.10)] bg-white/80 px-4 py-3 shadow-[0_6px_18px_rgba(48,32,67,.04)]">
                <p className="text-sm font-bold text-[#26202E]">{a} <span className="text-[#AD5A00]">{b}</span></p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">Trusted by 2,800+ creators &amp; pros · Prices in PKR · 10% off your first order with WELCOME10</p>
          <div className="mt-4">
            <Link href="/tools" className="btn-ghost">Explore all tools →</Link>
          </div>
        </div>
        <div className="relative">
          <img src="/images/hero-ai-marketplace.webp" alt="Nexavo AI marketplace — premium AI tools" className="w-full rounded-[24px] shadow-[0_18px_32px_rgba(87,70,42,.12)]" style={{ filter: "drop-shadow(0 18px 32px rgba(87,70,42,.12))" }} />
          <div className="absolute bottom-4 right-4 rounded-2xl border border-[#EDE9E0] bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-bold text-[#3B3345]">349 tools in stock</p>
            <p className="text-xs text-muted">Instant delivery after payment</p>
          </div>
          {tools[0] && (
            <div className="absolute -left-3 top-6 hidden items-center gap-3 rounded-2xl border border-line bg-white p-3 pr-5 shadow-xl lg:flex">
              <ToolTile tool={tools[0]} size={44} />
              <div><p className="text-sm font-semibold">{tools[0].name}</p><p className="text-xs text-muted">{formatPKR(tools[0].price)}</p></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
