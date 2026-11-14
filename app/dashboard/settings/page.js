import SettingsForm from "@/components/SettingsForm";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Settings - Nexora AI" };

export default async function Settings() { const user = await requireUser(); return <SettingsForm user={user} />; }
