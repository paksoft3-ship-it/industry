import HeroSection from "@/components/home/HeroSection";
import TrustBadgesOverlay from "@/components/home/TrustBadgesOverlay";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TeknikKaynaklar from "@/components/home/TeknikKaynaklar";
import BrandsSlider from "@/components/home/BrandsSlider";
import CTASection from "@/components/home/CTASection";
import { getFeaturedProducts } from "@/lib/actions/products";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Run all DB queries in parallel
  const [rawProducts, categories, brands, session] = await Promise.all([
    getFeaturedProducts(12),
    prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      take: 12,
      select: { id: true, name: true, slug: true, image: true, icon: true },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      take: 12,
      select: { id: true, name: true, slug: true, logo: true },
    }),
    auth(),
  ]);

  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  // Serialize Decimal fields to plain numbers for the client component
  const products = rawProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    currency: p.currency,
    badge: p.badge,
    inStock: p.inStock,
    stockCount: p.stockCount,
    isFeatured: p.isFeatured,
    images: p.images.map((i) => ({ url: i.url, alt: i.alt })),
    brand: p.brand ? { name: p.brand.name } : null,
    categories: p.categories.map((c) => ({ category: { name: c.category.name } })),
  }));

  return (
    <>
      <HeroSection />
      <TrustBadgesOverlay />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={products} isAdmin={isAdmin} />
      <TeknikKaynaklar />
      <BrandsSlider brands={brands} />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CTASection />
      </div>
    </>
  );
}
