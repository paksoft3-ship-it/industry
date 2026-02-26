import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getSettings } from "@/lib/actions/settings";

export default async function HeroSection() {
  const settings = await getSettings();

  const title       = settings.heroTitle      || "SivTech Makina";
  const highlight   = settings.heroHighlight  || "& Otomasyon";
  const subtitle    = settings.heroSubtitle   || "Endüstriyel otomasyon ve CNC makine parçalarında Türkiye'nin güvenilir ve yenilikçi tedarikçisi.";
  const badge       = settings.heroBadge      || "Endüstriyel Otomasyon Çözümleri";
  const badgeIcon   = settings.heroBadgeIcon  || "precision_manufacturing";
  const bgImage     = settings.heroImage      || "/images/hero-bg.jpg";
  const cta1Text    = settings.heroCta1Text   || "Ürünleri Keşfet";
  const cta1Url     = settings.heroCta1Url    || "/kategori/tumu";
  const cta2Text    = settings.heroCta2Text   || "Kategoriler";
  const cta2Url     = settings.heroCta2Url    || "/kategori/tumu";

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/60 z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex flex-col justify-center h-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-blue-100 text-xs font-medium mb-4 sm:mb-6">
            <MaterialIcon icon={badgeIcon} className="text-[16px]" />
            {badge}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-[1.1] mb-4 sm:mb-6 tracking-tight font-[family-name:var(--font-display)]">
            {title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              {highlight}
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={cta1Url}
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-900/70 hover:-translate-y-0.5"
            >
              {cta1Text}
              <MaterialIcon icon="arrow_forward" className="ml-2 text-[20px]" />
            </Link>
            <Link
              href={cta2Url}
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium border border-white/20 transition-all hover:-translate-y-0.5"
            >
              {cta2Text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
