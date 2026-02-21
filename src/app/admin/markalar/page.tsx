import { getBrands } from "@/lib/actions/brands";
import AdminBrandsClient from "./AdminBrandsClient";

export default async function AdminBrandsPage() {
  const brands = await getBrands({ includeInactive: true });

  return <AdminBrandsClient brands={JSON.parse(JSON.stringify(brands))} />;
}
