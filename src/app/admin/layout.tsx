"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/lib/actions/auth";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";

const navSections = [
  {
    title: "Ana Menü",
    items: [
      { label: "Dashboard", icon: "dashboard", href: "/admin" },
      { label: "Siparişler", icon: "receipt_long", href: "/admin/siparisler" },
      { label: "Müşteriler", icon: "group", href: "/admin/musteriler" },
    ]
  },
  {
    title: "Katalog",
    items: [
      { label: "Ürünler", icon: "inventory_2", href: "/admin/urunler" },
      { label: "Kategoriler", icon: "category", href: "/admin/kategoriler" },
      { label: "Markalar", icon: "branding_watermark", href: "/admin/markalar" },
      { label: "Kombinler", icon: "package_2", href: "/admin/kombinler" },
    ]
  },
  {
    title: "Eğitim / Blog",
    items: [
      { label: "Eğitim Kategorileri", icon: "school", href: "/admin/egitim/kategoriler" },
      { label: "Eğitim Yazıları", icon: "article", href: "/admin/egitim/yazilar" },
      { label: "Blog Kategorileri", icon: "category", href: "/admin/blog/kategoriler" },
      { label: "Blog Yazıları", icon: "edit_note", href: "/admin/blog/yazilar" },
    ]
  },
  {
    title: "İçerik",
    items: [
      { label: "Dosya Merkezi", icon: "folder_open", href: "/admin/dosya-merkezi" },
      { label: "Sayfalar", icon: "article", href: "/admin/sayfalar" },
      { label: "Kampanyalar", icon: "local_offer", href: "/admin/kampanyalar" },
    ]
  },
  {
    title: "Sistem",
    items: [
      { label: "Ayarlar", icon: "settings", href: "/admin/ayarlar" },
      { label: "Kullanıcılar", icon: "manage_accounts", href: "/admin/kullanicilar" },
      { label: "Audit Log", icon: "history", href: "/admin/audit-log" },
    ]
  }
];

const ADMIN_AUTH_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth pages render standalone — no sidebar
  if (ADMIN_AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return <>{children}</>;
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const [sessionUser, setSessionUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) setSessionUser({ name: data.user.name, email: data.user.email });
      })
      .catch(() => { });
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 flex-shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <MaterialIcon icon="precision_manufacturing" className="text-primary text-2xl" />
          <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <MaterialIcon icon={item.icon} className="text-[20px]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <MaterialIcon icon="person" className="text-primary text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{sessionUser?.name || "Admin"}</p>
            <p className="text-xs text-gray-500 truncate">{sessionUser?.email || ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-gray-500 hover:text-white transition-colors" title="Siteye Git">
              <MaterialIcon icon="open_in_new" className="text-lg" />
            </Link>
            <button
              onClick={async () => { await logoutUser(); router.push("/admin/login"); router.refresh(); }}
              className="text-gray-500 hover:text-red-400 transition-colors"
              title="Çıkış Yap"
            >
              <MaterialIcon icon="logout" className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop: always visible, mobile: slide in */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 bg-[#0d121c] text-white flex flex-col transform transition-transform duration-200
          md:relative md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <MaterialIcon icon={sidebarOpen ? "close" : "menu"} className="text-xl" />
            </button>
            <h1 className="font-[family-name:var(--font-display)] text-base sm:text-lg font-semibold text-gray-800 truncate">
              {navSections.flatMap(s => s.items).find((item) => isActive(item.href))?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
              <MaterialIcon icon="notifications" className="text-xl" />
            </button>
            <div className="w-px h-8 bg-gray-200 hidden sm:block" />
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <MaterialIcon icon="person" className="text-gray-500 text-lg" />
              </div>
              <span className="font-medium hidden sm:inline">{sessionUser?.name?.split(" ")[0] || "Admin"}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
