"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";
import type { MegaMenuCategory } from "@/lib/types/menu";

const megaMenuPromo = {
  title: "CNC Router Kombin Setleri",
  description: "Hazır CNC çözümleri ile projenize hemen başlayın",
  badge: "Yeni",
  image: "/images/placeholder.jpg",
  href: "/kombin-liste",
};

const megaMenuQuickLinks = [
  { title: "Dosya Merkezi", description: "Teknik dökümanlar", icon: "folder_open", href: "/dosya-merkezi" },
  { title: "Sipariş Takip", description: "Kargo durumu", icon: "local_shipping", href: "/siparis-takip" },
  { title: "İletişim", description: "Bize ulaşın", icon: "support_agent", href: "/iletisim" },
];

interface MegaMenuProps {
  onClose: () => void;
  menuType?: string;
  categories: MegaMenuCategory[];
}

export default function MegaMenu({ onClose, menuType = "categories", categories }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  // Find matching L1 category by slug for card grid layout
  const matchedL1 = menuType !== "categories" ? categories.find((cat) => cat.slug === menuType) : null;

  // Card Grid Layout — when menuType matches an L1 slug
  if (matchedL1) {
    const items = [
      ...matchedL1.children.map((child) => ({
        title: child.name,
        href: `/kategori/${child.slug}`,
        image: child.image || "",
        icon: child.icon,
      })),
      { title: "Tümünü Gör", href: `/kategori/${matchedL1.slug}`, image: "", icon: null },
    ];

    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 top-0 bg-black/40 z-30 backdrop-blur-sm"
          onClick={onClose}
        />
        {/* Menu */}
        <div className="absolute left-0 top-full w-full bg-white border-t border-gray-200 shadow-2xl z-[100] py-8">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex flex-col items-center justify-center text-center p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 ${!item.image ? "h-full min-h-[120px] bg-gray-50 hover:bg-gray-100/80" : ""
                    }`}
                  onClick={onClose}
                >
                  {item.image ? (
                    <div className="w-full aspect-square relative mb-4 bg-white rounded-lg overflow-hidden border border-gray-100 group-hover:border-primary/20 transition-colors p-2">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : null}
                  <span className={`text-sm font-bold text-gray-700 group-hover:text-primary leading-tight ${!item.image ? "text-base px-2" : ""}`}>
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default Categories Layout
  const category = categories[activeCategory];

  if (!category) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 top-0 bg-black/40 z-30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Menu */}
      <div className="absolute left-0 top-full w-full bg-white border-t border-gray-200 shadow-2xl z-40 h-[560px]">
        <div className="max-w-[1440px] mx-auto h-full flex">
          {/* LEFT: Categories */}
          <div className="w-1/4 min-w-[280px] border-r border-gray-100 h-full overflow-y-auto py-4">
            <ul className="flex flex-col">
              {categories.map((cat, i) => (
                <li key={cat.id}>
                  <button
                    className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all ${i === activeCategory
                      ? "bg-gray-50 border-l-4 border-primary text-primary font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary font-medium border-l-4 border-transparent hover:border-gray-200"
                      }`}
                    onMouseEnter={() => setActiveCategory(i)}
                    onClick={() => setActiveCategory(i)}
                  >
                    <div className="flex items-center gap-3">
                      <MaterialIcon icon={cat.icon || "category"} />
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    <MaterialIcon
                      icon="arrow_forward_ios"
                      className={`text-sm ${i === activeCategory ? "" : "opacity-0 group-hover:opacity-100 text-gray-400"
                        }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* MIDDLE: Subcategories */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-display)]">
                {category.name}
              </h2>
              <Link
                href={`/kategori/${category.slug}`}
                className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1"
                onClick={onClose}
              >
                Tümünü Gör <MaterialIcon icon="arrow_forward" className="text-base" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              {category.children.map((sub) => (
                <div key={sub.id} className="group">
                  <Link
                    href={`/kategori/${sub.slug}`}
                    className="block text-gray-900 font-bold mb-3 hover:text-primary flex items-center gap-2 text-sm"
                    onClick={onClose}
                  >
                    <MaterialIcon icon="arrow_right" className="text-gray-400 group-hover:text-primary" />
                    {sub.name}
                  </Link>
                  <ul className="space-y-2 pl-8 border-l border-gray-100">
                    {sub.children.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/kategori/${item.slug}`}
                          className="text-gray-500 hover:text-primary text-sm block transition-colors"
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Promo & Quick Links */}
          <div className="w-1/4 min-w-[280px] bg-gray-50 p-6 flex flex-col gap-6 border-l border-gray-100">
            {/* Promo Banner */}
            <Link
              href={megaMenuPromo.href}
              className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200 group cursor-pointer hover:shadow-md transition-shadow"
              onClick={onClose}
            >
              <div className="h-32 bg-gray-200 relative overflow-hidden">
                <Image
                  src={megaMenuPromo.image}
                  alt={megaMenuPromo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                    {megaMenuPromo.badge}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 font-bold mb-1 leading-tight">{megaMenuPromo.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{megaMenuPromo.description}</p>
                <span className="text-primary text-sm font-bold flex items-center gap-1">
                  İncele <MaterialIcon icon="arrow_forward" className="text-base" />
                </span>
              </div>
            </Link>

            {/* Quick Links */}
            <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-5 flex-1">
              <h4 className="text-gray-900 font-bold mb-4 flex items-center gap-2 font-[family-name:var(--font-display)]">
                <MaterialIcon icon="build" className="text-primary" />
                Hızlı Erişim
              </h4>
              <div className="space-y-3">
                {megaMenuQuickLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group transition-colors"
                    onClick={onClose}
                  >
                    <div className="bg-blue-50 text-primary rounded p-1.5 group-hover:bg-primary group-hover:text-white transition-colors">
                      <MaterialIcon icon={link.icon} className="text-xl" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">{link.title}</span>
                      <span className="text-xs text-gray-500">{link.description}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
