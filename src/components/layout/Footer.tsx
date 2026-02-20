import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";

const siteName = "CNC Otomasyon";
const address = "İkitelli OSB Mah. Marmara Sanayi Sitesi M Blok No:12 Başakşehir / İstanbul";
const phone = "+90 212 555 00 00";
const email = "info@cncotomasyon.com";
const social = { facebook: "#", instagram: "#", linkedin: "#" };

const quickLinks = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Ürünler", href: "/kategori/tumu" },
  { label: "Markalar", href: "/markalar" },
  { label: "Kampanyalar", href: "/kampanyalar" },
  { label: "Blog & Eğitim", href: "/blog-egitim" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Dosya Merkezi", href: "/dosya-merkezi" },
  { label: "Sipariş Takip", href: "/siparis-takip" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0d121c] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-12 w-64">
                <Image
                  src="/images/sivtech_makina_horizontal.png"
                  alt={siteName}
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Endüstriyel otomasyon sektöründe lider tedarikçi. Kaliteli ürünler, uygun
              fiyatlar ve mühendislik desteği ile yanınızdayız.
            </p>
            <div className="flex gap-4">
              <a
                href={social.facebook}
                className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-xs"
              >
                FB
              </a>
              <a
                href={social.linkedin}
                className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-xs"
              >
                LI
              </a>
              <a
                href={social.instagram}
                className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-xs"
              >
                IG
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 font-[family-name:var(--font-display)]">
              Hızlı Linkler
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 font-[family-name:var(--font-display)]">
              İletişim
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MaterialIcon icon="location_on" className="text-primary mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <MaterialIcon icon="call" className="text-primary" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <MaterialIcon icon="mail" className="text-primary" />
                <span>{email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6 font-[family-name:var(--font-display)]">
              Bültene Katıl
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Yeni ürünler ve kampanyalardan haberdar olmak için kaydolun.
            </p>
            <form className="flex flex-col gap-3">
              <input
                className="bg-gray-800 border-none rounded-lg h-10 px-4 text-sm text-white focus:ring-1 focus:ring-primary placeholder-gray-500"
                placeholder="E-posta adresiniz"
                type="email"
              />
              <button className="bg-primary hover:bg-primary-dark text-white font-bold h-10 rounded-lg text-sm transition-colors">
                Kayıt Ol
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; 2026 {siteName}. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4">
            <div className="h-6 w-10 bg-gray-700 rounded" />
            <div className="h-6 w-10 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </footer>
  );
}
