import Link from "next/link";
import { redirect } from "next/navigation";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { auth } from "@/lib/auth";
import { getUserOrders } from "@/lib/actions/orders";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "Ödeme Bekliyor",
  CONFIRMED: "Onaylandı",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
};

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-700 bg-yellow-50",
  CONFIRMED: "text-blue-700 bg-blue-50",
  PROCESSING: "text-blue-700 bg-blue-50",
  SHIPPED: "text-indigo-700 bg-indigo-50",
  DELIVERED: "text-green-600 bg-green-50",
  CANCELLED: "text-red-600 bg-red-50",
  REFUNDED: "text-gray-600 bg-gray-50",
};

export default async function SiparislerPage() {
  const session = await auth();
  if (!session?.user) redirect("/uye-girisi-sayfasi?callbackUrl=/hesap/siparisler");

  const orders = await getUserOrders();

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <Link href="/hesap" className="hover:text-primary">Hesabım</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Siparişlerim</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8">
          Siparişlerim
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
            <MaterialIcon icon="receipt_long" className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Henüz siparişiniz bulunmuyor.</p>
            <Link
              href="/arama"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            {/* Desktop Table */}
            <table className="w-full text-sm hidden md:table">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left p-4 font-medium text-gray-400">Sipariş No</th>
                  <th className="text-left p-4 font-medium text-gray-400">Tarih</th>
                  <th className="text-left p-4 font-medium text-gray-400">Ürün Sayısı</th>
                  <th className="text-left p-4 font-medium text-gray-400">Durum</th>
                  <th className="text-right p-4 font-medium text-gray-400">Tutar</th>
                  <th className="text-right p-4 font-medium text-gray-400">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 font-medium text-primary">{order.orderNumber}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                    </td>
                    <td className="p-4 text-gray-500">{order.items.length} ürün</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "text-gray-600 bg-gray-50"}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-primary">
                      {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(order.total))}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/siparis-takip?no=${order.orderNumber}`}
                        className="text-primary hover:text-primary/70 transition-colors"
                        title="Detay"
                      >
                        <MaterialIcon icon="visibility" className="text-xl" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {orders.map((order) => (
                <div key={order.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-primary text-sm">{order.orderNumber}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "text-gray-600 bg-gray-50"}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")} — {order.items.length} ürün
                    </span>
                    <span className="font-medium text-primary">
                      {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(order.total))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
