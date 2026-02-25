import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import MaterialIcon from "@/components/ui/MaterialIcon";
import CategoryShowcase from "@/components/categories/CategoryShowcase";
import CategoryFiltersWrapper from "@/components/categories/CategoryFiltersWrapper";
import { getCategoryBySlug } from "@/lib/actions/categories";
import { getProducts } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;

  if (slug === "tumu") {
    return <CategoryShowcase />;
  }

  const category = await getCategoryBySlug(slug);
  if (!category) return notFound();

  // Parse filters from searchParams
  const attributes: Record<string, string[]> = {};
  Object.entries(sParams).forEach(([key, value]) => {
    if (key !== "page" && key !== "sort") {
      attributes[key] = Array.isArray(value) ? value : [value];
    }
  });

  const { products } = await getProducts({
    categorySlug: slug,
    limit: 40,
    attributes: Object.keys(attributes).length > 0 ? attributes : undefined
  });

  const catData = category as any;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
        <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
        <MaterialIcon icon="chevron_right" className="text-xs" />
        <Link href="/kategori/tumu" className="hover:text-primary transition-colors">Kategoriler</Link>
        <MaterialIcon icon="chevron_right" className="text-xs" />
        {catData.parent && (
          <>
            <Link href={`/kategori/${catData.parent.slug}`} className="hover:text-primary transition-colors">
              {catData.parent.name}
            </Link>
            <MaterialIcon icon="chevron_right" className="text-xs" />
          </>
        )}
        <span className="text-text-main font-bold">{catData.name}</span>
      </nav>

      {/* Category Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-10 h-48 md:h-64 bg-gray-900 flex items-center">
        {catData.image && (
          <>
            <Image src={catData.image} alt={catData.name} fill className="object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent" />
          </>
        )}
        <div className="relative z-10 px-8 md:px-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">
            {catData.name}
          </h1>
          <p className="text-gray-300">
            {catData.description || catData.name} — {products.length} ürün
          </p>
        </div>
      </div>

      {/* Sub-categories */}
      {catData.children && catData.children.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          {catData.children.map((child: any) => (
            <Link
              key={child.id}
              href={`/kategori/${child.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all text-center"
            >
              <MaterialIcon icon={child.icon || "category"} className="text-3xl text-primary" />
              <span className="text-sm font-medium text-text-main">{child.name}</span>
              <span className="text-xs text-gray-400">{child._count.products} ürün</span>
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold mb-6 font-[family-name:var(--font-display)]">Filtreler</h2>
            <div className="space-y-4">
              {/* Client Component for interactive filter updates */}
              <CategoryFiltersWrapper
                category={category as any}
                selectedFilters={attributes}
              />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const price = Number(product.price);
                const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
                const discountPercent = compareAtPrice
                  ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
                  : null;
                const imageUrl = product.images?.[0]?.url || "/images/placeholder.png";

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col"
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
                    </Link>
                    <div className="p-5 flex flex-col flex-1">
                      {product.brand && (
                        <span className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
                          {product.brand.name}
                        </span>
                      )}
                      <Link href={`/urun/${product.slug}`}>
                        <h3 className="font-bold text-text-main mb-1 group-hover:text-primary transition-colors font-[family-name:var(--font-display)] line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 mb-4 font-mono">SKU: {product.sku}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          {compareAtPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              {product.currency}
                              {compareAtPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                            </p>
                          )}
                          <p className="text-lg font-bold text-primary">
                            {product.currency}
                            {price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
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
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <MaterialIcon icon="inventory_2" className="text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Bu kategoride henüz ürün bulunmuyor.</p>
              <p className="text-sm text-gray-400 mt-2">Daha sonra tekrar kontrol ediniz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
