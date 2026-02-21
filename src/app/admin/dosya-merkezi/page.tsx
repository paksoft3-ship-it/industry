import { getFileLibraryItems } from "@/lib/actions/fileLibrary";
import AdminDosyaMerkeziClient from "./AdminDosyaMerkeziClient";

export default async function AdminDosyaMerkeziPage() {
  const itemsRaw = await getFileLibraryItems();
  const items = JSON.parse(JSON.stringify(itemsRaw));
  return <AdminDosyaMerkeziClient items={items} />;
}
