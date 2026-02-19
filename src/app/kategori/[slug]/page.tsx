"use client";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { categories, products } from "@/data/siteData";
import ProductCard from "@/components/products/ProductCard";
import MaterialIcon from "@/components/ui/MaterialIcon";

import CategoryShowcase from "@/components/categories/CategoryShowcase";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  if (slug === "tumu") {
    return <CategoryShowcase />;
  }

  const category = categories.find((c) => c.id === slug);
  const categoryProducts = products.filter((p) => p.category === slug);

  if (!category) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-20 text-center">
        <MaterialIcon icon="category" className="text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Kategori Bulunamadı</h2>
        <Link href="/kategori/tumu" className="text-primary font-semibold hover:underline">
          Tüm Kategoriler
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
        <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
        <MaterialIcon icon="chevron_right" className="text-xs" />
        <Link href="/kategori/tumu" className="hover:text-primary transition-colors">Kategoriler</Link>
        <MaterialIcon icon="chevron_right" className="text-xs" />
        <span className="text-text-main font-bold">{category.name}</span>
      </nav>

      {/* Category Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-10 h-48 md:h-64 bg-gray-900 flex items-center">
        {category.image && (
          <>
            <Image src={category.image} alt={category.name} fill className="object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent" />
          </>
        )}
        <div className="relative z-10 px-8 md:px-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">
            {category.name}
          </h1>
          <p className="text-gray-300">{category.subtitle} - {category.productCount} ürün</p>
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {categoryProducts.length === 0 && (
        <div className="text-center py-20">
          <MaterialIcon icon="inventory_2" className="text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500">Bu kategoride henüz ürün bulunmuyor.</p>
        </div>
      )}
    </div>
  );
}
