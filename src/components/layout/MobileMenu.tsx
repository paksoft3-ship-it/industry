"use client";
import { useState } from "react";
import Link from "next/link";
import { navLinks, mobileMenuCategories } from "@/data/siteData";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const [openCategory, setOpenCategory] = useState<number | null>(0);

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background-light flex flex-col z-50">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white shrink-0">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 font-[family-name:var(--font-display)]">
            Menü
          </h2>
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            <MaterialIcon icon="close" />
          </button>
        </header>

        {/* Search */}
        <div className="px-5 py-4 bg-white shrink-0">
          <div className="relative flex items-center w-full h-12 rounded-lg bg-gray-100 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <div className="grid place-items-center h-full w-12 text-gray-400">
              <MaterialIcon icon="search" />
            </div>
            <input
              className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 bg-transparent placeholder-gray-500 font-medium"
              placeholder="Ürün, kategori veya marka ara..."
              type="text"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* Account Card */}
          <div className="px-5 py-2 mb-2">
            <Link
              href="#"
              className="bg-primary/10 rounded-xl p-4 flex items-center justify-between"
              onClick={onClose}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
                  <MaterialIcon icon="person" className="text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">Hoşgeldiniz</span>
                  <span className="text-xs text-primary font-medium">Giriş Yap / Kayıt Ol</span>
                </div>
              </div>
              <MaterialIcon icon="chevron_right" className="text-primary" />
            </Link>
          </div>

          {/* Accordion Categories */}
          <div className="flex flex-col gap-2 px-5 pb-6">
            {mobileMenuCategories.map((cat, i) => (
              <div
                key={cat.name}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                <button
                  className={`w-full flex cursor-pointer items-center justify-between p-4 transition-colors ${
                    openCategory === i ? "bg-gray-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setOpenCategory(openCategory === i ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <MaterialIcon
                      icon={cat.icon}
                      className={openCategory === i ? "text-primary" : "text-gray-500"}
                    />
                    <span className="font-bold text-gray-900 text-[15px]">{cat.name}</span>
                  </div>
                  <MaterialIcon
                    icon="expand_more"
                    className={`text-gray-400 transition-transform ${
                      openCategory === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openCategory === i && cat.subcategories.length > 0 && (
                  <div className="px-4 pb-4 pt-2 bg-gray-50">
                    <ul className="flex flex-col gap-3 border-l-2 border-primary/20 ml-2 pl-4">
                      {cat.subcategories.map((sub) => (
                        <li key={sub.title}>
                          <Link
                            href={sub.href}
                            className="flex items-center justify-between text-gray-600 hover:text-primary text-sm transition-colors"
                            onClick={onClose}
                          >
                            {sub.title}
                            {sub.items.length > 0 && (
                              <MaterialIcon icon="arrow_forward" className="text-[16px]" />
                            )}
                          </Link>
                          {sub.items.length > 0 && (
                            <ul className="mt-2 ml-1 flex flex-col gap-2">
                              {sub.items.map((item) => (
                                <li key={item.label}>
                                  <Link
                                    href={item.href}
                                    className="text-gray-500 hover:text-primary text-xs block py-1"
                                    onClick={onClose}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Nav Links */}
          <div className="px-5 pb-4">
            <div className="flex flex-col gap-1">
              {navLinks
                .filter((l) => l.label !== "Kategoriler" && l.label !== "Teklif Al")
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 text-sm font-medium hover:bg-white rounded-lg transition-colors flex items-center justify-between"
                    onClick={onClose}
                  >
                    {link.label}
                    <MaterialIcon icon="chevron_right" className="text-gray-400 text-[18px]" />
                  </Link>
                ))}
            </div>
          </div>

          {/* Extra Links */}
          <div className="px-5 pb-8 flex flex-col gap-3">
            <Link
              href="/kampanyalar"
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-gray-200"
              onClick={onClose}
            >
              <MaterialIcon icon="percent" className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">İndirimli Ürünler</span>
            </Link>
            <Link
              href="/urunler"
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-gray-200"
              onClick={onClose}
            >
              <MaterialIcon icon="new_releases" className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Yeni Gelenler</span>
            </Link>
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 pb-6 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/siparis-takip"
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-50 group"
              onClick={onClose}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                <MaterialIcon icon="local_shipping" className="text-[20px]" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 text-center leading-tight">
                Sipariş
                <br />
                Takip
              </span>
            </Link>
            <Link
              href="/iletisim"
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-50 group"
              onClick={onClose}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                <MaterialIcon icon="support_agent" className="text-[20px]" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 text-center leading-tight">
                İletişim
              </span>
            </Link>
            <Link
              href="/dosya-merkezi"
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-50 group"
              onClick={onClose}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                <MaterialIcon icon="folder_open" className="text-[20px]" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 text-center leading-tight">
                Dosya
                <br />
                Merkezi
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
