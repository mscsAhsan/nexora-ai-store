import ToolCard from "./ToolCard";
import Reveal from "./Reveal";

export default function ToolGrid({ tools }) {
  if (!tools.length) return <p className="py-16 text-center text-muted">No tools found. Try another search or category.</p>;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((t, i) => <Reveal key={t.slug} delay={(i % 3) * 80}><ToolCard tool={t} /></Reveal>)}
    </div>
  );
}
