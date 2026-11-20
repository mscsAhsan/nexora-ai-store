export default function StatusBadge({ status }) {
  const c = { paid: "bg-emerald-100 text-emerald-700", pending: "bg-amber-100 text-amber-700", cancelled: "bg-rose-100 text-rose-700" }[status] || "";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${c}`}>{status}</span>;
}
