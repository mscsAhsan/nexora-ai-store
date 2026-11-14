import Link from "next/link";
import Reveal from "./Reveal";
import { Icon } from "./Icons";

export default function CTA() {
  return (
    <section className="section pt-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[28px] bg-cta-gradient px-8 py-12 sm:px-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-cyan-brand/30 blur-3xl" />
          <svg className="absolute right-4 top-4 h-40 w-40 animate-spin-slow opacity-30" viewBox="0 0 100 100" fill="none" stroke="#fff"><circle cx="50" cy="50" r="46" strokeDasharray="3 6" /><circle cx="50" cy="50" r="30" strokeDasharray="2 5" /></svg>
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <h2 className="max-w-md text-3xl font-bold sm:text-[32px]">Ready to power up your workflow?</h2>
            <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-[#4C2FD6] shadow-xl transition hover:scale-105">Start free today <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
