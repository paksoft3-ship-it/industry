import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/actions/products";
import ProductDetailClient from "@/components/products/ProductDetailClient";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  const categoryEntry = product.categories?.[0]?.category;

  const productData = {
    name: product.name,
    slug: product.slug,
    category: categoryEntry?.slug || "",
    categoryLabel: categoryEntry?.name || "",
    price: Number(product.price),
    originalPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    inStock: product.inStock,
    stockCount: product.stockCount,
    rating: 0,
    reviewCount: 0,
    sku: product.sku || "",
    images: product.images.map((i) => i.url),
    description: product.description || "",
    specs: product.attributes.slice(0, 5).map((a) => `${a.key}: ${a.value}`),
    technicalSpecs: Object.fromEntries(product.attributes.map((a) => [a.key, a.value])),
    badge: null as string | null,
  };

  return <ProductDetailClient product={productData} />;
}
