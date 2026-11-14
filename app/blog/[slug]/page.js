import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { posts } from "@/lib/blog";

export function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }
export function generateMetadata({ params }) { const p = posts.find((x) => x.slug === params.slug); return { title: p ? `${p.title} - Nexora AI` : "Not found" }; }

export default function Post({ params }) {
  const p = posts.find((x) => x.slug === params.slug);
  if (!p) notFound();
  return (
    <>
      <PageHeader title={p.title} subtitle={`${p.date} \u00b7 ${p.read} read`} />
      <article className="section max-w-2xl space-y-6 pt-10 text-lg leading-relaxed text-[#D5DCF2]">
        {p.body.map((t, i) => <p key={i}>{t}</p>)}
        <div className="pt-6"><Link href="/blog" className="text-cyan-brand hover:underline">&larr; Back to blog</Link></div>
      </article>
    </>
  );
}
