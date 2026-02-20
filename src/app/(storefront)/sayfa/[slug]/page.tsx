import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface SayfaPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SayfaPage({ params }: SayfaPageProps) {
  const { slug } = await params;
  const pageTitle = slug
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
          <span className="text-primary">{pageTitle}</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8">
          {pageTitle}
        </h1>

        {/* Content Placeholder - will load from DB */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 md:p-10">
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Bu sayfanın içeriği veritabanından yüklenecektir. Şu anda yer tutucu metin gösterilmektedir.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
              et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
