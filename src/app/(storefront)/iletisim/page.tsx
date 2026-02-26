import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getSettings } from "@/lib/actions/settings";

export const dynamic = "force-dynamic";

export default async function IletisimPage() {
  const settings = await getSettings();

  const address      = settings.address      || "Organize Sanayi Bölgesi, No: 123, İstanbul, Türkiye";
  const phone        = settings.phone        || "+90 (212) 123 45 67";
  const email        = settings.email        || "info@example.com";
  const workingHours = settings.workingHours || "Pzt-Cum: 08:00 - 18:00";
  const mapEmbedUrl  = settings.mapEmbedUrl;

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">İletişim</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8">
          İletişim
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-primary mb-6">Bize Ulaşın</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Ad</label>
                  <input
                    type="text"
                    placeholder="Adınız"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Soyad</label>
                  <input
                    type="text"
                    placeholder="Soyadınız"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">E-posta</label>
                <input
                  type="email"
                  placeholder="ornek@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Telefon</label>
                <input
                  type="tel"
                  placeholder="0(5XX) XXX XX XX"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Konu</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="">Konu seçin</option>
                  <option value="satis">Satış</option>
                  <option value="destek">Teknik Destek</option>
                  <option value="iade">İade / Değişim</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Mesajınız</label>
                <textarea
                  rows={5}
                  placeholder="Mesajınızı yazın..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <MaterialIcon icon="send" className="text-xl" />
                Gönder
              </button>
            </form>
          </div>

          {/* Contact Info + Map */}
          <div className="space-y-6">
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-gray-100 p-5">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-3">
                  <MaterialIcon icon="location_on" className="text-xl text-primary" />
                </div>
                <h3 className="font-semibold text-primary text-sm mb-1">Adres</h3>
                <p className="text-sm text-gray-500">{address}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 p-5">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-3">
                  <MaterialIcon icon="phone" className="text-xl text-primary" />
                </div>
                <h3 className="font-semibold text-primary text-sm mb-1">Telefon</h3>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-sm text-gray-500 hover:text-primary transition-colors">
                  {phone}
                </a>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 p-5">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-3">
                  <MaterialIcon icon="mail" className="text-xl text-primary" />
                </div>
                <h3 className="font-semibold text-primary text-sm mb-1">E-posta</h3>
                <a href={`mailto:${email}`} className="text-sm text-gray-500 hover:text-primary transition-colors">
                  {email}
                </a>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 p-5">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-3">
                  <MaterialIcon icon="schedule" className="text-xl text-primary" />
                </div>
                <h3 className="font-semibold text-primary text-sm mb-1">Çalışma Saatleri</h3>
                <p className="text-sm text-gray-500">{workingHours}</p>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              {mapEmbedUrl ? (
                <iframe
                  src={mapEmbedUrl}
                  className="w-full aspect-[4/3]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Konum haritası"
                />
              ) : (
                <div className="aspect-[4/3] bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                  <MaterialIcon icon="map" className="text-6xl mb-2" />
                  <p className="text-sm">Harita burada gösterilecek</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
