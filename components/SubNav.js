"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SubNav({ links }) {
  const path = usePathname();
  return (
    <div className="mb-8 flex flex-wrap gap-2 border-b border-line pb-4">
      {links.map(([l, h]) => (
        <Link key={h} href={h} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${path === h ? "bg-brand-gradient text-white" : "text-muted hover:bg-black/5 hover:text-violet-brand"}`}>{l}</Link>
      ))}
    </div>
  );
}
