import { q } from "@/lib/db";
import { fmtDate } from "@/lib/data";

export default async function AdminUsers() {
  const users = await q("SELECT id,name,email,role,plan,created_at FROM users ORDER BY id DESC");
  return (
    <div className="overflow-x-auto rounded-3xl border border-line bg-card">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="border-b border-line text-muted"><tr>{["Name", "Email", "Role", "Plan", "Joined"].map((h) => <th key={h} className="px-5 py-4 font-medium">{h}</th>)}</tr></thead>
        <tbody>{users.map((u) => <tr key={u.id} className="border-b border-line last:border-0"><td className="px-5 py-3 font-semibold">{u.name}</td><td className="px-5 py-3">{u.email}</td><td className="px-5 py-3 capitalize">{u.role}</td><td className="px-5 py-3">{u.plan}</td><td className="px-5 py-3 text-muted">{fmtDate(u.created_at)}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
