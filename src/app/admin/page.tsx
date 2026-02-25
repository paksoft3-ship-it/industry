export const dynamic = "force-dynamic";

import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import prisma from "@/lib/prisma";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  PENDING: "Ödeme Bekliyor",
  CONFIRMED: "Onaylandı",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("tr-TR").format(value);
}

export default async function AdminDashboard() {
  const [
    productCount,
    orderCount,
    customerCount,
    revenueResult,
    recentOrders,
    lowStockProducts,
    pendingOrderCount,
    topProducts,
    auditLogs,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true } } },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        stockCount: { lte: prisma.product.fields?.lowStockThreshold ? undefined : 5 },
      },
      orderBy: { stockCount: "asc" },
      take: 5,
      select: { id: true, name: true, sku: true, stockCount: true, lowStockThreshold: true },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true } } },
    }),
  ]);

  // Fetch product details for top products
  const topProductIds = topProducts.map((p) => p.productId);
  const topProductDetails = topProductIds.length > 0
    ? await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, sku: true },
    })
    : [];

  const topProductsWithDetails = topProducts.map((tp) => {
    const detail = topProductDetails.find((d) => d.id === tp.productId);
    return {
      ...detail,
      totalSold: tp._sum.quantity || 0,
    };
  });

  // Filter low stock products manually (compare stockCount <= lowStockThreshold)
  const actualLowStock = lowStockProducts.filter((p) => p.stockCount <= p.lowStockThreshold);

  const revenue = Number(revenueResult._sum.total ?? 0);

  const stats = [
    { label: "Toplam Ürün", value: formatNumber(productCount), icon: "inventory_2", color: "bg-blue-500" },
    { label: "Toplam Sipariş", value: formatNumber(orderCount), icon: "receipt_long", color: "bg-green-500" },
    { label: "Toplam Müşteri", value: formatNumber(customerCount), icon: "group", color: "bg-purple-500" },
    { label: "Gelir", value: formatCurrency(revenue), icon: "payments", color: "bg-orange-500" },
  ];

  const recentActivity = auditLogs.map((log) => ({
    id: log.id,
    user: log.user ? `${log.user.firstName} ${log.user.lastName}` : "Sistem",
    action: log.action,
    entity: log.entity,
    details: log.details,
    time: log.createdAt,
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 font-[family-name:var(--font-display)]">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <MaterialIcon icon={stat.icon} className="text-white text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800">
                Son Siparişler
              </h2>
              {pendingOrderCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  {pendingOrderCount} bekleyen
                </span>
              )}
            </div>
            <Link href="/admin/siparisler" className="text-sm text-primary hover:underline font-medium">
              Tümünü Gör
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sipariş</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Müşteri</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tarih</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tutar</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      Henüz sipariş bulunmuyor
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/siparisler/${order.id}`} className="font-medium text-primary hover:underline">
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{order.user.firstName} {order.user.lastName}</td>
                      <td className="px-6 py-4 text-gray-500">{order.createdAt.toLocaleDateString("tr-TR")}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{formatCurrency(Number(order.total))}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4 text-center">
            Son İşlemler
          </h2>
          <div className="relative space-y-4">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />
            {recentActivity.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-4">İşlem kaydı bulunmuyor</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="relative pl-10">
                  <div className="absolute left-[13px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-white" />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.user}: <span className="text-primary">{activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.details || activity.entity}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase">
                      {new Date(activity.time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href="/admin/audit-log"
            className="mt-6 block text-center text-xs font-semibold text-primary hover:underline border-t border-gray-50 pt-4"
          >
            Tüm Kayıtları Gör
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4 ">
            Hızlı İşlemler
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/urunler/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <MaterialIcon icon="add_box" className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Yeni Ürün Ekle</p>
                <p className="text-xs text-gray-500">Ürün kataloğuna ekle</p>
              </div>
            </Link>
            <Link
              href="/admin/siparisler"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <MaterialIcon icon="local_shipping" className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Siparişleri Yönet</p>
                <p className="text-xs text-gray-500">Bekleyen siparişler</p>
              </div>
            </Link>
            <Link
              href="/admin/kampanyalar"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <MaterialIcon icon="campaign" className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Kampanya Oluştur</p>
                <p className="text-xs text-gray-500">İndirim ve kuponlar</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
