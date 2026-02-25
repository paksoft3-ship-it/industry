"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { deleteProduct } from "@/lib/actions/products";

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  inStock: boolean;
  stockCount: number;
  isActive: boolean;
  isFeatured: boolean;
  images: { id: string; url: string }[];
  brand: { id: string; name: string } | null;
  categories: { category: { id: string; name: string } }[];
};

type Category = {
  id: string;
  name: string;
  parent: { name: string } | null;
};

type Brand = {
  id: string;
  name: string;
};

function getProductStatus(p: Product) {
  if (!p.isActive) return { label: "Pasif", cls: "bg-gray-100 text-gray-500" };
  if (!p.inStock || p.stockCount <= 0) return { label: "Stokta Yok", cls: "bg-red-100 text-red-700" };
  if (p.stockCount <= 5) return { label: "Az Stok", cls: "bg-yellow-100 text-yellow-700" };
  return { label: "Aktif", cls: "bg-green-100 text-green-700" };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
}

export default function AdminProductsClient({
  products,
  total,
  totalPages,
  currentPage,
  categories,
  brands,
  filters,
}: {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
  categories: Category[];
  brands: Brand[];
  filters: { search: string; categoryId: string; brandId: string; status: string };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.search);

  function updateFilters(updates: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = { ...filters, ...updates };
    if (merged.search) params.set("search", merged.search);
    if (merged.categoryId) params.set("category", merged.categoryId);
    if (merged.brandId) params.set("brand", merged.brandId);
    if (merged.status) params.set("status", merged.status);
    router.push(`/admin/urunler?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilters({ search, page: "" });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) return;
    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast.success("Ürün silindi");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Silme başarısız");
      }
    });
  }

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 min-w-[240px] relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün adı veya SKU ile ara..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </form>
          <select
            value={filters.categoryId}
            onChange={(e) => updateFilters({ categoryId: e.target.value, page: "" })}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.parent ? `${c.parent.name} → ` : ""}{c.name}
              </option>
            ))}
          </select>
          <select
            value={filters.brandId}
            onChange={(e) => updateFilters({ brandId: e.target.value, page: "" })}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Tüm Markalar</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value, page: "" })}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
            <option value="outofstock">Stokta Yok</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Görsel</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Marka</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fiyat</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    Ürün bulunamadı
                  </td>
                </tr>
              )}
              {products.map((product) => {
                const status = getProductStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.images[0] ? (
                          <Image src={product.images[0].url} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <MaterialIcon icon="image" className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/urunler/${product.id}`} className="font-medium text-gray-800 hover:text-primary transition-colors">
                        {product.name}
                      </Link>
                      {product.isFeatured && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">
                          Öne Çıkan
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                    <td className="px-6 py-4 text-gray-600 text-xs">{product.brand?.name || "—"}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{formatPrice(Number(product.price))}</td>
                    <td className="px-6 py-4 text-gray-700">{product.stockCount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/urunler/${product.id}`}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <MaterialIcon icon="edit" className="text-lg" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={isPending}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Sil"
                        >
                          <MaterialIcon icon="delete" className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, total)} / {total} ürün
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateFilters({ page: String(currentPage - 1) })}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Önceki
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateFilters({ page: String(pageNum) })}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      pageNum === currentPage
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => updateFilters({ page: String(currentPage + 1) })}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
