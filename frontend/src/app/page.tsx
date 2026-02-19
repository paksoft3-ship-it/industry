import HeroSection from "@/components/home/HeroSection";
import TrustBadgesOverlay from "@/components/home/TrustBadgesOverlay";
import CategoryGrid from "@/components/home/CategoryGrid";
import PopularCategoryCards from "@/components/home/PopularCategoryCards";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadgesOverlay />
      <CategoryGrid />
      <PopularCategoryCards />
      <FeaturedProducts />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CTASection />
      </div>
    </>
  );
}
