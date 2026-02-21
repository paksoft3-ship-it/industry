import { getAllCategories } from "@/lib/actions/categories";
import { getBrands } from "@/lib/actions/brands";
import ProductForm from "../[id]/ProductForm";

export default async function AdminNewProductPage() {
  const [categories, brands] = await Promise.all([
    getAllCategories(),
    getBrands({ includeInactive: true }),
  ]);

  return (
    <ProductForm
      product={null}
      categories={JSON.parse(JSON.stringify(categories))}
      brands={JSON.parse(JSON.stringify(brands))}
    />
  );
}
