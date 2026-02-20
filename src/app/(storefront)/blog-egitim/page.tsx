import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function BlogEgitimPage() {
  const categories = [
    { name: "Teknik Bilgiler", slug: "teknik-bilgiler", icon: "engineering", count: 12 },
    { name: "Ürün İncelemeleri", slug: "urun-incelemeleri", icon: "rate_review", count: 8 },
    { name: "Nasıl Yapılır?", slug: "nasil-yapilir", icon: "handyman", count: 15 },
    { name: "Sektör Haberleri", slug: "sektor-haberleri", icon: "newspaper", count: 6 },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Blog &amp; Eğitim</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8">
          Blog &amp; Eğitim
        </h1>

        {/* Category Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/${cat.slug}`}
              className="group bg-white rounded-lg border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mb-3">
                <MaterialIcon icon={cat.icon} className="text-2xl text-primary" />
              </div>
              <h3 className="font-semibold text-primary mb-1">{cat.name}</h3>
              <span className="text-xs text-gray-400">{cat.count} yazı</span>
            </Link>
          ))}
        </div>

        {/* Recent Posts */}
        <h2 className="text-xl font-bold text-primary font-[family-name:var(--font-display)] mb-6">
          Son Yazılar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Link
              key={i}
              href={`/blog/yazi/ornek-yazi-${i + 1}`}
              className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-[16/9] bg-gray-50 flex items-center justify-center">
                <MaterialIcon icon="article" className="text-4xl text-gray-300" />
              </div>
              <div className="p-4">
                <span className="text-xs text-primary/70 font-medium">Teknik Bilgiler</span>
                <h3 className="font-semibold text-primary mt-1 mb-2 group-hover:text-primary/80 transition-colors">
                  Örnek Blog Yazısı {i + 1}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  Bu bir örnek blog yazısı açıklamasıdır. İçerik veritabanından yüklenecektir.
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <MaterialIcon icon="calendar_today" className="text-sm" />
                    19 Şubat 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <MaterialIcon icon="schedule" className="text-sm" />
                    5 dk okuma
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
