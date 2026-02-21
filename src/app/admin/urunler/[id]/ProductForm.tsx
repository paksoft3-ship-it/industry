"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { createProduct, updateProduct } from "@/lib/actions/products";

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  shortDesc: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  brandId: string | null;
  inStock: boolean;
  stockCount: number;
  lowStockThreshold: number;
  weight: number | null;
  badge: string | null;
  badgeColor: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  seoTitle: string | null;
  seoDesc: string | null;
  images: { id: string; url: string; sortOrder: number }[];
  brand: { id: string; name: string } | null;
  categories: { category: { id: string; name: string } }[];
  attributes: { id: string; key: string; value: string }[];
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

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g").replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o").replace(/[şŞ]/g, "s").replace(/[üÜ]/g, "u")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductForm({
  product,
  categories,
  brands,
}: {
  product: Product | null;
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const isEdit = !!product;
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [description, setDescription] = useState(product?.description || "");
  const [shortDesc, setShortDesc] = useState(product?.shortDesc || "");
  const [price, setPrice] = useState(product ? String(Number(product.price)) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice ? String(Number(product.compareAtPrice)) : ""
  );
  const [costPrice, setCostPrice] = useState(
    product?.costPrice ? String(Number(product.costPrice)) : ""
  );
  const [brandId, setBrandId] = useState(product?.brandId || "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival ?? false);
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [stockCount, setStockCount] = useState(product?.stockCount?.toString() || "0");
  const [lowStockThreshold, setLowStockThreshold] = useState(
    product?.lowStockThreshold?.toString() || "5"
  );
  const [weight, setWeight] = useState(product?.weight ? String(Number(product.weight)) : "");
  const [badge, setBadge] = useState(product?.badge || "");
  const [seoTitle, setSeoTitle] = useState(product?.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(product?.seoDesc || "");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    product?.categories?.map((c) => c.category.id) || []
  );
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>(
    product?.attributes?.map((a) => ({ key: a.key, value: a.value })) || []
  );
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.map((i) => i.url) || []
  );
  const [uploading, setUploading] = useState(false);

  function handleNameChange(val: string) {
    setName(val);
    if (!isEdit) setSlug(slugify(val));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("entity", "products");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const { url } = await res.json();
        setImageUrls((prev) => [...prev, url]);
      }
      toast.success("Görsel yüklendi");
    } catch {
      toast.error("Görsel yüklenemedi");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function addAttribute() {
    setAttributes((prev) => [...prev, { key: "", value: "" }]);
  }

  function removeAttribute(index: number) {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !slug || !sku || !price) {
      toast.error("Ürün adı, slug, SKU ve fiyat zorunludur");
      return;
    }

    const data = {
      name,
      slug,
      sku,
      description: description || undefined,
      shortDesc: shortDesc || undefined,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      costPrice: costPrice ? parseFloat(costPrice) : undefined,
      brandId: brandId || undefined,
      isActive,
      isFeatured,
      isNewArrival,
      inStock,
      stockCount: parseInt(stockCount, 10) || 0,
      lowStockThreshold: parseInt(lowStockThreshold, 10) || 5,
      weight: weight ? parseFloat(weight) : undefined,
      badge: badge || undefined,
      seoTitle: seoTitle || undefined,
      seoDesc: seoDesc || undefined,
      categoryIds: selectedCategoryIds,
      attributes: attributes.filter((a) => a.key && a.value),
      imageUrls,
    };

    startTransition(async () => {
      try {
        if (isEdit) {
          await updateProduct(product.id, data);
          toast.success("Ürün güncellendi");
        } else {
          await createProduct(data);
          toast.success("Ürün oluşturuldu");
          router.push("/admin/urunler");
        }
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Kayıt başarısız");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/urunler"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MaterialIcon icon="arrow_back" className="text-xl" />
          </Link>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">
              {isEdit ? "Ürün Düzenle" : "Yeni Ürün"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEdit ? "Ürün bilgilerini güncelleyin" : "Yeni ürün oluşturun"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEdit && (
            <Link
              href={`/urun/${product.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <MaterialIcon icon="visibility" className="text-lg" />
              Önizle
            </Link>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <MaterialIcon icon="save" className="text-lg" />
            {isPending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Temel Bilgiler
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ürün Adı</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kısa Açıklama</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Fiyatlandırma
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Satış Fiyatı (TL)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Karşılaştırma Fiyatı (TL)</label>
                <input
                  type="number"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="Opsiyonel"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Maliyet Fiyatı (TL)</label>
                <input
                  type="number"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="Opsiyonel"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800">
                Özellikler
              </h2>
              <button
                type="button"
                onClick={addAttribute}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <MaterialIcon icon="add_circle" className="text-lg" />
                Özellik Ekle
              </button>
            </div>
            <div className="space-y-3">
              {attributes.map((attr, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={attr.key}
                    onChange={(e) => {
                      const updated = [...attributes];
                      updated[index] = { ...updated[index], key: e.target.value };
                      setAttributes(updated);
                    }}
                    placeholder="Özellik adı"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => {
                      const updated = [...attributes];
                      updated[index] = { ...updated[index], value: e.target.value };
                      setAttributes(updated);
                    }}
                    placeholder="Değer"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttribute(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <MaterialIcon icon="close" className="text-lg" />
                  </button>
                </div>
              ))}
              {attributes.length === 0 && (
                <p className="text-sm text-gray-400 py-2">Henüz özellik eklenmemiş</p>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Başlık</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Opsiyonel"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Açıklama</label>
                <textarea
                  rows={3}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Opsiyonel"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">Durum</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-700">Aktif</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-700">Öne Çıkan</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-700">Yeni Ürün</span>
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">Kategoriler</h2>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(c.id)}
                    onChange={() => toggleCategory(c.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">
                    {c.parent ? `${c.parent.name} → ` : ""}{c.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">Marka</h2>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Marka Seçin</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">Görseller</h2>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MaterialIcon icon="close" className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
            <label className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <MaterialIcon icon="cloud_upload" className="text-lg" />
              {uploading ? "Yükleniyor..." : "Görsel Yükle"}
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
          </div>

          {/* Stock */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">Stok Bilgisi</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-700">Stokta Var</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stok Miktarı</label>
                <input
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Min. Stok Uyarısı</label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ağırlık (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Opsiyonel"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">Rozet</h2>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Örn: Yeni, İndirim, En Çok Satan"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
