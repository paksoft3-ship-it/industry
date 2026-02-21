import { getBundles } from "@/lib/actions/bundles";
import { getProducts } from "@/lib/actions/products";
import AdminBundlesClient from "./AdminBundlesClient";

export default async function AdminBundlesPage() {
  const [bundlesRaw, productsResult] = await Promise.all([
    getBundles(),
    getProducts({ page: 1, limit: 1000 }),
  ]);
  const bundles = JSON.parse(JSON.stringify(bundlesRaw));
  const products = JSON.parse(JSON.stringify(productsResult.products));
  return <AdminBundlesClient bundles={bundles} products={products} />;
}
