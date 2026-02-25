import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getBrands } from "@/lib/actions/brands";

export const dynamic = "force-dynamic";

export default async function MarkalarPage() {
  const brands = await getBrands();

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Markalar</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8">
          Markalarımız
        </h1>

        {brands.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MaterialIcon icon="branding_watermark" className="text-6xl mb-4" />
            <p>Henüz marka eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/marka/${brand.slug}`}
                className="group bg-white rounded-lg border border-gray-100 p-6 flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  {brand.logo ? (
                    <Image src={brand.logo} alt={brand.name} width={80} height={80} className="object-contain w-full h-full p-1" />
                  ) : (
                    <MaterialIcon icon="business" className="text-3xl text-gray-300 group-hover:text-primary transition-colors" />
                  )}
                </div>
                <span className="text-sm font-medium text-primary text-center">{brand.name}</span>
                <span className="text-xs text-gray-400">{brand._count.products} ürün</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
