import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { posts } from "@/lib/blog";

export const metadata = { title: "Blog - Nexora AI" };

export default function Blog() {
  return (
    <>
      <PageHeader title="The Nexora blog" subtitle="Guides and tips for getting more done with AI." />
      <section className="section grid gap-6 pt-10 md:grid-cols-3">
        {posts.map((p, i) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group overflow-hidden rounded-3xl border border-line bg-card transition hover:-translate-y-2 hover:border-violet-brand">
            <div className="h-40" style={{ background: `linear-gradient(135deg, ${["#7C5CFF,#22D3EE", "#F472B6,#7C5CFF", "#22D3EE,#34D399"][i % 3]})` }} />
            <div className="p-6">
              <p className="text-xs text-muted">{p.date} &middot; {p.read}</p>
              <h3 className="mt-2 text-xl font-bold group-hover:text-cyan-brand">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
