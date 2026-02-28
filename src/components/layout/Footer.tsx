import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";

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

export default function Footer({
  phone,
  email,
  address,
  facebookUrl,
  instagramUrl,
  linkedinUrl,
  siteName,
}: {
  phone: string;
  email: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  siteName: string;
}) {
  return (
    <footer className="bg-[#0d121c] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-10 w-40 sm:h-12 sm:w-64">
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
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-xs"
                >
                  FB
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-xs"
                >
                  LI
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-xs"
                >
                  IG
                </a>
              )}
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
              {address && (
                <li className="flex items-start gap-3">
                  <MaterialIcon icon="location_on" className="text-primary mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-3">
                  <MaterialIcon icon="call" className="text-primary" />
                  <span>{phone}</span>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <MaterialIcon icon="mail" className="text-primary" />
                  <span>{email}</span>
                </li>
              )}
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

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-2">
            {/* Left: Copyright */}
            <p className="text-gray-500 text-xs order-3 lg:order-1">
              &copy; {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.
            </p>

            {/* Middle: Developed By Partnership */}
            <div className="flex flex-wrap items-center justify-center gap-3 order-1 lg:order-2">
              <a
                href="https://www.paksoft.com.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center group bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center text-white group-hover:text-primary transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 -rotate-12">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.08-1.38-.7.13-1.42.21-2.16.21-5.52 0-10-4.48-10-10S9.42 2.83 14.92 2.83c.74 0 1.46.08 2.16.21C15.58 2.5 13.85 2 12 2z" />
                  </svg>
                  <span className="font-bold text-lg tracking-tight ml-1.5">PakSoft</span>
                </div>
              </a>
              <span className="text-gray-400 text-sm font-medium italic">ve</span>
              <a
                href="https://724dijital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center group bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-white group-hover:text-primary transition-colors font-bold text-lg tracking-tight">724Dijital</span>
              </a>
              <span className="text-gray-400 text-sm font-medium tracking-wide">
                Uluslararası Teknoloji Ortaklığı Tarafından Geliştirilmiştir
              </span>
            </div>

            {/* Right: Payment Icons */}
            <div className="flex items-center gap-6 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 order-2 lg:order-3">
              <svg viewBox="0 0 40 12" className="h-4 w-auto fill-white">
                <path d="M16.5 11.4l2.1-11h2.7l-2.1 11h-2.7zm10.7-10.7c-.5-.2-1.3-.4-2.3-.4-2.5 0-4.3 1.3-4.3 3.3 0 1.4 1.3 2.2 2.3 2.7 1 .5 1.3.8 1.3 1.3 0 .7-.9 1-1.7 1-.7 0-1.2-.1-1.8-.4l-.3-.1-.3 1.9c.5.2 1.5.4 2.5.4 2.6 0 4.4-1.3 4.4-3.3 0-1.1-.7-1.9-2.1-2.6-.9-.4-1.4-.7-1.4-1.2 0-.4.4-.9 1.4-.9.6 0 1 .1 1.4.3l.2.1.3-1.8zm6.5 6.9l-1.1-5.5-.6-2.5h-2.1l-.1.6-4.1 8.9h2.8l.6-1.5h3.4l.3 1.5h.9zm-2.4-3.5l-1 2.5h2.1l-1.1-2.5zM7.5 11.4L10 0.4h2.7l-2.5 11H7.5z" />
              </svg>
              <svg viewBox="0 0 24 18" className="h-6 w-auto">
                <circle cx="7" cy="9" r="7" fill="#EB001B" />
                <circle cx="17" cy="9" r="7" fill="#F79E1B" />
                <path d="M12 9A7 7 0 0 1 12 9.01" fill="#FF5F00" />
              </svg>
              <svg viewBox="0 0 18 20" className="h-5 w-auto">
                <path fill="#253B80" d="M14.2 4.4c-.2-1.2-.8-2.2-1.8-2.9C11.5.8 10.1.5 8.3.5H1.6c-.3 0-.5.2-.6.5l-2 12.8c0 .2.1.4.3.4h3.6l.8-5.3.1-.7c0-.3.3-.5.6-.5h2.1c3.1 0 5.5-1.3 6.2-4.6.1-1 .3-2 .5-3.1z" />
                <path fill="#179BD7" d="M16.4 7.4c-.2-1.2-.8-2.2-1.8-2.9-1-.7-2.3-1-4.2-1H3.8c-.3 0-.5.2-.6.5l-1.9 12.2c0 .2.1.4.3.4h3.1c.3 0 .5-.2.6-.5l.8-5.3.1-.7c0-.3.3-.5.6-.5h.8c2.8 0 5-1.1 5.6-4.2.1-.8.2-1.5.3-2.3z" />
              </svg>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-black italic text-[10px] tracking-tighter">TROY</span>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
