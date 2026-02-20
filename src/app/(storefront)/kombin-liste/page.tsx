import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function KombinListePage() {
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

        {/* Kombin Grid Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center relative">
                <MaterialIcon icon="style" className="text-5xl text-gray-300" />
                <span className="absolute top-3 right-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                  %15 Avantaj
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-primary mb-1">Kombin Set {i + 1}</h3>
                <p className="text-sm text-gray-500 mb-3">3 ürün içerir</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 line-through mr-2">₺1.500,00</span>
                    <span className="text-lg font-bold text-primary">₺1.275,00</span>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">
                    <MaterialIcon icon="add_shopping_cart" className="text-base" />
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
