import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UtilityBar from "@/components/layout/UtilityBar";
import type { MegaMenuCategory } from "@/lib/types/menu";

export default function StorefrontShell({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: MegaMenuCategory[];
}) {
  return (
    <>
      <UtilityBar />
      <Header categories={categories} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
