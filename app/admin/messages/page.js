import { q } from "@/lib/db";
import { fmtDate } from "@/lib/data";

export default async function AdminMessages() {
  const msgs = await q("SELECT * FROM messages ORDER BY id DESC LIMIT 100");
  if (!msgs.length) return <div className="glass rounded-3xl p-10 text-center text-muted">No messages yet.</div>;
  return (
    <div className="space-y-4">{msgs.map((m) => (
      <div key={m.id} className="glass rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{m.name} <a href={`mailto:${m.email}`} className="font-normal text-cyan-brand hover:underline">&lt;{m.email}&gt;</a></p><p className="text-xs text-muted">{fmtDate(m.created_at)} &middot; {m.subject}</p></div>
        <p className="mt-3 whitespace-pre-wrap text-muted">{m.body}</p>
      </div>))}</div>
  );
}
