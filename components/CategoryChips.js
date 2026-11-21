import Link from "next/link";
import { categories, categoryColors } from "@/lib/tools";

export default function CategoryChips({ active = "All", q = "" }) {
  return (
    <div id="categories" className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:justify-center md:gap-3 md:overflow-visible md:px-0 md:pb-0">
      {categories.map((c) => {
        const href = `/tools?${new URLSearchParams({ ...(c !== "All" && { category: c }), ...(q && { q }) })}`;
        return (
          <Link key={c} href={href} className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition md:gap-2.5 md:px-5 md:py-2.5 md:text-[14.5px] ${active === c ? "border-violet-brand bg-violet-brand/20" : "border-line bg-card hover:border-violet-brand/60"}`}>
            {c !== "All" && <span className="h-2.5 w-2.5 rounded-full" style={{ background: categoryColors[c] }} />}
            {c}
          </Link>
        );
      })}
    </div>
  );
}
