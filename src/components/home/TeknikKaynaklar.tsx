import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const resources = [
  {
    icon: "folder_open",
    title: "Dosya Merkezi",
    description: "Teknik çizimler, kataloglar ve veri sayfalarına erişin.",
    href: "/dosya-merkezi",
    cta: "Dosyalara Gözat",
  },
  {
    icon: "school",
    title: "Eğitim",
    description: "CNC ve otomasyon konularında kılavuzlar ve eğitim içerikleri.",
    href: "/egitim",
    cta: "Eğitimlere Git",
  },
  {
    icon: "local_shipping",
    title: "Sipariş Takip",
    description: "Siparişlerinizin durumunu ve kargo bilgilerini takip edin.",
    href: "/siparis-takip",
    cta: "Siparişi Takip Et",
  },
];

export default function TeknikKaynaklar() {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight font-[family-name:var(--font-display)]">
            Teknik Kaynaklar
          </h2>
          <p className="text-gray-500 mt-2">
            Projeleriniz için ihtiyacınız olan her şey tek yerde.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {resources.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex flex-col bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <MaterialIcon icon={r.icon} className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-text-main mb-2 font-[family-name:var(--font-display)] group-hover:text-primary transition-colors">
                {r.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">
                {r.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                {r.cta}
                <MaterialIcon icon="arrow_forward" className="text-base transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
