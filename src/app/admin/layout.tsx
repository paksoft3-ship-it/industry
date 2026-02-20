"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MaterialIcon from "@/components/ui/MaterialIcon";

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "Ürünler", icon: "inventory_2", href: "/admin/urunler" },
  { label: "Kategoriler", icon: "category", href: "/admin/kategoriler" },
  { label: "Markalar", icon: "branding_watermark", href: "/admin/markalar" },
  { label: "Kombinler", icon: "package_2", href: "/admin/kombinler" },
  { label: "Siparişler", icon: "receipt_long", href: "/admin/siparisler" },
  { label: "Müşteriler", icon: "group", href: "/admin/musteriler" },
  { label: "Eğitim/Blog", icon: "school", href: "/admin/egitim" },
  { label: "Dosya Merkezi", icon: "folder_open", href: "/admin/dosya-merkezi" },
  { label: "Sayfalar", icon: "article", href: "/admin/sayfalar" },
  { label: "Kampanyalar", icon: "local_offer", href: "/admin/kampanyalar" },
  { label: "Ayarlar", icon: "settings", href: "/admin/ayarlar" },
  { label: "Kullanıcılar", icon: "manage_accounts", href: "/admin/kullanicilar" },
  { label: "Audit Log", icon: "history", href: "/admin/audit-log" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#0d121c] text-white flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <MaterialIcon icon="precision_manufacturing" className="text-primary text-2xl" />
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <MaterialIcon icon={item.icon} className="text-[20px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <MaterialIcon icon="person" className="text-primary text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@example.com</p>
            </div>
            <Link href="/" className="text-gray-500 hover:text-white transition-colors" title="Siteye Git">
              <MaterialIcon icon="open_in_new" className="text-lg" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800">
              {navItems.find((item) => isActive(item.href))?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
              <MaterialIcon icon="notifications" className="text-xl" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-px h-8 bg-gray-200" />
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <MaterialIcon icon="person" className="text-gray-500 text-lg" />
              </div>
              <span className="font-medium">Admin</span>
              <MaterialIcon icon="expand_more" className="text-lg" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
