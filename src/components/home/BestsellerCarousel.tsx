"use client";
import { useRef } from "react";
import ProductCard from "@/components/products/ProductCard";
import MaterialIcon from "@/components/ui/MaterialIcon";

const products: Array<{
  id: string; slug: string; name: string; category: string; categoryLabel: string;
  price: number; originalPrice: number | null; currency: string; badge: string | null;
  inStock: boolean; stockCount: number; rating: number; reviewCount: number; sku: string;
  images: string[]; specs: string[];
}> = [];

export default function BestsellerCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-main font-[family-name:var(--font-display)]">
            Çok Satan Ürünler
          </h2>
          <p className="text-gray-500 mt-2">
            Müşterilerimizin en çok tercih ettiği ürünler
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <MaterialIcon icon="arrow_back" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors bg-white shadow-sm"
          >
            <MaterialIcon icon="arrow_forward" />
          </button>
        </div>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-20">
          <MaterialIcon icon="inventory_2" className="text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500">Çok satan ürünler yakında eklenecektir.</p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar"
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
