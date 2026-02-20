"use client";
import { useState } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface FileItem {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: string | null;
  icon: string | null;
}

export default function DosyaMerkeziContent({ files }: { files: FileItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const categories = ["Tümü", ...Array.from(new Set(files.map((f) => f.category)))];

  const filtered = files.filter((f) => {
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Tümü" || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const fileColorMap: Record<string, { text: string; bg: string }> = {
    PDF: { text: "text-red-500", bg: "bg-red-50" },
    STEP: { text: "text-blue-500", bg: "bg-blue-50" },
    DWG: { text: "text-green-500", bg: "bg-green-50" },
    ZIP: { text: "text-amber-500", bg: "bg-amber-50" },
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d121c] text-white py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-display)]">
            Dosya Merkezi
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Teknik çizimler, kullanım kılavuzları, CAD dosyaları ve yazılımlar.
          </p>
          <div className="max-w-xl mx-auto">
            <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
              <MaterialIcon icon="search" className="text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Dosya adı ile arayın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-400 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-[14px]" />
          <span className="text-gray-900 font-medium">Dosya Merkezi</span>
        </nav>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((file) => {
            const colors = fileColorMap[file.fileType] || { text: "text-gray-500", bg: "bg-gray-50" };
            return (
              <div
                key={file.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center flex-shrink-0`}>
                    <MaterialIcon icon={file.icon || "description"} className="text-[28px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1 truncate group-hover:text-primary transition-colors">
                      {file.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">{file.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className={`font-bold ${colors.text}`}>{file.fileType}</span>
                        {file.fileSize && <span>{file.fileSize}</span>}
                      </div>
                      <a
                        href={file.fileUrl}
                        className="flex items-center gap-1 text-primary text-sm font-medium hover:underline"
                      >
                        <MaterialIcon icon="download" className="text-[18px]" />
                        İndir
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <MaterialIcon icon="folder_off" className="text-5xl mb-3" />
            <p>Aramanıza uygun dosya bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
