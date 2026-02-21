import { getStaticPages } from "@/lib/actions/staticPages";
import AdminSayfalarClient from "./AdminSayfalarClient";

export default async function AdminSayfalarPage() {
  const pagesRaw = await getStaticPages();
  const pages = JSON.parse(JSON.stringify(pagesRaw));
  return <AdminSayfalarClient pages={pages} />;
}
