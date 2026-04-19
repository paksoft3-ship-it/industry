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

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Footer({
  phone,
  email,
  address,
  facebookUrl,
  instagramUrl,
  linkedinUrl,
  youtubeUrl,
  siteName,
  pages,
}: {
  phone: string;
  email: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  siteName: string;
  pages: { id: string; title: string; slug: string }[];
}) {
  const socialLinks = [
    { url: facebookUrl, Icon: FacebookIcon, label: "Facebook", hoverColor: "hover:bg-[#1877F2]" },
    { url: instagramUrl, Icon: InstagramIcon, label: "Instagram", hoverColor: "hover:bg-gradient-to-br hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045]" },
    { url: linkedinUrl, Icon: LinkedInIcon, label: "LinkedIn", hoverColor: "hover:bg-[#0A66C2]" },
    { url: youtubeUrl, Icon: YouTubeIcon, label: "YouTube", hoverColor: "hover:bg-[#FF0000]" },
  ].filter((s) => s.url);

  return (
    <footer className="bg-[#0d121c] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-10 w-40 sm:h-12 sm:w-52">
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
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map(({ url, Icon, label, hoverColor }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center transition-colors ${hoverColor}`}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-5 font-[family-name:var(--font-display)] text-white">
              Hızlı Linkler
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="font-bold text-base mb-5 font-[family-name:var(--font-display)] text-white">
              Kurumsal
            </h4>
            {pages.length > 0 ? (
              <ul className="space-y-2.5 text-sm text-gray-400">
                {pages.map((page) => (
                  <li key={page.id}>
                    <Link href={`/sayfa/${page.slug}`} className="hover:text-white transition-colors">
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm italic">Henüz sayfa eklenmedi.</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-base mb-5 font-[family-name:var(--font-display)] text-white">
              İletişim
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {address && (
                <li className="flex items-start gap-3">
                  <MaterialIcon icon="location_on" className="text-primary mt-0.5 flex-shrink-0" />
                  <span>{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-3">
                  <MaterialIcon icon="call" className="text-primary flex-shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <MaterialIcon icon="mail" className="text-primary flex-shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors break-all">{email}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-base mb-5 font-[family-name:var(--font-display)] text-white">
              Bültene Katıl
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Yeni ürünler ve kampanyalardan haberdar olmak için kaydolun.
            </p>
            <form className="flex flex-col gap-3">
              <input
                className="bg-gray-800 border-none rounded-lg h-10 px-4 text-sm text-white focus:ring-1 focus:ring-primary placeholder-gray-500 outline-none"
                placeholder="E-posta adresiniz"
                type="email"
              />
              <button className="bg-primary hover:bg-primary/90 text-white font-bold h-10 rounded-lg text-sm transition-colors">
                Kayıt Ol
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-gray-500 text-xs order-3 lg:order-1">
              &copy; {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.
            </p>

            {/* Developed by */}
            <div className="flex flex-wrap items-center justify-center gap-3 order-1 lg:order-2">
              <a
                href="https://www.paksoft.com.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center group bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:bg-white/10 transition-all"
              >
                <span className="font-bold text-base tracking-tight text-white group-hover:text-primary transition-colors">PakSoft</span>
              </a>
              <span className="text-gray-500 text-sm italic">ve</span>
              <a
                href="https://724dijital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center group bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:bg-white/10 transition-all"
              >
                <span className="font-bold text-base tracking-tight text-white group-hover:text-primary transition-colors">724Dijital</span>
              </a>
              <span className="text-gray-500 text-xs tracking-wide hidden sm:inline">Uluslararası Teknoloji Ortaklığı</span>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-3 order-2 lg:order-3">
              {/* Visa */}
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center">
                <svg viewBox="0 0 780 500" className="h-4 w-auto">
                  <path d="M293.2 348.7l33.4-195.7h53.4l-33.4 195.7h-53.4zM536.5 157.2c-10.6-4-27.2-8.2-48-8.2-52.9 0-90.2 26.6-90.5 64.7-.3 28.1 26.6 43.8 46.9 53.2 20.8 9.6 27.8 15.7 27.7 24.3-.1 13.1-16.6 19.1-32 19.1-21.4 0-32.7-3-50.3-10.3l-6.9-3.1-7.5 43.6c12.5 5.4 35.5 10.1 59.5 10.3 56.1 0 92.6-26.3 93-67.1.2-22.4-14.1-39.4-44.9-53.4-18.7-9.1-30.2-15.1-30.1-24.3 0-8.1 9.7-16.8 30.6-16.8 17.5-.3 30.2 3.5 40.1 7.5l4.8 2.3 7.2-43.7" fill="#1A1F71"/>
                  <path d="M638.1 152.9h-41.3c-12.8 0-22.4 3.5-28 16.3l-79.4 179.6h56.1l11.1-29.2 68.4.1c1.6 6.8 6.5 29.1 6.5 29.1H680l-41.9-195.9zm-65.6 126.3c4.4-11.3 21.3-54.7 21.3-54.7-.3.5 4.4-11.4 7.1-18.8l3.6 17s10.2 46.6 12.3 56.5H572.5z" fill="#1A1F71"/>
                  <path d="M240.6 152.9l-52.4 133.5-5.6-27.3c-9.7-31.2-40-65-73.9-81.9l48 172.3 56.5-.1 84.1-196.5-56.7"  fill="#1A1F71"/>
                  <path d="M140.2 152.9H55.8l-.7 4c65.5 15.8 108.8 54 126.9 99.9l-18.3-87.6c-3.2-12.3-12.5-15.9-23.5-16.3" fill="#F9A51A"/>
                </svg>
              </div>

              {/* Mastercard */}
              <div className="h-7 px-1.5 bg-white rounded flex items-center justify-center gap-0">
                <svg viewBox="0 0 48 30" className="h-5 w-auto">
                  <circle cx="15" cy="15" r="15" fill="#EB001B"/>
                  <circle cx="33" cy="15" r="15" fill="#F79E1B"/>
                  <path d="M24 4.8a15 15 0 010 20.4A15 15 0 0124 4.8z" fill="#FF5F00"/>
                </svg>
              </div>

              {/* Troy */}
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center">
                <svg viewBox="0 0 80 28" className="h-4 w-auto">
                  <rect width="80" height="28" rx="3" fill="white"/>
                  <text x="8" y="20" fontFamily="Arial" fontWeight="900" fontSize="16" fill="#1a237e" letterSpacing="1">TROY</text>
                  <circle cx="72" cy="14" r="5" fill="#FFB300"/>
                </svg>
              </div>

              {/* PayPal */}
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center">
                <svg viewBox="0 0 101 32" className="h-4 w-auto">
                  <path d="M12.237 2.8H5.437c-.483 0-.894.35-.97.83L1.697 27.3c-.056.35.217.665.573.665h3.33c.483 0 .894-.35.97-.832l.815-5.178c.075-.48.487-.832.97-.832h2.14c4.46 0 7.035-2.16 7.706-6.437.304-1.872.013-3.34-.864-4.368-.964-1.133-2.673-1.731-4.95-1.731l.002.213z" fill="#003087"/>
                  <path d="M13.101 9.232c-.37-.054-.75-.081-1.14-.081H7.297c-.96 0-1.788.69-1.94 1.638L4.1 21.45c-.04.25.153.476.404.476h2.656l.666-4.222-.02.132c.153-.948.98-1.638 1.94-1.638h.404c3.63 0 6.474-1.476 7.303-5.747.025-.127.047-.25.065-.372-.208-.11-.424-.207-.65-.293-.277-.098-.57-.178-.868-.24" fill="#009cde"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
