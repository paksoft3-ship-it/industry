import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getSettings } from "@/lib/actions/settings";
import QuoteRequestForm from "./QuoteRequestForm";

export const metadata = {
  title: "Teklif Al | SivTech Makina",
  description: "Ürün ve hizmetlerimiz için ücretsiz teklif talep edin. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.",
};

const benefits = [
  { icon: "speed", title: "Hızlı Yanıt", desc: "24 saat içinde geri dönüş garantisi" },
  { icon: "verified", title: "Uzman Ekip", desc: "Alanında uzman teknik satış ekibi" },
  { icon: "handshake", title: "Rekabetçi Fiyat", desc: "Piyasanın en uygun fiyat teklifleri" },
  { icon: "support_agent", title: "Satış Sonrası Destek", desc: "Teknik destek ve garanti hizmetleri" },
];

export default async function TeklifAlPage() {
  const settings = await getSettings();
  const phone = settings.phone || "+90 (212) 123 45 67";
  const email = settings.email || "info@example.com";

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Teklif Al</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)]">
            Teklif Talep Formu
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            İhtiyacınızı belirtin, uzman ekibimiz size özel fiyat teklifi hazırlasın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 md:p-8">
            <QuoteRequestForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Benefits */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-primary mb-4">Neden Biz?</h2>
              <div className="space-y-4">
                {benefits.map((b) => (
                  <div key={b.icon} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <MaterialIcon icon={b.icon} className="text-primary text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{b.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact */}
            <div className="bg-primary rounded-xl p-6 text-white">
              <h2 className="text-base font-semibold mb-3">Doğrudan İletişim</h2>
              <p className="text-sm text-white/80 mb-4">
                Formu doldurmak yerine doğrudan bizimle iletişime geçebilirsiniz.
              </p>
              <div className="space-y-3">
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors"
                >
                  <MaterialIcon icon="phone" className="text-xl" />
                  <div>
                    <p className="text-xs text-white/70">Bizi Arayın</p>
                    <p className="text-sm font-semibold">{phone}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-colors"
                >
                  <MaterialIcon icon="mail" className="text-xl" />
                  <div>
                    <p className="text-xs text-white/70">E-posta Gönderin</p>
                    <p className="text-sm font-semibold">{email}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Process */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-primary mb-4">Süreç Nasıl İşler?</h2>
              <ol className="space-y-3">
                {[
                  "Formu doldurun ve gönderin",
                  "Ekibimiz talebinizi inceler",
                  "24 saat içinde sizinle iletişime geçeriz",
                  "Özel fiyat teklifinizi alın",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
