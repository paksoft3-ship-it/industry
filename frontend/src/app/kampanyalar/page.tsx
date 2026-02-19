import Image from "next/image";
import Link from "next/link";
import { campaigns, products } from "@/data/siteData";
import ProductCard from "@/components/products/ProductCard";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function CampaignsPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
        <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
        <MaterialIcon icon="chevron_right" className="text-xs" />
        <span className="text-text-main font-bold">Kampanyalar</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-10 font-[family-name:var(--font-display)]">
        Kampanyalar ve Fırsatlar
      </h1>

      {/* Featured Campaign Banner */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xl mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-100/90 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
          <div className="flex flex-col items-start max-w-2xl gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-bold tracking-wider uppercase shadow-sm">
              <MaterialIcon icon="local_fire_department" className="text-sm" />
              Sınırlı Süre Fırsatı
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight font-[family-name:var(--font-display)]">
              {campaigns[0].title}
            </h2>
            <p className="text-gray-600 text-lg max-w-lg font-medium">
              {campaigns[0].description}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                href="#"
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-lg font-bold transition-all shadow-lg shadow-primary/30"
              >
                Kampanyayı İncele
                <MaterialIcon icon="arrow_forward" className="text-sm" />
              </Link>
              {/* Countdown */}
              <div className="flex gap-3 items-center pl-6 border-l-2 border-gray-200">
                {["02", "14", "38"].map((val, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="text-center bg-gray-900 text-white rounded p-2 min-w-[3.5rem] shadow-lg">
                      <span className="block text-2xl font-bold font-mono">{val}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">
                        {i === 0 ? "Gün" : i === 1 ? "Saat" : "Dk"}
                      </span>
                    </div>
                    {i < 2 && <span className="text-gray-900 text-xl font-bold">:</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block w-80 h-80 relative">
            <Image
              src={campaigns[0].image}
              alt={campaigns[0].title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:shadow-xl transition-all group"
          >
            <div className="p-8">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold mb-4">
                <MaterialIcon icon="percent" className="text-sm" />
                %{campaign.discount} İndirim
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors font-[family-name:var(--font-display)]">
                {campaign.title}
              </h3>
              <p className="text-gray-500 text-sm mb-6">{campaign.description}</p>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
              >
                Detayları Gör <MaterialIcon icon="arrow_forward" className="text-sm" />
              </Link>
            </div>
            <div className="h-48 bg-gray-50 flex items-center justify-center">
              <Image
                src={campaign.image}
                alt={campaign.title}
                width={250}
                height={180}
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Discounted Products */}
      <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">
        İndirimli Ürünler
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products
          .filter((p) => p.originalPrice)
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}
