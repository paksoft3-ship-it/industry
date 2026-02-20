import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface BlogCategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { categorySlug } = await params;
  const categoryName = categorySlug
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
          <Link href="/blog-egitim" className="hover:text-primary">Blog &amp; Eğitim</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">{categoryName}</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8">
          {categoryName}
        </h1>

        {/* Post Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Link
              key={i}
              href={`/blog/yazi/${categorySlug}-yazi-${i + 1}`}
              className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-[16/9] bg-gray-50 flex items-center justify-center">
                <MaterialIcon icon="article" className="text-4xl text-gray-300" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-primary mb-2 group-hover:text-primary/80 transition-colors">
                  {categoryName} - Yazı {i + 1}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  Bu bir örnek blog yazısı açıklamasıdır. İçerik veritabanından yüklenecektir.
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
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

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-10">
          <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary">
            <MaterialIcon icon="chevron_left" className="text-xl" />
          </button>
          <button className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-medium">
            1
          </button>
          <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-sm text-primary hover:border-primary">
            2
          </button>
          <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-sm text-primary hover:border-primary">
            3
          </button>
          <button className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary">
            <MaterialIcon icon="chevron_right" className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
