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
  educationCategories?: any[];
  blogCategories?: any[];
}

export default function MegaMenu({ onClose, menuType = "categories", categories, educationCategories = [], blogCategories = [] }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeTab, setActiveTab] = useState<"egitim" | "blog">("egitim");

  // Eğitim / Blog Menu Layout (Two Tabs)
  if (menuType === "education-blog") {
    const displayCategories = activeTab === "egitim" ? educationCategories : blogCategories;
    const basePath = activeTab === "egitim" ? "/egitim" : "/blog";

    return (
      <div className="absolute left-0 top-full w-full bg-white border-t border-gray-200 shadow-2xl z-[100] py-10 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left: Info & Tabs */}
            <div className="w-full md:w-1/4">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col h-full">
                <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm mb-6 border border-gray-100">
                  <button
                    onClick={() => setActiveTab("egitim")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${activeTab === "egitim" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                  >
                    EĞİTİM
                  </button>
                  <button
                    onClick={() => setActiveTab("blog")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${activeTab === "blog" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                  >
                    BLOG
                  </button>
                </div>

                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <MaterialIcon icon={activeTab === "egitim" ? "school" : "article"} className="text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-display)]">
                    {activeTab === "egitim" ? "Eğitim Akademisi" : "Bilgi Blogu"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    {activeTab === "egitim"
                      ? "Teknik dökümanlar, rehberler ve sektördeki en iyi uygulamalarla kendinizi geliştirin."
                      : "Sektörel haberler, ürün incelemeleri ve başarı hikayelerinden haberdar olun."}
                  </p>
                </div>

                <Link
                  href={basePath}
                  onClick={onClose}
                  className="mt-auto inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all"
                >
                  TÜM {activeTab === "egitim" ? "EĞİTİMLERE" : "YAZILARA"} GÖZ AT <MaterialIcon icon="arrow_forward" className="text-lg" />
                </Link>
              </div>
            </div>

            {/* Right: Category Cards Grid */}
            <div className="flex-1">
              {displayCategories.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <MaterialIcon icon="sentiment_dissatisfied" className="text-4xl text-gray-300 mb-2" />
                  <p className="text-gray-400 font-medium italic">Henüz bu kategoride içerik bulunmuyor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayCategories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`${basePath}/${cat.slug}`}
                      onClick={onClose}
                      className="group flex flex-col p-5 rounded-2xl bg-white hover:bg-gray-50 transition-all border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center border border-gray-100 shadow-sm">
                          <MaterialIcon icon={activeTab === "egitim" ? "auto_stories" : "newspaper"} className="text-xl" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{cat.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{cat._count?.posts || 0} İçerik</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                        {cat.name} hakkındaki tüm makalelerimizi ve dökümanlarımızı inceleyin.
                      </p>
                      <div className="mt-4 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-5px] group-hover:translate-x-0">
                        <MaterialIcon icon="arrow_right_alt" className="text-xl" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
  if (categories.length === 0) {
    return (
      <div className="absolute left-0 top-full w-full bg-white border-t border-gray-200 shadow-2xl z-40 py-12">
        <div className="max-w-[1440px] mx-auto px-4 text-center">
          <MaterialIcon icon="inventory_2" className="text-5xl text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">Henüz kategori eklenmemiştir.</p>
          <p className="text-sm text-gray-400 mt-1">Admin panelinden kategori ekleyerek burayı doldurabilirsiniz.</p>
        </div>
      </div>
    );
  }

  const category = categories[activeCategory];
  if (!category) return null;

  return (
    <>
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
