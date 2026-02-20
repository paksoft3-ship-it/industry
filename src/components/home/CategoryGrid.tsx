"use client";
import { useRef } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const categories = [
  { id: "sigma-profil", name: "Sigma Profil", subtitle: "Yapısal Çerçeve", icon: "view_in_ar", image: "" },
  { id: "elektronik", name: "Elektronik", subtitle: "Kontrol Sistemleri", icon: "memory", image: "" },
  { id: "spindle-motorlar", name: "Spindle Motor", subtitle: "İşleme Motorları", icon: "speed", image: "" },
  { id: "lineer-ray-arabalar", name: "Lineer Ray", subtitle: "Hassas Hareket", icon: "linear_scale", image: "" },
  { id: "cnc-router", name: "CNC Router", subtitle: "Komple Çözümler", icon: "router", image: "" },
  { id: "step-motor-surucu", name: "Step Motor Sürücü", subtitle: "Hareket Kontrolü", icon: "settings_input_component", image: "" },
];

export default function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight font-[family-name:var(--font-display)]">
            Popüler Kategoriler
          </h2>
          <p className="text-gray-500 mt-2 max-w-2xl">
            İhtiyacınız olan tüm endüstriyel çözümler burada.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/kategori/tumu"
            className="hidden md:flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
          >
            Tümünü Gör
            <MaterialIcon
              icon="arrow_forward"
              className="text-[18px]"
            />
          </Link>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors bg-white text-gray-600"
              aria-label="Previous categories"
            >
              <MaterialIcon icon="arrow_back" className="text-[20px]" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors bg-white text-gray-600"
              aria-label="Next categories"
            >
              <MaterialIcon icon="arrow_forward" className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar"
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/kategori/${cat.id}`}
            className="flex flex-col items-center gap-3 min-w-[160px] sm:min-w-[180px] snap-start group"
          >
            {/* Circular Image Container */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-amber-400 p-1 bg-white transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-50 flex items-center justify-center">
                {cat.image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${cat.image}')` }}
                  />
                ) : (
                  <MaterialIcon icon={cat.icon} className="text-6xl text-gray-300" />
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-center font-bold text-gray-800 text-sm sm:text-base px-2 leading-tight group-hover:text-primary transition-colors">
              {cat.name}
            </h3>
          </Link>
        ))}

        {/* See All Card */}
        <Link
          href="/kategori/tumu"
          className="flex flex-col items-center gap-3 min-w-[160px] sm:min-w-[180px] snap-start group"
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-gray-200 p-1 bg-white transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center text-primary">
              <MaterialIcon icon="arrow_forward" className="text-4xl" />
            </div>
          </div>
          <h3 className="text-center font-bold text-gray-500 text-sm sm:text-base px-2 leading-tight group-hover:text-primary transition-colors">
            Tümünü Gör
          </h3>
        </Link>
      </div>
    </section>
  );
}
