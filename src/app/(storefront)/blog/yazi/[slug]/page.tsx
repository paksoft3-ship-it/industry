import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const title = slug
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
          <span className="text-primary">{title}</span>
        </nav>

        <article className="max-w-3xl mx-auto">
          {/* Hero Image */}
          <div className="aspect-[16/9] bg-gray-100 rounded-lg flex items-center justify-center mb-8">
            <MaterialIcon icon="image" className="text-6xl text-gray-300" />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <MaterialIcon icon="person" className="text-base" />
              Yazar Adı
            </span>
            <span className="flex items-center gap-1">
              <MaterialIcon icon="calendar_today" className="text-base" />
              19 Şubat 2026
            </span>
            <span className="flex items-center gap-1">
              <MaterialIcon icon="schedule" className="text-base" />
              5 dk okuma
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-primary font-[family-name:var(--font-display)] mb-6">
            {title}
          </h1>

          {/* Article Content Placeholder */}
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Bu alanda blog yazısının içeriği veritabanından yüklenecektir. Şu anda bir yer tutucu metin gösterilmektedir.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
              <p className="text-primary font-medium">
                Bu bir bilgi kutusu örneğidir. Önemli notlar bu şekilde gösterilecektir.
              </p>
            </div>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 mt-10 pt-6 border-t border-gray-100">
            <span className="text-sm text-gray-500">Paylaş:</span>
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
              <MaterialIcon icon="share" className="text-lg" />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
              <MaterialIcon icon="link" className="text-lg" />
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
