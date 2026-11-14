import Link from "next/link";
import { categories, categoryColors } from "@/lib/tools";

export default function CategoryChips({ active = "All", q = "" }) {
  return (
    <div id="categories" className="flex flex-wrap justify-center gap-3">
      {categories.map((c) => {
        const href = `/tools?${new URLSearchParams({ ...(c !== "All" && { category: c }), ...(q && { q }) })}`;
        return (
          <Link key={c} href={href} className={`flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[14.5px] transition ${active === c ? "border-violet-brand bg-violet-brand/20" : "border-line bg-card hover:border-violet-brand/60"}`}>
            {c !== "All" && <span className="h-2.5 w-2.5 rounded-full" style={{ background: categoryColors[c] }} />}
            {c}
          </Link>
        );
      })}
    </div>
  );
}
