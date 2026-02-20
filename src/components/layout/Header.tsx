"use client";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";
import MegaMenu from "./MegaMenu";
import SearchModal from "./SearchModal";
import MobileMenu from "./MobileMenu";
import AccountDropdown from "@/components/layout/AccountDropdown";
import MiniCartDrawer from "@/components/layout/MiniCartDrawer";
import type { MegaMenuCategory } from "@/lib/types/menu";

const siteName = "CNC Otomasyon";

interface HeaderProps {
  categories: MegaMenuCategory[];
}

export default function Header({ categories }: HeaderProps) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeMenuType, setActiveMenuType] = useState<string>("categories");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoggedIn] = useState(false);

  const megaMenuButtonRef = useRef<HTMLButtonElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);

  const closeMegaMenu = useCallback(() => setMegaMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  const navLinks = useMemo(() => {
    const categoryLinks = categories.map((cat) => ({
      label: cat.name,
      href: `/kategori/${cat.slug}`,
      hasMegaMenu: true,
      menuType: cat.slug,
    }));
    return [
      ...categoryLinks,
      { label: "Sipariş Takip", href: "/siparis-takip", hasMegaMenu: false, menuType: "" },
      { label: "Teklif Al", href: "/kurumsal", hasMegaMenu: false, menuType: "" },
    ];
  }, [categories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Close MegaMenu if clicked outside
      if (
        megaMenuOpen &&
        megaMenuRef.current &&
        !megaMenuRef.current.contains(target) &&
        megaMenuButtonRef.current &&
        !megaMenuButtonRef.current.contains(target) &&
        navRef.current &&
        !navRef.current.contains(target)
      ) {
        setMegaMenuOpen(false);
      }

      // Close Search if clicked outside
      if (
        searchOpen &&
        searchModalRef.current &&
        !searchModalRef.current.contains(target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [megaMenuOpen, searchOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* ============ MIDDLE BAR: Logo + Search + Actions ============ */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="relative h-10 w-48 md:h-12 md:w-64">
                <Image
                  src="/images/sivtech_makina_horizontal.png"
                  alt={siteName}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-6 hidden md:flex">
              <button
                ref={searchButtonRef}
                className="relative w-full group"
                onClick={() => setSearchOpen(true)}
              >
                <div className="flex w-full items-center rounded-lg border border-gray-200 bg-gray-50 overflow-hidden hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                  <div className="pl-4 text-gray-400 flex items-center justify-center">
                    <MaterialIcon icon="search" />
                  </div>
                  <div className="w-full bg-transparent px-3 py-2.5 text-gray-400 text-sm text-left">
                    Ürün, stok kodu veya marka arayın...
                  </div>
                  <div className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 text-sm transition-colors whitespace-nowrap">
                    ARA
                  </div>
                </div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Mobile search */}
              <button
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors md:hidden"
                onClick={() => setSearchOpen(true)}
              >
                <MaterialIcon icon="search" />
              </button>

              {/* Teklif Al */}
              <Link
                href="/kurumsal"
                className="hidden lg:flex items-center justify-center px-5 py-2.5 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition-all shadow-md shadow-secondary/20 whitespace-nowrap text-sm"
              >
                <MaterialIcon icon="request_quote" className="text-[18px] mr-1.5" />
                Teklif Al
              </Link>

              {/* Sipariş Takibi */}
              <Link
                href="/siparis-takip"
                className="hidden md:flex flex-col items-center justify-center p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <MaterialIcon icon="local_shipping" className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium mt-0.5">Sipariş Takip</span>
              </Link>

              {/* Hesabım */}
              <AccountDropdown isLoggedIn={isLoggedIn} />

              {/* Sepetim */}
              <button
                onClick={() => setCartOpen(true)}
                className="flex flex-col items-center justify-center p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors group relative"
              >
                <div className="relative">
                  <MaterialIcon icon="shopping_cart" className="group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    2
                  </span>
                </div>
                <span className="text-[10px] font-medium mt-0.5 hidden sm:block">Sepetim</span>
              </button>

              {/* Mobile menu toggle */}
              <button
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors xl:hidden ml-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <MaterialIcon icon={mobileMenuOpen ? "close" : "menu"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ BOTTOM BAR: Navigation Links ============ */}
      <div className="hidden xl:block border-b border-gray-100 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1">

            {/* Left: Categories */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                ref={megaMenuButtonRef}
                className={`flex items-center gap-2 pr-4 border-r border-gray-100 py-3 text-sm font-bold transition-colors whitespace-nowrap ${megaMenuOpen
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"
                  }`}
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                onMouseEnter={() => {
                  setActiveMenuType("categories");
                  setMegaMenuOpen(true);
                }}
              >
                <MaterialIcon icon="grid_view" className="text-[20px]" />
                Kategoriler
                <MaterialIcon
                  icon="expand_more"
                  className={`text-[18px] transition-transform ${megaMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Center: Navigation Links */}
            <div className="flex-1 overflow-x-auto hide-scrollbar px-4" ref={navRef}>
              <nav className="flex items-center justify-center gap-6 w-full">
                {navLinks
                  .filter((link) => link.label !== "Teklif Al" && link.label !== "Sipariş Takip" && link.label !== "Kampanyalar")
                  .map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap text-gray-500 hover:text-primary"
                      onMouseEnter={() => {
                        if (link.hasMegaMenu) {
                          setActiveMenuType(link.menuType || "categories");
                          setMegaMenuOpen(true);
                        } else {
                          setMegaMenuOpen(false);
                        }
                      }}
                    >
                      {link.label}
                      {link.hasMegaMenu && <MaterialIcon icon="expand_more" className="text-[18px]" />}
                    </Link>
                  ))}
              </nav>
            </div>

            {/* Right: Kampanyalar Button */}
            <div className="shrink-0 pl-4">
              <Link
                href="/kampanyalar"
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-full hover:bg-red-100 transition-colors"
              >
                <MaterialIcon icon="local_offer" className="text-[18px]" />
                Kampanyalar
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Mega Menu (Desktop) */}
      <div ref={megaMenuRef}>
        {megaMenuOpen && <MegaMenu onClose={closeMegaMenu} menuType={activeMenuType} categories={categories} />}
      </div>

      {/* Search Modal */}
      <div ref={searchModalRef}>
        {searchOpen && <SearchModal onClose={closeSearch} />}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <MobileMenu onClose={closeMobileMenu} categories={categories} />}

      {/* Mini Cart Drawer */}
      <MiniCartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
