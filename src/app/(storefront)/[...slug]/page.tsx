import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DosyaMerkeziContent from "@/components/dosya-merkezi/DosyaMerkeziContent";

export const dynamic = "force-dynamic";

interface CatchAllPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { slug } = await params;
  const fullSlug = slug.join("/");

  // 1. Check if it matches dosyaMerkeziSlug from SiteSettings
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (settings && fullSlug === settings.dosyaMerkeziSlug) {
      const files = await prisma.fileLibrary.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
      return <DosyaMerkeziContent files={files} />;
    }

    // 2. Check if it matches a Bundle rootSlug
    const bundle = await prisma.bundle.findFirst({
      where: { rootSlug: fullSlug, isActive: true },
      include: { items: { include: { product: { include: { images: true } } } } },
    });
    if (bundle) {
      return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-display)]">{bundle.name}</h1>
          <p className="text-gray-500 mt-2">{bundle.description}</p>
        </div>
      );
    }

    // 3. Check if it matches a BlogCategory rootSlug
    const blogCat = await prisma.blogCategory.findFirst({
      where: { rootSlug: fullSlug },
    });
    if (blogCat) {
      redirect(`/blog/${blogCat.slug}`);
    }

    // 4. Check if it matches a Category seoSlug
    const category = await prisma.category.findFirst({
      where: { seoSlug: fullSlug, isActive: true },
    });
    if (category) {
      redirect(`/kategori/${category.slug}`);
    }

    // 5. Check StaticPage slug
    const staticPage = await prisma.staticPage.findFirst({
      where: { slug: fullSlug, isActive: true },
    });
    if (staticPage) {
      redirect(`/sayfa/${staticPage.slug}`);
    }
  } catch {
    // DB not available — fall through to notFound
  }

  return notFound();
}
