"use client";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/siteData";
import MaterialIcon from "@/components/ui/MaterialIcon";
import ProductCard from "@/components/products/ProductCard";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-20 text-center">
        <MaterialIcon icon="error_outline" className="text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ürün Bulunamadı</h2>
        <p className="text-gray-500 mb-6">Aradığınız ürün mevcut değil.</p>
        <Link href="/urunler" className="text-primary font-semibold hover:underline">
          Ürünlere Dön
        </Link>
      </div>
    );
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-6 lg:py-10">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
        <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
        <MaterialIcon icon="chevron_right" className="text-xs" />
        <Link href="/urunler" className="hover:text-primary transition-colors">Ürünler</Link>
        <MaterialIcon icon="chevron_right" className="text-xs" />
        <span className="text-text-main">{product.name}</span>
      </nav>

      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 w-full md:w-24 shrink-0">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 p-1 bg-white shrink-0 overflow-hidden ${
                  selectedImageIndex === i ? "border-primary" : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain rounded"
                />
              </button>
            ))}
          </div>
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex items-center justify-center p-8 min-h-[400px] relative">
            <Image
              src={product.images[selectedImageIndex]}
              alt={product.name}
              width={500}
              height={500}
              className="max-h-full max-w-full object-contain"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                {product.badge}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5">
          <div className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">
            {product.categoryLabel}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-3 font-[family-name:var(--font-display)]">
            {product.name}
          </h1>
          <p className="text-sm text-gray-400 font-mono mb-4">SKU: {product.sku}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <MaterialIcon
                  key={i}
                  icon="star"
                  className={`text-[18px] ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.reviewCount} değerlendirme)
            </span>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-baseline gap-3">
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {product.originalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {product.currency}
                </span>
              )}
              <span className="text-3xl font-black text-primary">
                {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {product.currency}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">KDV dahil fiyattır</p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`size-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
            <span className={`text-sm font-semibold ${product.inStock ? "text-green-600" : "text-red-500"}`}>
              {product.inStock ? `Stokta Var (${product.stockCount} adet)` : "Stokta Yok"}
            </span>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <MaterialIcon icon="remove" className="text-[20px]" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-12 text-center border-x border-gray-200 text-sm font-bold outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <MaterialIcon icon="add" className="text-[20px]" />
              </button>
            </div>
            <button className="flex-1 h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              <MaterialIcon icon="shopping_cart" />
              Sepete Ekle
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4 mb-8">
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
              <MaterialIcon icon="favorite_border" className="text-[20px]" />
              Favorilere Ekle
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
              <MaterialIcon icon="share" className="text-[20px]" />
              Paylaş
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-6">
            {product.description}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex border-b border-gray-200">
          {[
            { key: "specs", label: "Teknik Özellikler" },
            { key: "reviews", label: `Değerlendirmeler (${product.reviewCount})` },
            { key: "shipping", label: "Kargo Bilgisi" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-bold transition-colors ${
                activeTab === tab.key
                  ? "text-primary border-b-2 border-primary -mb-[1px]"
                  : "text-gray-500 hover:text-text-main"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="py-8">
          {activeTab === "specs" && product.technicalSpecs && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.technicalSpecs).map(([key, value], i) => (
                    <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-4 text-sm font-bold text-text-main w-1/3">{key}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="text-center py-12 text-gray-400">
              <MaterialIcon icon="rate_review" className="text-5xl mb-2" />
              <p>Henüz değerlendirme yapılmamış.</p>
            </div>
          )}
          {activeTab === "shipping" && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100">
                <MaterialIcon icon="local_shipping" className="text-primary text-2xl mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm mb-1">Hızlı Kargo</h4>
                  <p className="text-sm text-gray-500">16:00&apos;a kadar verilen siparişler aynı gün kargoda.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100">
                <MaterialIcon icon="assignment_return" className="text-primary text-2xl mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm mb-1">İade Garantisi</h4>
                  <p className="text-sm text-gray-500">14 gün içinde koşulsuz iade imkanı.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 font-[family-name:var(--font-display)]">
            Benzer Ürünler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
