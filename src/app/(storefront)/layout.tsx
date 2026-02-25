import StorefrontShell from "@/components/layout/StorefrontShell";
import { getCategoryTree } from "@/lib/actions/categories";
import { getEducationBlogMegaMenuData } from "@/lib/actions/blog";
import type { MegaMenuCategory } from "@/lib/types/menu";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: MegaMenuCategory[] = [];
  let educationCategories: any[] = [];
  let blogCategories: any[] = [];

  try {
    const [rawCategories, { educationCategories: rawEdu, blogCategories: rawBlog }] = await Promise.all([
      getCategoryTree(),
      getEducationBlogMegaMenuData(),
    ]);

    categories = rawCategories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      image: cat.image,
      children: cat.children.map((child: any) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        icon: child.icon,
        image: child.image,
        children: child.children.map((grandchild: any) => ({
          id: grandchild.id,
          name: grandchild.name,
          slug: grandchild.slug,
        })),
      })),
    }));

    educationCategories = JSON.parse(JSON.stringify(rawEdu));
    blogCategories = JSON.parse(JSON.stringify(rawBlog));
    console.log(`[Layout] Successfully fetched categories. Count: ${categories.length}`);
  } catch (error) {
    console.error("[Layout] Error fetching navigation data:", error);
    // DB unavailable (e.g. during build) — fall back to empty categories
  }

  return (
    <StorefrontShell
      categories={categories}
      educationCategories={educationCategories}
      blogCategories={blogCategories}
    >
      {children}
    </StorefrontShell>
  );
}
