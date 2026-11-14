import AdminToolManager from "@/components/AdminToolManager";
import { getTools } from "@/lib/data";

export default async function AdminTools() { return <AdminToolManager tools={await getTools({ all: true })} />; }
