import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/products";
import { getAllCategories } from "@/lib/actions/categories";
import { getBrands } from "@/lib/actions/brands";
import ProductForm from "./ProductForm";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    getProductById(id),
    getAllCategories(),
    getBrands({ includeInactive: true }),
  ]);

  if (!product) notFound();

  return (
    <ProductForm
      product={JSON.parse(JSON.stringify(product))}
      categories={JSON.parse(JSON.stringify(categories))}
      brands={JSON.parse(JSON.stringify(brands))}
    />
  );
}
