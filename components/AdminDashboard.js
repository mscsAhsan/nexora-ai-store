"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import OrderActions from "./OrderActions";

import { formatPKR, fmtDate } from "@/lib/format";

// Interactive admin overview: search + status/method filters, 7-day revenue
// chart (pure CSS bars), payment-method breakdown and top-selling tools.
export default function AdminDashboard({ stats, orders, daily, methods, topTools }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const maxDay = Math.max(1, ...daily.map((d) => d.total));
  const filtered = useMemo(() => orders.filter((o) => {
    const hay = `${o.id} ${o.email} ${o.reference || ""}`.toLowerCase();
    return (!q || hay.includes(q.toLowerCase()))
      && (status === "all" || o.status === status)
      && (method === "all" || o.method === method);
  }), [orders, q, status, method]);
  const cards = [["Revenue (paid)", formatPKR(stats.revenue)], ["Orders", stats.orders], ["Pending", stats.pending], ["Users", stats.users], ["Messages", stats.messages], ["Subscribers", stats.subs]];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">{cards.map(([l, v]) => <div key={l} className="glass rounded-2xl p-5"><p className="text-sm text-muted">{l}</p><p className="mt-1 text-2xl font-bold">{v}</p></div>)}</div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold">Revenue — last 7 days</h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {daily.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-bold">{d.total ? formatPKR(d.total) : ""}</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[#0E7A5F] to-[#0F766E]" style={{ height: `${Math.max(4, (d.total / maxDay) * 110)}px` }} />
                <span className="text-xs text-muted">{d.day.slice(5)}</span>
              </div>
            ))}
          </div>
          {!daily.some((d) => d.total) && <p className="mt-4 text-sm text-muted">No paid orders in the last 7 days yet — the chart fills in as orders are paid.</p>}
        </div>
        <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Payment methods</h2>
          <ul className="mt-4 space-y-3">
            {methods.length ? methods.map((m) => (
              <li key={m.method} className="flex justify-between text-sm"><span className="capitalize">{m.method}</span><b>{m.count} order{m.count === 1 ? "" : "s"} · {formatPKR(m.total)}</b></li>
            )) : <li className="text-sm text-muted">No orders yet.</li>}
          </ul>
          <h2 className="mt-8 text-lg font-bold">Top-selling tools</h2>
          <ul className="mt-4 space-y-3">
            {topTools.length ? topTools.map((t) => (
              <li key={t.name} className="flex justify-between text-sm"><Link href={`/tools/${t.tool_slug}`} className="hover:text-[#0E7A5F]">{t.name}</Link><b>{t.sold} sold</b></li>
            )) : <li className="text-sm text-muted">No sales yet.</li>}
          </ul>
        </div>
      </div>
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold">Recent orders</h2>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order #, email or reference..." className="input !w-72 !py-2" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !w-auto !py-2">
            <option value="all">All statuses</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option>
          </select>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="input !w-auto !py-2">
            <option value="all">All methods</option><option value="safepay">Safepay</option><option value="manual">Manual</option><option value="demo">Test</option>
          </select>
          <span className="text-sm text-muted">{filtered.length} of {orders.length}</span>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-line bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line text-muted"><tr>{["#", "Customer", "Date", "Method", "Reference", "Total", "Status", "Action"].map((h) => <th key={h} className="px-4 py-4 font-medium">{h}</th>)}</tr></thead>
            <tbody>{filtered.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">#{o.id}</td><td className="px-4 py-3">{o.email}</td><td className="px-4 py-3 text-muted">{fmtDate(o.created_at)}</td><td className="px-4 py-3 capitalize">{o.method}</td><td className="px-4 py-3 text-muted">{o.reference || "-"}</td><td className="px-4 py-3 font-semibold">{formatPKR(o.total)}</td><td className="px-4 py-3"><StatusBadge status={o.status} /></td><td className="px-4 py-3"><OrderActions id={o.id} status={o.status} /></td>
              </tr>))}</tbody>
          </table>
          {!filtered.length && <p className="p-8 text-center text-muted">No orders match this filter.</p>}
        </div>
      </div>
    </div>
  );
}
