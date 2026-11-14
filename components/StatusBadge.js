export default function StatusBadge({ status }) {
  const c = { paid: "bg-emerald-500/15 text-emerald-400", pending: "bg-amber-500/15 text-amber-400", cancelled: "bg-pink-500/15 text-pink-400" }[status] || "";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${c}`}>{status}</span>;
}
