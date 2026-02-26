import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import AddToCartButton from "@/components/products/AddToCartButton";

interface Product {
  id: string;
  slug: string;
  name: string;
  categoryLabel: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  badge?: string | null;
  badgeColor?: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  specs: string[];
  images: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const badgeColorMap: Record<string, string> = {
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-500 text-white",
    green: "bg-green-100 text-green-700",
  };

  const discountPercent =
    product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="min-w-[280px] md:min-w-[300px] bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
      <Link href={`/urun/${product.slug}`} className="relative h-60 bg-gray-50 flex items-center justify-center p-6">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={240}
          height={200}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <div
            className={`absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded ${
              badgeColorMap[product.badgeColor || "blue"]
            }`}
          >
            {product.badge}
          </div>
        )}
        {discountPercent && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </div>
        )}
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
          <MaterialIcon icon="favorite" className="text-[20px]" />
        </button>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-gray-400 font-medium mb-1">
          {product.categoryLabel}
        </div>
        <Link href={`/urun/${product.slug}`}>
          <h3 className="font-bold text-lg text-text-main leading-tight mb-2 group-hover:text-primary transition-colors font-[family-name:var(--font-display)]">
            {product.name}
          </h3>
        </Link>
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <MaterialIcon
              key={i}
              icon={i < Math.floor(product.rating) ? "star" : i < product.rating ? "star_half" : "star"}
              className={`text-[16px] ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
        </div>
        {/* Specs */}
        <ul className="text-xs text-gray-500 space-y-1 mb-4">
          {product.specs.map((spec) => (
            <li key={spec} className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              {spec}
            </li>
          ))}
        </ul>
        {/* Price & Cart */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            {product.originalPrice && (
              <p className="text-xs text-gray-400 line-through">
                {product.originalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {product.currency}
              </p>
            )}
            <p className="text-xl font-black text-primary">
              {product.price.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {product.currency}
            </p>
          </div>
          <AddToCartButton productId={product.id} inStock={product.inStock} />
        </div>
        {/* Stock Status */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className={`size-2 rounded-full ${product.inStock ? (product.stockCount <= 5 ? "bg-orange-400" : "bg-green-500") : "bg-red-500"}`} />
          <span className={`text-xs font-medium ${product.inStock ? (product.stockCount <= 5 ? "text-orange-500" : "text-green-600") : "text-red-500"}`}>
            {product.inStock
              ? product.stockCount <= 5
                ? `Son ${product.stockCount} Ürün`
                : "Stokta Var"
              : "Tükendi"}
          </span>
        </div>
      </div>
    </div>
  );
}
