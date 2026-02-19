"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { products, searchPopularTerms } from "@/data/siteData";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface SearchModalProps {
  onClose: () => void;
}

const searchTabs = ["Ürünler", "Kategoriler", "Markalar"];

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Ürünler");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const filteredProducts = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-start justify-center pt-20 px-4">
        <div className="w-full max-w-[1024px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          {/* Search Header */}
          <div className="p-6 pb-2 border-b border-gray-200">
            <div className="relative flex items-center w-full">
              <MaterialIcon icon="search" className="absolute left-4 text-primary" />
              <input
                ref={inputRef}
                className="w-full h-14 pl-12 pr-12 rounded-lg bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white focus:ring-0 text-lg text-gray-900 placeholder:text-gray-400 transition-all font-medium outline-none"
                placeholder="Ürün, kategori veya marka arayın..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setQuery("")}
                >
                  <MaterialIcon icon="close" />
                </button>
              )}
            </div>
            {/* Tabs */}
            <div className="flex gap-8 mt-6 overflow-x-auto">
              {searchTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 text-sm font-bold border-b-[3px] transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "text-primary border-primary"
                      : "text-gray-500 hover:text-gray-800 border-transparent"
                  }`}
                >
                  {tab}
                  {tab === "Ürünler" && (
                    <span className="ml-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {filteredProducts.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content: Split View */}
          <div className="flex flex-1 overflow-hidden min-h-[400px]">
            {/* Left: Results */}
            <div className="flex-1 overflow-y-auto bg-white p-2">
              <div className="flex flex-col gap-1 p-2">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/urunler/${product.slug}`}
                    onClick={onClose}
                    className="group flex items-start gap-4 p-3 rounded-lg hover:bg-blue-50/50 cursor-pointer border border-transparent hover:border-primary/20 transition-all"
                  >
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-gray-900 truncate pr-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <span className="shrink-0 text-sm font-bold text-primary">
                          {product.currency}
                          {product.price.toLocaleString("tr-TR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${
                            product.inStock
                              ? "text-green-600 bg-green-50"
                              : "text-red-600 bg-red-50"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.inStock ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {product.inStock ? "Stokta" : "Tükendi"}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 truncate">
                          {product.categoryLabel}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {/* View All Button */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur pt-2 pb-4 px-4 border-t border-gray-200 mt-2">
                <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all shadow-sm group">
                  Tüm Sonuçları Gör ({filteredProducts.length})
                  <MaterialIcon
                    icon="arrow_forward"
                    className="text-sm group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Right: Suggestions */}
            <div className="hidden md:flex w-72 flex-col border-l border-gray-200 bg-gray-50 p-6">
              {/* Recent Searches */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Son Aramalar
                  </h4>
                  <button className="text-xs text-primary hover:underline">Temizle</button>
                </div>
                <ul className="space-y-1">
                  {["Step Motor Sürücü", "Spindle"].map((term) => (
                    <li key={term}>
                      <button
                        className="flex items-center justify-between w-full px-2 py-2 text-sm text-gray-700 hover:bg-black/5 rounded group"
                        onClick={() => setQuery(term)}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <MaterialIcon icon="history" className="text-gray-400 text-lg" />
                          <span>{term}</span>
                        </div>
                        <MaterialIcon
                          icon="close"
                          className="opacity-0 group-hover:opacity-100 text-gray-400 text-sm"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Searches */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Popüler Aramalar
                </h4>
                <div className="flex flex-wrap gap-2">
                  {searchPopularTerms.map((term) => (
                    <button
                      key={term}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors"
                      onClick={() => setQuery(term)}
                    >
                      <MaterialIcon icon="trending_up" className="text-base" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="mt-auto pt-8">
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                  <p className="text-xs text-primary font-medium flex gap-2 items-center">
                    <MaterialIcon icon="support_agent" className="text-lg" />
                    Teknik destek mi lazım?
                  </p>
                  <Link
                    href="/iletisim"
                    className="text-xs text-gray-600 mt-1 block hover:underline ml-7"
                    onClick={onClose}
                  >
                    Satış mühendisimize danışın
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer: Keyboard Shortcuts */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white text-[10px] font-medium shadow-sm">
                  <span className="text-primary font-bold">↑↓</span>
                </kbd>
                Gezin
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white text-[10px] font-medium shadow-sm">
                  ENTER
                </kbd>
                Seç
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white text-[10px] font-medium shadow-sm">
                  ESC
                </kbd>
                Kapat
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
