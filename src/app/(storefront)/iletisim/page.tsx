import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getSettings } from "@/lib/actions/settings";
import ContactFormClient from "@/components/contact/ContactFormClient";

export const dynamic = "force-dynamic";

export default async function IletisimPage() {
  const settings = await getSettings();

  const address      = settings.address      || "Organize Sanayi Bölgesi, No: 123, İstanbul, Türkiye";
  const phone        = settings.phone        || "+90 (212) 123 45 67";
  const email        = settings.email        || "info@example.com";
  const workingHours = settings.workingHours || "Pzt-Cum: 08:00 - 18:00";
  const mapEmbedUrl  = settings.mapEmbedUrl  ||
    `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&hl=tr&z=16`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

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
            <ContactFormClient />
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
              <iframe
                src={mapEmbedUrl}
                className="w-full"
                style={{ height: 380 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Konum haritası"
              />
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500 truncate">{address}</p>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline flex-shrink-0 ml-4"
                >
                  <MaterialIcon icon="directions" className="text-base" />
                  Yol Tarifi Al
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
