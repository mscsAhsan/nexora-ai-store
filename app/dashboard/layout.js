import PageHeader from "@/components/PageHeader";
import SubNav from "@/components/SubNav";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashLayout({ children }) {
  const user = await requireUser();
  return (
    <>
      <PageHeader title={`Hi, ${user.name.split(" ")[0]}`} subtitle={`Current plan: ${user.plan}`} />
      <section className="section pt-4">
        <SubNav links={[["My tools", "/dashboard"], ["Orders", "/dashboard/orders"], ["Settings", "/dashboard/settings"]]} />
        {children}
      </section>
    </>
  );
}
