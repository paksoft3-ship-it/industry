"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/siteData";
import MaterialIcon from "@/components/ui/MaterialIcon";

// Define the grouping structure based on the reference design
const categoryGroups = [
    {
        id: "hareket-kontrol",
        title: "Hareket Kontrol Sistemleri",
        subtitle: "Yüksek hassasiyetli pozisyonlama ve hız kontrolü",
        icon: "motion_mode",
        colorClass: "text-primary",
        bgClass: "bg-blue-50",
        categoryIds: ["servo-motor", "step-motor-surucu", "hiz-kontrol"],
        badge: "Hareket",
    },
    {
        id: "mekanik",
        title: "Mekanik Aksamlar",
        subtitle: "Doğrusal hareket ve güç aktarım elemanları",
        icon: "settings_suggest",
        colorClass: "text-emerald-600",
        bgClass: "bg-emerald-50",
        categoryIds: ["vidali-mil-somun", "lineer-ray-arabalar", "lineer-rulman", "dokum-yataklar", "sigma-profil", "otomatik-yaglama"],
        badge: "Mekanik",
    },
    {
        id: "spindle",
        title: "Spindle & Redüktör & Router",
        subtitle: "Yüksek devirli işleme motorları ve güç aktarımı",
        icon: "speed",
        colorClass: "text-orange-600",
        bgClass: "bg-orange-50",
        categoryIds: ["spindle-motorlar", "planet-reduktor", "cnc-router"],
        badge: "Motor",
    },
    {
        id: "elektronik",
        title: "Kontrol ve Elektronik",
        subtitle: "CNC kontrol kartları, güç kaynakları ve kablolama",
        icon: "developer_board",
        colorClass: "text-purple-600",
        bgClass: "bg-purple-50",
        categoryIds: ["mach3-kontrol", "guc-kaynaklari", "kablo-kanali", "vakum-pompasi"],
        badge: "Elektronik",
    },
];

export default function CategoryShowcase() {
    const [activeSection, setActiveSection] = useState("");

    // Handle scroll spy for sidebar navigation
    useEffect(() => {
        const handleScroll = () => {
            const sections = categoryGroups.map((g) => document.getElementById(g.id));
            const scrollPosition = window.scrollY + 150; // Offset for header

            for (const section of sections) {
                if (
                    section &&
                    section.offsetTop <= scrollPosition &&
                    section.offsetTop + section.offsetHeight > scrollPosition
                ) {
                    setActiveSection(section.id);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: "smooth",
            });
            setActiveSection(id);
        }
    };

    return (
        <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-8">
            {/* Sticky Left Sidebar */}
            <aside className="w-full lg:w-64 hidden lg:flex flex-col gap-6 sticky top-24 h-[calc(100vh-8rem)]">
                {/* Sidebar Header */}
                <div className="pb-2 border-b border-gray-200">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                        Gruplar
                    </h2>
                </div>

                {/* Scrollable Navigation */}
                <nav className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                    {categoryGroups.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => scrollToSection(group.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group text-left ${activeSection === group.id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <MaterialIcon
                                icon={group.icon}
                                className={`text-[20px] ${activeSection === group.id ? "text-primary" : "text-gray-400 group-hover:text-primary"
                                    }`}
                            />
                            <span className="text-sm font-medium">{group.title.split(" ")[0]}...</span>
                        </button>
                    ))}
                </nav>

                {/* Sidebar Footer Ad */}
                <div className="mt-auto p-4 bg-gray-900 rounded-xl relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MaterialIcon icon="support_agent" className="text-6xl text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1 relative z-10">
                        Proje Desteği
                    </h3>
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
                        {categoryGroups.map((group) => (
                            <button
                                key={group.id}
                                onClick={() => scrollToSection(group.id)}
                                className="px-4 py-1.5 rounded-full text-sm font-medium bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary hover:text-primary transition-all whitespace-nowrap"
                            >
                                {group.title.split(" ")[0]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Sections */}
                {categoryGroups.map((group) => (
                    <section
                        key={group.id}
                        id={group.id}
                        className="flex flex-col gap-6 scroll-mt-28"
                    >
                        <div className="flex items-center gap-4 pb-2 border-b border-gray-200">
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${group.bgClass} ${group.colorClass}`}
                            >
                                <MaterialIcon icon={group.icon} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {group.title}
                                </h2>
                                <p className="text-sm text-gray-500">{group.subtitle}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.categoryIds.map((catId) => {
                                const category = categories.find((c) => c.id === catId);
                                if (!category) return null;

                                return (
                                    <Link
                                        key={category.id}
                                        href={`/kategori/${category.id}`}
                                        className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-primary group-hover:text-white transition-colors">
                                                <MaterialIcon icon={category.icon} className="text-[28px]" />
                                            </div>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded ${group.bgClass.replace('50', '50')} ${group.colorClass}`}>
                                                {group.badge}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors font-[family-name:var(--font-display)]">
                                            {category.name}
                                        </h3>

                                        <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">
                                            {category.subtitle} - {category.productCount} ürün çeşidi ile stoklayın.
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            {category.image && (
                                                <div className="w-full h-32 relative rounded-lg overflow-hidden mb-3 hidden group-hover:block transition-all animate-fadeIn">
                                                    <Image
                                                        src={category.image}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/10" />
                                                </div>
                                            )}
                                            <div className="flex flex-col w-full">
                                                <span className="text-xs text-gray-400 font-medium mb-3">{category.productCount}+ Ürün</span>
                                                <button className="w-full px-4 py-2 bg-gray-100 text-gray-900 text-sm font-bold rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                                    İncele
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {/* Footer Spacer */}
                <div className="h-20"></div>
            </div>
        </div>
    );
}
