import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UtilityBar from "@/components/layout/UtilityBar";
import { CartProvider } from "@/context/CartContext";
import { auth } from "@/lib/auth";
import type { MegaMenuCategory } from "@/lib/types/menu";

export default async function StorefrontShell({
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
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userName = session?.user?.name ?? "";

  return (
    <CartProvider>
      <UtilityBar />
      <Header
        categories={categories}
        educationCategories={educationCategories}
        blogCategories={blogCategories}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />
      <main className="flex-grow">{children}</main>
      <Footer />
    </CartProvider>
  );
}
