import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getBrandBySlug } from "@/lib/actions/brands";
import { getProducts } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

interface MarkaPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MarkaPage({ params }: MarkaPageProps) {
  const { slug } = await params;

  const [brand, { products }] = await Promise.all([
    getBrandBySlug(slug),
    getProducts({ brandSlug: slug, limit: 40 }),
  ]);

  if (!brand) return notFound();

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <Link href="/markalar" className="hover:text-primary">Markalar</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">{brand.name}</span>
        </nav>

        {/* Brand Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
            {brand.logo ? (
              <Image src={brand.logo} alt={brand.name} width={96} height={96} className="object-contain w-full h-full" />
            ) : (
              <MaterialIcon icon="business" className="text-4xl text-gray-300" />
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)]">
              {brand.name}
            </h1>
            {brand.description && (
              <p className="text-gray-500 mt-1 max-w-2xl">{brand.description}</p>
            )}
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
              >
                <MaterialIcon icon="language" className="text-base" />
                {brand.website}
              </a>
            )}
            <p className="text-sm text-gray-400 mt-1">{products.length} ürün</p>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <MaterialIcon icon="inventory_2" className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Bu markaya ait henüz ürün bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => {
              const price = Number(product.price);
              const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
              const discountPercent = compareAtPrice
                ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
                : null;
              const imageUrl = product.images?.[0]?.url || "/images/placeholder.png";

              return (
                <Link
                  key={product.id}
                  href={`/urun/${product.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-square bg-white p-4 flex items-center justify-center overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="object-contain h-full w-full mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                    />
                    {discountPercent && discountPercent > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-bold text-text-main text-sm mb-1 group-hover:text-primary transition-colors font-[family-name:var(--font-display)] line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2 font-mono">SKU: {product.sku}</p>
                    <div className="mt-auto">
                      {compareAtPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          {product.currency}{compareAtPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                        </p>
                      )}
                      <p className="text-base font-bold text-primary">
                        {product.currency}{price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
