"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, ToolTile } from "./Icons";
import { formatPKR } from "@/lib/format";

function Floating({ tool, className, delay }) {
  return (
    <div className={`glass absolute hidden items-center gap-3 rounded-2xl p-3 pr-5 shadow-2xl lg:flex animate-float ${className}`} style={{ animationDelay: delay }}>
      <ToolTile tool={tool} size={44} />
      <div><p className="text-sm font-semibold">{tool.name}</p><p className="text-xs text-muted">{formatPKR(tool.price)}/mo</p></div>
    </div>
  );
}

export default function Hero({ tools }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const go = (e) => { e.preventDefault(); router.push(`/tools?q=${encodeURIComponent(q)}`); };

  return (
    <section className="noise relative isolate overflow-hidden pb-24 pt-40">
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="absolute -left-32 top-0 -z-10 h-[520px] w-[520px] animate-blob rounded-full bg-violet-brand/30 blur-[120px]" />
      <div className="absolute -right-24 top-10 -z-10 h-[460px] w-[460px] animate-blob rounded-full bg-cyan-brand/20 blur-[120px]" style={{ animationDelay: "-5s" }} />
      <div className="absolute left-1/3 top-72 -z-10 h-[380px] w-[380px] animate-blob rounded-full bg-pink-brand/15 blur-[120px]" style={{ animationDelay: "-9s" }} />

      {/* rotating orbit ring */}
      <svg className="absolute left-1/2 top-24 -z-10 h-[900px] w-[900px] -translate-x-1/2 animate-spin-slow opacity-30" viewBox="0 0 900 900" fill="none">
        <circle cx="450" cy="450" r="440" stroke="url(#g1)" strokeWidth="1.2" strokeDasharray="4 12" />
        <circle cx="450" cy="450" r="330" stroke="url(#g1)" strokeWidth="1" strokeDasharray="2 10" />
        <circle cx="450" cy="10" r="7" fill="#0F766E" /><circle cx="120" cy="680" r="6" fill="#F59E0B" /><circle cx="780" cy="560" r="5" fill="#0E7A5F" />
        <defs><linearGradient id="g1" x1="0" y1="0" x2="900" y2="900"><stop stopColor="#0E7A5F" /><stop offset="1" stopColor="#0F766E" /></linearGradient></defs>
      </svg>

      {tools[0] && <Floating tool={tools[0]} className="left-[6%] top-[190px]" delay="0s" />}
      {tools[1] && <Floating tool={tools[1]} className="right-[6%] top-[230px]" delay="-2s" />}
      {tools[2] && <Floating tool={tools[2]} className="left-[10%] top-[470px]" delay="-4s" />}
      {tools[3] && <Floating tool={tools[3]} className="right-[9%] top-[500px]" delay="-1s" />}

      <div className="section text-center">
        <div className="glass mx-auto inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[13.5px] font-semibold text-[#0E7A5F]">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inset-0 animate-pulse-ring rounded-full bg-cyan-brand" /><span className="relative h-2.5 w-2.5 rounded-full bg-cyan-brand" /></span>
          81 premium subscriptions in PKR, one marketplace
        </div>
        <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Buy AI tools &amp; digital subscriptions <span className="shimmer-text">online in Pakistan</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
          ChatGPT, Gemini, Canva, CapCut, Adobe, Figma, Spotify and 80+ premium tools — pay in PKR with Safepay, JazzCash, Easypaisa or Raast, and get instant access in under 60 seconds.
        </p>
        <form onSubmit={go} className="glass mx-auto mt-10 flex max-w-2xl items-center gap-3 rounded-full p-2 pl-6 shadow-2xl shadow-violet-brand/10 focus-within:border-violet-brand">
          <Icon name="search" className="text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools: ChatGPT, Canva, Gemini, CapCut..." className="w-full bg-transparent py-3 text-base outline-none placeholder:text-[#9CA3AF]" />
          <button className="btn-primary !px-7">Search</button>
        </form>
        <p className="mt-7 text-sm text-muted">Trusted by 2,800+ creators &amp; pros · Prices in PKR · 10% off your first order with WELCOME10</p>
      </div>
    </section>
  );
}
