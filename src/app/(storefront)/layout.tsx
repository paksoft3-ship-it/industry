import StorefrontShell from "@/components/layout/StorefrontShell";
import { getCategoryTree } from "@/lib/actions/categories";
import type { MegaMenuCategory } from "@/lib/types/menu";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: MegaMenuCategory[] = [];
  try {
    const rawCategories = await getCategoryTree();
    categories = rawCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    image: cat.image,
    children: cat.children.map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
      icon: child.icon,
      image: child.image,
      children: child.children.map((grandchild) => ({
        id: grandchild.id,
        name: grandchild.name,
        slug: grandchild.slug,
      })),
    })),
  }));
  } catch {
    // DB unavailable (e.g. during build) — fall back to empty categories
  }

  return <StorefrontShell categories={categories}>{children}</StorefrontShell>;
}
