"use client";
import { useState } from "react";
import Link from "next/link";
import { documents } from "@/data/siteData";
import MaterialIcon from "@/components/ui/MaterialIcon";

const docCategories = ["Tümü", "Teknik Çizimler", "Kullanım Kılavuzları", "Kurulum Rehberleri", "CAD Dosyaları", "Yazılımlar"];

export default function DocumentCenterPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === "Tümü" || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#101622] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#101622] via-[#101622]/95 to-[#101622]/80" />
        <div className="relative max-w-[1440px] mx-auto px-6 py-16 lg:py-24 flex flex-col items-center justify-center text-center">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3">
            Teknik Destek Platformu
          </span>
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight mb-4 max-w-3xl font-[family-name:var(--font-display)]">
            Dosya ve Teknik Döküman Merkezi
          </h1>
          <p className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl font-light">
            Tüm teknik çizimler, kullanım kılavuzları, CAD dosyaları ve yazılımlar tek bir
            yerde. Projeniz için gerekli dökümanları saniyeler içinde bulun.
          </p>
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MaterialIcon icon="search" className="text-gray-500" />
            </div>
            <input
              className="block w-full pl-12 pr-32 py-4 rounded-xl border-0 ring-1 ring-gray-700 bg-white/10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:bg-white/15 transition-all shadow-lg backdrop-blur-sm"
              placeholder="Model, dosya adı veya kategori ara..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button className="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-2 px-6 rounded-lg transition-colors shadow-md">
                Ara
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-10">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-xs" />
          <span className="text-text-main font-bold">Dosya Merkezi</span>
        </nav>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {docCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all p-6 group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${doc.bgColor} ${doc.color} flex items-center justify-center shrink-0`}>
                  <MaterialIcon icon={doc.icon} className="text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-text-main group-hover:text-primary transition-colors mb-1 truncate font-[family-name:var(--font-display)]">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{doc.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="px-2 py-0.5 rounded bg-gray-100 font-mono font-bold">
                        {doc.fileType}
                      </span>
                      <span>{doc.fileSize}</span>
                    </div>
                    <button className="flex items-center gap-1 text-primary text-xs font-bold hover:underline">
                      <MaterialIcon icon="download" className="text-[16px]" />
                      İndir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-20">
            <MaterialIcon icon="folder_off" className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500">Arama kriterlerinize uygun döküman bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
