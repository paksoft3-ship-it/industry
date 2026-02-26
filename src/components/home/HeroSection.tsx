import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const heroData = {
  backgroundImage: "/images/hero-bg.jpg",
  badgeIcon: "precision_manufacturing",
  badge: "Endüstriyel Otomasyon Çözümleri",
  title: "SivTech Makina",
  highlight: "& Otomasyon",
  subtitle: "Endüstriyel otomasyon ve CNC makine parçalarında Türkiye'nin güvenilir ve yenilikçi tedarikçisi.",
  ctaPrimary: "Ürünleri Keşfet",
  ctaSecondary: "Kategoriler",
};

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/60 z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${heroData.backgroundImage}')` }}
      />
      <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col justify-center h-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-blue-100 text-xs font-medium mb-6">
            <MaterialIcon icon={heroData.badgeIcon} className="text-[16px]" />
            {heroData.badge}
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight font-[family-name:var(--font-display)]">
            {heroData.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              {heroData.highlight}
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
            {heroData.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/kategori/tumu"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-900/70 hover:-translate-y-0.5"
            >
              {heroData.ctaPrimary}
              <MaterialIcon icon="arrow_forward" className="ml-2 text-[20px]" />
            </Link>
            <Link
              href="/kategori/tumu"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium border border-white/20 transition-all hover:-translate-y-0.5"
            >
              {heroData.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
