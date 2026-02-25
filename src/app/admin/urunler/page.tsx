import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getAdminProducts } from "@/lib/actions/products";
import { getAllCategories } from "@/lib/actions/categories";
import { getBrands } from "@/lib/actions/brands";
import AdminProductsClient from "./AdminProductsClient";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const categoryId = params.category || "";
  const brandId = params.brand || "";
  const status = params.status || "";
  const page = parseInt(params.page || "1", 10);

  const [productsData, categories, brands] = await Promise.all([
    getAdminProducts({ search, categoryId, brandId, status, page, limit: 20 }),
    getAllCategories(),
    getBrands({ includeInactive: true }),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Ürünler</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam {productsData.total} ürün</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/urunler/import"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <MaterialIcon icon="upload_file" className="text-lg" />
            Toplu Yükle
          </Link>
          <Link
            href="/admin/urunler/new"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <MaterialIcon icon="add" className="text-lg" />
            Yeni Ürün Ekle
          </Link>
        </div>
      </div>

      {/* Filters */}
      <AdminProductsClient
        products={JSON.parse(JSON.stringify(productsData.products))}
        total={productsData.total}
        totalPages={productsData.totalPages}
        currentPage={page}
        categories={JSON.parse(JSON.stringify(categories))}
        brands={JSON.parse(JSON.stringify(brands))}
        filters={{ search, categoryId, brandId, status }}
      />
    </div>
  );
}
