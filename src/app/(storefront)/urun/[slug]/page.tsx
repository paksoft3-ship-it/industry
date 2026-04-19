import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/actions/products";
import ProductDetailClient from "@/components/products/ProductDetailClient";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.name,
    description: product.seoDesc || product.shortDesc || undefined,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  const categoryEntry = product.categories?.[0]?.category;

  const productData = {
    id: product.id,
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
    shortDescription: product.shortDesc || "",
    specs: product.attributes.map((a) => ({ key: a.key, value: a.value })),
    technicalSpecs: Object.fromEntries(product.attributes.map((a) => [a.key, a.value])),
    badge: null as string | null,
    downloads: product.downloads.map((d) => ({
      id: d.id,
      title: d.title,
      fileUrl: d.fileUrl,
      fileType: d.fileType,
      fileSize: d.fileSize || null,
    })),
  };

  return <ProductDetailClient product={productData} />;
}
