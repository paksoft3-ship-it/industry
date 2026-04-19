import { getContactMessages } from "@/lib/actions/contact";
import AdminMesajlarClient from "./AdminMesajlarClient";

export const dynamic = "force-dynamic";

export default async function AdminMesajlarPage() {
  const messages = await getContactMessages();
  return <AdminMesajlarClient messages={messages.map(m => ({ ...m, createdAt: m.createdAt.toISOString() }))} />;
}
