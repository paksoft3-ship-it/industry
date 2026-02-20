"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Arama</span>
        </nav>

        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <MaterialIcon
            icon="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl"
          />
          <input
            type="text"
            defaultValue={query}
            placeholder="Ürün, marka veya kategori ara..."
            className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 bg-white text-primary text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Results Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-6">
          {query
            ? <>&ldquo;{query}&rdquo; için arama sonuçları</>
            : "Arama sonuçları"
          }
        </h1>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-primary hover:border-primary">
            <MaterialIcon icon="tune" className="text-base" />
            Filtrele
          </button>
          <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-primary hover:border-primary">
            <MaterialIcon icon="sort" className="text-base" />
            Sırala
          </button>
        </div>

        {/* Results Grid Placeholder */}
        {query ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <MaterialIcon icon="image" className="text-4xl text-gray-300" />
                </div>
                <div className="p-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
                  <div className="h-5 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <MaterialIcon icon="search" className="text-6xl mb-4" />
            <p className="text-lg">Aramak istediğiniz kelimeyi yazın</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AramaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-light" />}>
      <SearchContent />
    </Suspense>
  );
}
