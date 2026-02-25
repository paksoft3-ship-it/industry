"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface FeaturedProduct {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  badge: string | null;
  inStock: boolean;
  stockCount: number;
  isFeatured: boolean;
  images: { url: string; alt: string | null }[];
  brand: { name: string } | null;
  categories: { category: { name: string } }[];
}

interface FeaturedProductsProps {
  products: FeaturedProduct[];
  isAdmin?: boolean;
}

export default function FeaturedProducts({ products, isAdmin = false }: FeaturedProductsProps) {
  // Build dynamic filter tabs from the categories present in the data
  const allCategoryNames = Array.from(
    new Set(products.flatMap((p) => p.categories.map((c) => c.category.name)))
  );
  const filterTabs = ["Tümü", ...allCategoryNames.slice(0, 3)];

  const [activeTab, setActiveTab] = useState("Tümü");

  const filteredProducts =
    activeTab === "Tümü"
      ? products
      : products.filter((p) =>
        p.categories.some((c) => c.category.name === activeTab)
      );

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight font-[family-name:var(--font-display)]">
              Öne Çıkan Ürünler
            </h2>
            <p className="text-gray-500 mt-2">
              Profesyonellerin en çok tercih ettiği ürünler.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* "See all" link */}
            <Link
              href="/arama"
              className="hidden md:flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
            >
              Tümünü Gör
              <MaterialIcon icon="arrow_forward" className="text-[18px]" />
            </Link>
            {/* Filter Tabs */}
            {filterTabs.length > 1 && (
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg overflow-x-auto max-w-full">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab
                    ? "bg-white shadow-sm text-primary"
                    : "text-gray-500 hover:text-text-main hover:bg-white/50"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <MaterialIcon icon="inventory_2" className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500">Öne çıkan ürünler yakında eklenecek.</p>
            {isAdmin && (
              <Link
                href="/admin/urunler"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <MaterialIcon icon="add_circle" className="text-[18px]" />
                Öne çıkan ürün ekle
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => {
              const discountPercent = product.compareAtPrice
                ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                : null;
              const imageUrl = product.images?.[0]?.url || "/images/placeholder.png";

              return (
                <div
                  key={product.id}
                  className="group bg-background-light rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col"
                >
                  <Link
                    href={`/urun/${product.slug}`}
                    className="relative aspect-square bg-white p-6 flex items-center justify-center overflow-hidden"
                  >
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-contain h-full w-full mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                    />
                    {discountPercent && discountPercent > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        -{discountPercent}%
                      </div>
                    )}
                    {product.badge === "Yeni" && !discountPercent && (
                      <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                        YENİ
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <MaterialIcon icon="favorite" className="text-[20px]" />
                    </button>
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    {/* Brand */}
                    {product.brand && (
                      <span className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{product.brand.name}</span>
                    )}
                    <Link href={`/urun/${product.slug}`}>
                      <h3 className="font-bold text-text-main mb-1 group-hover:text-primary transition-colors font-[family-name:var(--font-display)]">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-400 mb-4 font-mono">SKU: {product.sku}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        {product.compareAtPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            {product.currency}
                            {product.compareAtPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                          </p>
                        )}
                        <p className="text-lg font-bold text-primary">
                          {product.currency}
                          {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <button className="size-10 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-lg shadow-blue-500/30">
                        <MaterialIcon icon="add_shopping_cart" className="text-[20px]" />
                      </button>
                    </div>
                    {/* Stock indicator */}
                    <div className="mt-3 flex items-center gap-1.5">
                      <div className={`size-2 rounded-full ${product.inStock ? (product.stockCount <= 5 ? "bg-orange-400" : "bg-green-500") : "bg-red-500"}`} />
                      <span className={`text-xs font-medium ${product.inStock ? (product.stockCount <= 5 ? "text-orange-500" : "text-green-600") : "text-red-500"}`}>
                        {product.inStock
                          ? product.stockCount <= 5
                            ? `Son ${product.stockCount} Ürün`
                            : "Stokta Var"
                          : "Tükendi"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
