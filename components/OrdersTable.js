"use client";
import { useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

import { formatPKR, fmtDate } from "@/lib/format";

export default function OrdersTable({ orders }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = orders.filter((o) => {
    const hay = `${o.id} ${o.plan || ""} ${o.method}`.toLowerCase();
    return (!q || hay.includes(q.toLowerCase())) && (status === "all" || o.status === status);
  });
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders..." className="input !w-64 !py-2.5" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !w-auto !py-2.5">
          <option value="all">All statuses</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option>
        </select>
        <span className="text-sm text-muted">{filtered.length} of {orders.length}</span>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-line text-muted"><tr>{["Order", "Date", "Method", "Total", "Status"].map((h) => <th key={h} className="px-5 py-4 font-medium">{h}</th>)}</tr></thead>
          <tbody>{filtered.map((o) => (
            <tr key={o.id} className="border-b border-line last:border-0">
              <td className="px-5 py-4"><Link href={`/checkout/success?order=${o.id}`} className="text-cyan-brand hover:underline">#{o.id}</Link>{o.plan && <span className="ml-2 text-muted">{o.plan} plan</span>}</td>
              <td className="px-5 py-4 text-muted">{fmtDate(o.created_at)}</td><td className="px-5 py-4 capitalize">{o.method}</td><td className="px-5 py-4 font-semibold">{formatPKR(o.total)}</td><td className="px-5 py-4"><StatusBadge status={o.status} /></td>
            </tr>))}</tbody>
        </table>
        {!filtered.length && <p className="p-8 text-center text-muted">No orders match this filter.</p>}
      </div>
    </div>
  );
}
