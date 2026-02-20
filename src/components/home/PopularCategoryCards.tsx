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

export default function PopularCategoryCards() {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Select categories that have images for the card view
    const featuredCategories = categories.filter((c) => c.image);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const amount = 340;
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
                        Öne Çıkan Kategoriler
                    </h2>
                    <p className="text-gray-500 mt-2 max-w-2xl">
                        Projeleriniz için en uygun parçaları detaylı inceleyin.
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
                            aria-label="Previous featured categories"
                        >
                            <MaterialIcon icon="arrow_back" className="text-[20px]" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors bg-white text-gray-600"
                            aria-label="Next featured categories"
                        >
                            <MaterialIcon icon="arrow_forward" className="text-[20px]" />
                        </button>
                    </div>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar"
            >
                {featuredCategories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/kategori/${cat.id}`}
                        className="group relative overflow-hidden rounded-xl aspect-[4/5] min-w-[260px] sm:min-w-[280px] bg-gray-100 flex flex-col justify-end p-4 transition-transform hover:-translate-y-1 hover:shadow-lg snap-start"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url('${cat.image}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="relative z-10 text-white">
                            <MaterialIcon icon={cat.icon} className="mb-2 opacity-80" />
                            <h3 className="font-bold text-lg font-[family-name:var(--font-display)]">
                                {cat.name}
                            </h3>
                            <p className="text-xs text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                {cat.subtitle}
                            </p>
                        </div>
                    </Link>
                ))}

                {/* See All Card */}
                <Link
                    href="/kategori/tumu"
                    className="group relative overflow-hidden rounded-xl aspect-[4/5] min-w-[260px] sm:min-w-[280px] bg-gray-50 flex flex-col justify-center items-center p-4 transition-transform hover:-translate-y-1 hover:shadow-lg snap-start border-2 border-dashed border-gray-300 hover:border-primary"
                >
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <MaterialIcon icon="arrow_forward" className="text-2xl text-primary" />
                    </div>
                    <span className="font-bold text-lg text-gray-700 group-hover:text-primary transition-colors">Tümünü Gör</span>
                </Link>      </div>
        </section>
    );
}
