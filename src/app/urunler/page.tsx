"use client";
import { useState } from "react";
import { products, categories } from "@/data/siteData";
import ProductCard from "@/components/products/ProductCard";
import MaterialIcon from "@/components/ui/MaterialIcon";
import Link from "next/link";

export default function ProductListingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
        <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
        <MaterialIcon icon="chevron_right" className="text-xs" />
        <span className="text-text-main font-bold">Ürünler</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-28">
            <h3 className="font-bold text-lg mb-4 font-[family-name:var(--font-display)]">Kategoriler</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedCategory ? "bg-primary/10 text-primary" : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                Tüm Ürünler ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.id ? "bg-primary/10 text-primary" : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {cat.name} ({cat.productCount})
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-6 pt-6">
              <h3 className="font-bold text-lg mb-4 font-[family-name:var(--font-display)]">Fiyat Aralığı</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
                <span className="flex items-center text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 mt-6 pt-6">
              <h3 className="font-bold text-lg mb-4 font-[family-name:var(--font-display)]">Stok Durumu</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" defaultChecked />
                <span className="text-sm text-gray-600">Stokta Olanlar</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-text-main">{filteredProducts.length}</span> ürün bulundu
            </p>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 pl-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
              >
                <option value="featured">Öne Çıkanlar</option>
                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="newest">En Yeniler</option>
                <option value="rating">En Çok Değerlendirilen</option>
              </select>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  <MaterialIcon icon="grid_view" className="text-[20px]" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  <MaterialIcon icon="view_list" className="text-[20px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <MaterialIcon icon="search_off" className="text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500">Bu kategoride ürün bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
