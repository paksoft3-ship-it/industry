import HeroSection from "@/components/home/HeroSection";
import TrustBadgesOverlay from "@/components/home/TrustBadgesOverlay";
import CategoryGrid from "@/components/home/CategoryGrid";
import PopularCategoryCards from "@/components/home/PopularCategoryCards";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CTASection from "@/components/home/CTASection";
import { getFeaturedProducts } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rawProducts = await getFeaturedProducts(8);

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
      <CategoryGrid />
      <PopularCategoryCards />
      <FeaturedProducts products={products} />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CTASection />
      </div>
    </>
  );
}
