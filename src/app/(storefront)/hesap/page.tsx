import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HesapPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [user, recentOrders] = await Promise.all([
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
          select: { firstName: true, lastName: true, email: true, phone: true },
        })
      : null,
    userId
      ? prisma.order.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            orderNumber: true,
            status: true,
            total: true,
            currency: true,
            createdAt: true,
          },
        })
      : [],
  ]);

  const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING:    { label: "Beklemede",      color: "text-yellow-600 bg-yellow-50" },
    CONFIRMED:  { label: "Onaylandı",      color: "text-blue-600 bg-blue-50" },
    PROCESSING: { label: "Hazırlanıyor",   color: "text-indigo-600 bg-indigo-50" },
    SHIPPED:    { label: "Kargoda",        color: "text-blue-600 bg-blue-50" },
    DELIVERED:  { label: "Teslim Edildi",  color: "text-green-600 bg-green-50" },
    CANCELLED:  { label: "İptal Edildi",   color: "text-red-600 bg-red-50" },
    REFUNDED:   { label: "İade Edildi",    color: "text-gray-600 bg-gray-50" },
  };

  const sections = [
    { title: "Siparişlerim",     description: "Sipariş geçmişinizi görüntüleyin",  icon: "shopping_bag",  href: "/hesap/siparisler" },
    { title: "Adreslerim",       description: "Teslimat adreslerinizi yönetin",    icon: "location_on",   href: "/hesap/adresler" },
    { title: "Favorilerim",      description: "Beğendiğiniz ürünleri görün",       icon: "favorite",      href: "/favoriler" },
    { title: "Hesap Bilgilerim", description: "Kişisel bilgilerinizi düzenleyin",  icon: "person",        href: "/hesap/bilgilerim" },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Hesabım</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MaterialIcon icon="person" className="text-3xl text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)]">
              Hesabım
            </h1>
            <p className="text-gray-500 text-sm">
              Hoş geldiniz, <span className="font-medium text-primary">{user ? `${user.firstName} ${user.lastName}` : "Değerli Müşterimiz"}</span>!
            </p>
            {user?.email && (
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            )}
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <MaterialIcon icon={section.icon} className="text-2xl text-primary" />
              </div>
              <h2 className="font-semibold text-primary mb-1">{section.title}</h2>
              <p className="text-sm text-gray-400">{section.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary mb-4">Son Siparişler</h2>
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <MaterialIcon icon="shopping_bag" className="text-4xl mb-2" />
                <p className="text-sm">Henüz siparişiniz bulunmuyor.</p>
                <Link href="/kategori/tumu" className="mt-3 inline-block text-sm text-primary hover:underline">
                  Ürünleri keşfedin
                </Link>
              </div>
            ) : (
              <div>
                {/* Desktop table */}
                <table className="w-full text-sm hidden sm:table">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left p-4 font-medium text-gray-400">Sipariş No</th>
                      <th className="text-left p-4 font-medium text-gray-400">Tarih</th>
                      <th className="text-left p-4 font-medium text-gray-400">Durum</th>
                      <th className="text-right p-4 font-medium text-gray-400">Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const st = statusLabels[order.status] ?? { label: order.status, color: "text-gray-600 bg-gray-50" };
                      return (
                        <tr key={order.orderNumber} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4 font-medium text-primary">{order.orderNumber}</td>
                          <td className="p-4 text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${st.color}`}>
                              {st.label}
                            </span>
                          </td>
                          <td className="p-4 text-right font-medium text-primary">
                            {Number(order.total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {order.currency}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-gray-50">
                  {recentOrders.map((order) => {
                    const st = statusLabels[order.status] ?? { label: order.status, color: "text-gray-600 bg-gray-50" };
                    return (
                      <div key={order.orderNumber} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-primary text-sm">{order.orderNumber}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                          <span className="font-semibold text-primary text-sm">
                            {Number(order.total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {order.currency}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
