import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface MarkaPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MarkaPage({ params }: MarkaPageProps) {
  const { slug } = await params;
  const brandName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <Link href="/markalar" className="hover:text-primary">Markalar</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">{brandName}</span>
        </nav>

        {/* Brand Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
            <MaterialIcon icon="business" className="text-4xl text-gray-300" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)]">
              {brandName}
            </h1>
            <p className="text-gray-500 mt-1">Bu markaya ait tüm ürünler</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-primary hover:border-primary">
            <MaterialIcon icon="tune" className="text-base" />
            Filtrele
          </button>
          <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-primary hover:border-primary">
            <MaterialIcon icon="sort" className="text-base" />
            Sırala
          </button>
          <span className="text-sm text-gray-400 ml-auto">0 ürün bulundu</span>
        </div>

        {/* Product Grid Placeholder */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center">
                <MaterialIcon icon="image" className="text-4xl text-gray-300" />
              </div>
              <div className="p-3">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
                <div className="h-5 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
