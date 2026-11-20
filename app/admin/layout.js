import PageHeader from "@/components/PageHeader";
import SubNav from "@/components/SubNav";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Admin panel" subtitle="Manage orders, tools, users and messages." />
      <section className="section pt-4">
        <SubNav links={[["Overview", "/admin"], ["Tools", "/admin/tools"], ["Users", "/admin/users"], ["Messages", "/admin/messages"], ["Settings", "/admin/settings"]]} />
        {children}
      </section>
    </>
  );
}
