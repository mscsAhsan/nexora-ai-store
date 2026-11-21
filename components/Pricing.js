"use client";
import Link from "next/link";
import { useState } from "react";
import { plans } from "@/lib/tools";
import { formatPKR } from "@/lib/format";
import { Icon } from "./Icons";
import Reveal from "./Reveal";

export default function Pricing({ heading = true }) {
  const [yearly, setYearly] = useState(false);
  return (
    <section id="pricing" className="section scroll-mt-24 pt-12 sm:pt-20">
      {heading && (
        <Reveal>
          <div className="text-center">
            <h2 className="text-[1.65rem] font-bold leading-tight sm:text-[40px]">Simple, transparent pricing</h2>
            <p className="mt-2 text-base text-muted sm:mt-3 sm:text-lg">Pick a plan, cancel anytime</p>
          </div>
        </Reveal>
      )}
      <div className="mt-7 text-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-line bg-card p-1.5">
          {[["Monthly", false], ["Yearly -20%", true]].map(([l, y]) => (
            <button key={l} onClick={() => setYearly(y)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${yearly === y ? "bg-brand-gradient text-white" : "text-muted hover:text-violet-brand"}`}>{l}</button>
          ))}
        </div>
        {yearly && <p className="mt-3 text-xs text-muted">Yearly price shown per month. Checkout currently bills the plan for one month.</p>}
      </div>
      <div className="mt-8 grid items-center gap-5 sm:mt-10 sm:gap-6 md:grid-cols-3">
        {plans.map((p, i) => {
          const price = yearly ? Math.round(p.monthly * 0.8) : p.monthly;
          return (
            <Reveal key={p.name} delay={i * 100}>
              <div className={p.hot ? "rounded-[26px] bg-brand-gradient p-[2px] shadow-2xl shadow-violet-brand/30 md:scale-[1.04]" : ""}>
                <div className={`relative rounded-3xl p-6 sm:p-8 ${p.hot ? "bg-[#FFF8EF]" : "border border-line bg-card"}`}>
                  {p.hot && <span className="absolute right-6 top-6 rounded-full bg-pink-brand px-3 py-1 text-[11px] font-bold tracking-wider">POPULAR</span>}
                  <h3 className="text-2xl font-bold">{p.name}</h3>
                  <p className="mt-4"><span className="text-4xl font-extrabold sm:text-5xl">{formatPKR(price)}</span><span className="ml-1.5 text-muted">/month</span></p>
                  <p className="mt-1 text-sm text-muted">{p.desc}</p>
                  <ul className="my-7 space-y-3.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-[15px]"><span className="grid h-5 w-5 place-items-center rounded-full bg-cyan-brand/20 text-cyan-brand"><Icon name="check" size={12} stroke={3} /></span>{f}</li>
                    ))}
                  </ul>
                  <Link href={p.monthly === 0 ? "/register" : `/checkout?plan=${p.name}`} className={`w-full ${p.hot ? "btn-primary" : "btn-ghost"}`}>{p.monthly === 0 ? "Start free" : `Choose ${p.name}`}</Link>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
