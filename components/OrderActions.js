"use client";
import { useRouter } from "next/navigation";

export default function OrderActions({ id, status }) {
  const router = useRouter();
  if (status === "paid") return <span className="text-muted">-</span>;
  async function act(action) {
    await fetch(`/api/admin/orders/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    router.refresh();
  }
  return (
    <div className="flex gap-2">
      {status === "pending" && <button onClick={() => act("approve")} className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-emerald-400 hover:bg-amber-500/30">Approve</button>}
      {status === "pending" && <button onClick={() => act("cancel")} className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-bold text-pink-400 hover:bg-pink-500/30">Cancel</button>}
    </div>
  );
}
