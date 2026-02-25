import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getBundles } from "@/lib/actions/bundles";

export const dynamic = "force-dynamic";

export default async function KombinListePage() {
  const bundles = await getBundles();
  const activeBundles = bundles.filter((b) => b.isActive);

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Kombin Setler</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-3">
          Kombin Setler
        </h1>
        <p className="text-gray-500 mb-8">
          Size özel hazırlanmış kombin setlerimizi keşfedin. Uyumlu ürünleri bir arada avantajlı fiyatlarla alın.
        </p>

        {activeBundles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <MaterialIcon icon="style" className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Henüz kombin set eklenmemiş.</p>
            <p className="text-sm text-gray-400 mt-2">Daha sonra tekrar kontrol ediniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBundles.map((bundle) => {
              const itemCount = bundle.items.length;
              const totalPrice = bundle.items.reduce(
                (sum, item) => sum + Number(item.product.price) * item.quantity,
                0
              );
              const discount = bundle.discount ? Number(bundle.discount) : 0;
              const discountedPrice = discount > 0 ? totalPrice * (1 - discount / 100) : null;

              return (
                <Link
                  key={bundle.id}
                  href={bundle.slug ? `/${bundle.slug}` : "#"}
                  className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center relative overflow-hidden">
                    {bundle.image ? (
                      <Image
                        src={bundle.image}
                        alt={bundle.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <MaterialIcon icon="style" className="text-5xl text-gray-300" />
                    )}
                    {discount > 0 && (
                      <span className="absolute top-3 right-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                        %{discount} Avantaj
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-primary mb-1 group-hover:text-primary/80 transition-colors">
                      {bundle.name}
                    </h3>
                    {bundle.description && (
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{bundle.description}</p>
                    )}
                    <p className="text-sm text-gray-400 mb-3">{itemCount} ürün içerir</p>
                    {totalPrice > 0 && (
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          {discountedPrice && (
                            <span className="text-xs text-gray-400 line-through mr-2">
                              {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(totalPrice)}
                            </span>
                          )}
                          <span className="text-lg font-bold text-primary">
                            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(discountedPrice ?? totalPrice)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-2 bg-primary text-white text-sm rounded-lg group-hover:bg-primary/90 transition-colors">
                          <MaterialIcon icon="arrow_forward" className="text-base" />
                          İncele
                        </div>
                      </div>
                    )}
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
