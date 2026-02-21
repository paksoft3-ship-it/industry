import { getCategoryTree } from "@/lib/actions/categories";
import AdminCategoriesClient from "./AdminCategoriesClient";

export default async function AdminCategoriesPage() {
  const categories = await getCategoryTree(true);

  return (
    <AdminCategoriesClient categories={JSON.parse(JSON.stringify(categories))} />
  );
}
