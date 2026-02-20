import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function MarkalarPage() {
  const placeholderBrands = [
    "Marka A", "Marka B", "Marka C", "Marka D",
    "Marka E", "Marka F", "Marka G", "Marka H",
    "Marka I", "Marka J", "Marka K", "Marka L",
  ];

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

        {/* Alphabet Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <button
              key={letter}
              className="w-9 h-9 flex items-center justify-center rounded border border-gray-200 bg-white text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors"
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {placeholderBrands.map((brand, i) => (
            <Link
              key={i}
              href={`/marka/${brand.toLowerCase().replace(" ", "-")}`}
              className="group bg-white rounded-lg border border-gray-100 p-6 flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                <MaterialIcon icon="business" className="text-3xl text-gray-300 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-medium text-primary text-center">{brand}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
