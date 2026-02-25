import Link from "next/link";
import { notFound } from "next/navigation";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getStaticPageBySlug } from "@/lib/actions/staticPages";

export const dynamic = "force-dynamic";

interface SayfaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SayfaPageProps) {
  const { slug } = await params;
  const page = await getStaticPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.seoTitle || page.title,
    description: page.seoDesc,
  };
}

export default async function SayfaPage({ params }: SayfaPageProps) {
  const { slug } = await params;
  const page = await getStaticPageBySlug(slug);

  if (!page || !page.isActive) return notFound();

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">{page.title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8">
          {page.title}
        </h1>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-100 p-6 md:p-10">
          {page.content ? (
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <p className="text-gray-400 italic">İçerik henüz eklenmemiş.</p>
          )}
        </div>
      </div>
    </div>
  );
}
