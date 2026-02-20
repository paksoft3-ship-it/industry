import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function FavorilerPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Favorilerim</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8">
          Favorilerim
          <span className="text-base font-normal text-gray-400 ml-2">(8 ürün)</span>
        </h1>

        {/* Product Grid Placeholder */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
                <MaterialIcon icon="image" className="text-4xl text-gray-300" />
                <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
                  <MaterialIcon icon="favorite" className="text-lg" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-1">Marka</p>
                <h3 className="text-sm font-medium text-primary mb-1 line-clamp-2">
                  Endüstriyel Ürün {i + 1}
                </h3>
                <p className="font-bold text-primary mb-3">
                  {((i + 1) * 150).toLocaleString("tr-TR")} TL
                </p>
                <button className="w-full py-2 bg-primary text-white text-sm rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
                  <MaterialIcon icon="add_shopping_cart" className="text-base" />
                  Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
