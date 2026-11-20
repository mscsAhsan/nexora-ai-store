import PageHeader from "@/components/PageHeader";
import CategoryChips from "@/components/CategoryChips";
import ToolGrid from "@/components/ToolGrid";
import { Icon } from "@/components/Icons";
import { getTools } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "All AI tools - Nexavo AI" };

export default async function ToolsPage({ searchParams }) {
  const q = searchParams.q || "";
  const category = searchParams.category || "All";
  const tools = await getTools({ search: q, category });
  return (
    <>
      <PageHeader title="Browse AI tools" subtitle="Find the right tool for writing, design, video, code and more.">
        <form action="/tools" className="glass mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-full p-2 pl-5">
          <Icon name="search" className="text-muted" />
          <input name="q" defaultValue={q} placeholder="Search tools..." className="w-full bg-transparent py-2.5 outline-none placeholder:text-[#9CA3AF]" />
          {category !== "All" && <input type="hidden" name="category" value={category} />}
          <button className="btn-primary !px-6 !py-2.5 text-sm">Search</button>
        </form>
      </PageHeader>
      <section className="section pb-6"><CategoryChips active={category} q={q} /></section>
      <section className="section pt-10">
        <p className="mb-6 text-sm text-muted">{tools.length} tool{tools.length === 1 ? "" : "s"} {q && `for "${q}"`}</p>
        <ToolGrid tools={tools} />
      </section>
    </>
  );
}
