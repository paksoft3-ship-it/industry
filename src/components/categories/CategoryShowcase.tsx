"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";

type CategoryChild = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  description: string | null;
  _count: { products: number };
  children: { id: string; name: string; slug: string }[];
};

type RootCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  description: string | null;
  _count: { products: number };
  children: CategoryChild[];
};

const colorPalettes = [
  { colorClass: "text-primary", bgClass: "bg-blue-50" },
  { colorClass: "text-emerald-600", bgClass: "bg-emerald-50" },
  { colorClass: "text-orange-600", bgClass: "bg-orange-50" },
  { colorClass: "text-purple-600", bgClass: "bg-purple-50" },
  { colorClass: "text-rose-600", bgClass: "bg-rose-50" },
  { colorClass: "text-amber-600", bgClass: "bg-amber-50" },
];

export default function CategoryShowcase({ categories }: { categories: RootCategory[] }) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const cat of categories) {
        const section = document.getElementById(cat.id);
        if (
          section &&
          section.offsetTop <= scrollPosition &&
          section.offsetTop + section.offsetHeight > scrollPosition
        ) {
          setActiveSection(cat.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-8">
      {/* Sticky Left Sidebar */}
      <aside className="w-full lg:w-64 hidden lg:flex flex-col gap-6 sticky top-24 h-[calc(100vh-8rem)]">
        <div className="pb-2 border-b border-gray-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Gruplar</h2>
        </div>

        <nav className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(cat.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group text-left ${
                activeSection === cat.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MaterialIcon
                icon={cat.icon || "category"}
                className={`text-[20px] ${
                  activeSection === cat.id ? "text-primary" : "text-gray-400 group-hover:text-primary"
                }`}
              />
              <span className="text-sm font-medium truncate">{cat.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-gray-900 rounded-xl relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <MaterialIcon icon="support_agent" className="text-6xl text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1 relative z-10">Proje Desteği</h3>
          <p className="text-gray-400 text-xs mb-3 relative z-10">
            Mühendislerimizden ücretsiz proje danışmanlığı alın.
          </p>
          <span className="text-primary text-xs font-bold flex items-center gap-1 relative z-10">
            Randevu Al <MaterialIcon icon="arrow_forward" className="text-[14px]" />
          </span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">
              Ana Sayfa
            </Link>
            <MaterialIcon icon="chevron_right" className="text-[14px]" />
            <span className="font-medium text-gray-900">Kategoriler</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2 font-[family-name:var(--font-display)]">
                Kategoriler
              </h1>
              <p className="text-gray-500 max-w-2xl text-lg">
                Endüstriyel otomasyon ve CNC projeleriniz için geniş ürün yelpazesi ve kapsamlı teknik rehber.
              </p>
            </div>
          </div>

          {/* Filter Chips (Quick Jump on Mobile) */}
          <div className="flex lg:hidden flex-wrap gap-2 py-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary hover:text-primary transition-all whitespace-nowrap"
              >
                {cat.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {categories.map((rootCat, index) => {
          const palette = colorPalettes[index % colorPalettes.length];
          // If root category has children, show children as cards; otherwise show root itself as a card
          const cards: (CategoryChild | RootCategory)[] =
            rootCat.children.length > 0 ? rootCat.children : [rootCat];
          const badge = rootCat.name.split(" ")[0];

          return (
            <section key={rootCat.id} id={rootCat.id} className="flex flex-col gap-6 scroll-mt-28">
              <div className="flex items-center gap-4 pb-2 border-b border-gray-200">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${palette.bgClass} ${palette.colorClass}`}
                >
                  <MaterialIcon icon={rootCat.icon || "category"} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{rootCat.name}</h2>
                  {rootCat.description && (
                    <p className="text-sm text-gray-500">{rootCat.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/kategori/${cat.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-primary group-hover:text-white transition-colors">
                        <MaterialIcon icon={cat.icon || "category"} className="text-[28px]" />
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded ${palette.bgClass} ${palette.colorClass}`}
                      >
                        {badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors font-[family-name:var(--font-display)]">
                      {cat.name}
                    </h3>

                    {cat.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                        {cat.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      {cat.image && (
                        <div className="w-full h-32 relative rounded-lg overflow-hidden mb-3 hidden group-hover:block transition-all">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/10" />
                        </div>
                      )}
                      <div className="flex flex-col w-full">
                        <span className="text-xs text-gray-400 font-medium mb-3">
                          {cat._count.products}+ Ürün
                        </span>
                        <button className="w-full px-4 py-2 bg-gray-100 text-gray-900 text-sm font-bold rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                          İncele
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <div className="h-20" />
      </div>
    </div>
  );
}
