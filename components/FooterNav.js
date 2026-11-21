"use client";
import Link from "next/link";
import { useState } from "react";

// Phones: tap-to-open accordions (like the reference). md and up: normal columns.
export default function FooterNav({ cols }) {
  const [open, setOpen] = useState(null);
  return cols.map(([t, ls]) => (
    <div key={t} className="rounded-2xl border border-line bg-white md:rounded-none md:border-0 md:bg-transparent">
      <button type="button" onClick={() => setOpen(open === t ? null : t)} aria-expanded={open === t}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left text-xs font-extrabold uppercase tracking-[.16em] md:cursor-default md:px-0 md:pb-4 md:pt-0 md:text-base md:font-semibold md:normal-case md:tracking-normal">
        {t}<span className="text-lg leading-none text-[#F3A620] md:hidden">{open === t ? "−" : "+"}</span>
      </button>
      <ul className={`space-y-3 px-4 pb-4 text-sm text-muted md:block md:space-y-2.5 md:px-0 md:pb-0 ${open === t ? "block" : "hidden"}`}>
        {ls.map(([l, h]) => <li key={l}><Link href={h} className="hover:text-violet-brand">{l}</Link></li>)}
      </ul>
    </div>
  ));
}
