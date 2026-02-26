"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useCart } from "@/context/CartContext";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  price: number;
  originalPrice: number | null;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  sku: string;
  images: string[];
  description: string;
  specs: string[];
  technicalSpecs: Record<string, string>;
  badge: string | null;
}

export default function ProductDetailClient({ product }: { product: ProductData }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("bilgi");
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, loading } = useCart();

  const handleAddToCart = async () => {
    if (!product.inStock || loading) return;
    await addItem(product.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const tabs = [
    { id: "bilgi", label: "Ürün Bilgisi" },
    { id: "foto", label: "Fotoğraflar" },
    { id: "teknik", label: "Teknik Özellikler" },
    { id: "odeme", label: "Ödeme Seçenekleri" },
    { id: "yorumlar", label: "Yorumlar" },
    { id: "soru", label: "Soru & Cevap" },
    { id: "indirme", label: "İndirmeler" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
        <MaterialIcon icon="chevron_right" className="text-[14px]" />
        <Link href={`/kategori/${product.category}`} className="hover:text-primary">{product.categoryLabel}</Link>
        <MaterialIcon icon="chevron_right" className="text-[14px]" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center p-8">
            {product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={500}
                height={500}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            ) : (
              <MaterialIcon icon="image" className="text-8xl text-gray-200" />
            )}
            {product.badge && (
              <span className="absolute top-4 left-4 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded">
                {product.badge}
              </span>
            )}
            {discountPercent && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
                -{discountPercent}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden flex items-center justify-center bg-gray-50 p-2 ${
                    selectedImage === i ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <Image src={img} alt="" width={60} height={60} className="object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">{product.categoryLabel}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-[family-name:var(--font-display)]">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <MaterialIcon
                  key={i}
                  icon="star"
                  className={`text-[18px] ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">({product.reviewCount} değerlendirme)</span>
            </div>
            <span className="text-sm text-gray-400">SKU: {product.sku}</span>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-xl p-6">
            {product.originalPrice && (
              <p className="text-sm text-gray-400 line-through mb-1">
                {product.originalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
              </p>
            )}
            <p className="text-3xl font-black text-primary">
              {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
            </p>
            <p className="text-xs text-gray-400 mt-1">KDV Dahil</p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`size-3 rounded-full ${product.inStock ? (product.stockCount <= 5 ? "bg-orange-400" : "bg-green-500") : "bg-red-500"}`} />
            <span className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-500"}`}>
              {product.inStock
                ? product.stockCount <= 5
                  ? `Son ${product.stockCount} Ürün!`
                  : `Stokta (${product.stockCount} adet)`
                : "Tükendi"}
            </span>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-gray-600 hover:bg-gray-50"
              >
                <MaterialIcon icon="remove" className="text-[20px]" />
              </button>
              <span className="px-6 py-3 font-bold text-center min-w-[60px]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 text-gray-600 hover:bg-gray-50"
              >
                <MaterialIcon icon="add" className="text-[20px]" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || loading}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <MaterialIcon icon={addedToCart ? "check" : "shopping_cart"} />
              {addedToCart ? "Sepete Eklendi!" : product.inStock ? "Sepete Ekle" : "Stokta Yok"}
            </button>

            <button className="p-3 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
              <MaterialIcon icon="favorite_border" />
            </button>
          </div>

          {/* Specs quick list */}
          <div className="border-t pt-4">
            <ul className="space-y-2">
              {product.specs.map((spec) => (
                <li key={spec} className="flex items-center gap-2 text-sm text-gray-600">
                  <MaterialIcon icon="check_circle" className="text-[16px] text-green-500" />
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-1 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === "bilgi" && (
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        )}
        {activeTab === "teknik" && (
          <div className="max-w-2xl">
            <table className="w-full">
              <tbody>
                {Object.entries(product.technicalSpecs).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3">{key}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "yorumlar" && (
          <div className="text-center py-12 text-gray-400">
            <MaterialIcon icon="rate_review" className="text-5xl mb-3" />
            <p>Henüz değerlendirme yapılmamış.</p>
            <button className="mt-4 text-primary font-medium hover:underline">İlk değerlendirmeyi yaz</button>
          </div>
        )}
        {activeTab === "soru" && (
          <div className="text-center py-12 text-gray-400">
            <MaterialIcon icon="help_outline" className="text-5xl mb-3" />
            <p>Henüz soru sorulmamış.</p>
            <button className="mt-4 text-primary font-medium hover:underline">Soru sor</button>
          </div>
        )}
        {(activeTab === "foto" || activeTab === "odeme" || activeTab === "indirme") && (
          <div className="text-center py-12 text-gray-400">
            <MaterialIcon icon="construction" className="text-5xl mb-3" />
            <p>Bu bölüm yakında eklenecektir.</p>
          </div>
        )}
      </div>
    </div>
  );
}
