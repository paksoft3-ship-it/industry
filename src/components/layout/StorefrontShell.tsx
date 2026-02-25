import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UtilityBar from "@/components/layout/UtilityBar";
import type { MegaMenuCategory } from "@/lib/types/menu";

export default function StorefrontShell({
  children,
  categories,
  educationCategories = [],
  blogCategories = [],
}: {
  children: React.ReactNode;
  categories: MegaMenuCategory[];
  educationCategories?: any[];
  blogCategories?: any[];
}) {
  return (
    <>
      <UtilityBar />
      <Header
        categories={categories}
        educationCategories={educationCategories}
        blogCategories={blogCategories}
      />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
