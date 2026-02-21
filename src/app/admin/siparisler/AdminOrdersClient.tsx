"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  _count: { items: number };
};

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

const paymentLabels: Record<string, string> = {
  PENDING: "Bekliyor",
  PAID: "Ödendi",
  FAILED: "Başarısız",
  REFUNDED: "İade",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);
}

export default function AdminOrdersClient({
  orders,
  total,
  totalPages,
  currentPage,
  statusCounts,
  filters,
}: {
  orders: Order[];
  total: number;
  totalPages: number;
  currentPage: number;
  statusCounts: Record<string, number>;
  filters: { search: string; status: string };
}) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.search);

  const allCount = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  const statusTabs = [
    { label: "Tümü", value: "", count: allCount },
    { label: "Bekleyen", value: "PENDING", count: statusCounts.PENDING || 0 },
    { label: "Hazırlanıyor", value: "PROCESSING", count: statusCounts.PROCESSING || 0 },
    { label: "Kargoda", value: "SHIPPED", count: statusCounts.SHIPPED || 0 },
    { label: "Teslim Edildi", value: "DELIVERED", count: statusCounts.DELIVERED || 0 },
  ];

  function updateFilters(updates: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = { ...filters, ...updates };
    if (merged.search) params.set("search", merged.search);
    if (merged.status) params.set("status", merged.status);
    if (updates.page) params.set("page", updates.page);
    router.push(`/admin/siparisler?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilters({ search });
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Siparişler</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam {total} sipariş</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => updateFilters({ status: tab.value, page: "" })}
            className={`p-3 rounded-xl text-center transition-colors ${
              filters.status === tab.value
                ? "bg-primary text-white shadow-sm"
                : "bg-white border border-gray-100 text-gray-600 hover:border-primary/30"
            }`}
          >
            <p className={`text-xl font-bold ${filters.status === tab.value ? "" : "text-gray-800"}`}>{tab.count}</p>
            <p className={`text-xs mt-0.5 ${filters.status === tab.value ? "text-white/80" : "text-gray-500"}`}>{tab.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 min-w-[240px] relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sipariş no veya müşteri adı ile ara..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </form>
          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value, page: "" })}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Tüm Durumlar</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sipariş No</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Müşteri</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="text-center px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tutar</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ödeme</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">Sipariş bulunamadı</td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/siparisler/${order.id}`} className="font-medium text-primary hover:underline">
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{order.user.firstName} {order.user.lastName}</p>
                      <p className="text-xs text-gray-500">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{order._count.items}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-800">
                    {formatCurrency(Number(order.total))}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs ${
                      order.paymentStatus === "PAID" ? "text-green-600" : "text-gray-500"
                    }`}>
                      {paymentLabels[order.paymentStatus] || order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/siparisler/${order.id}`}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors inline-flex"
                      title="Detay"
                    >
                      <MaterialIcon icon="visibility" className="text-lg" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, total)} / {total} sipariş
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateFilters({ page: String(currentPage - 1) })}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Önceki
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateFilters({ page: String(pageNum) })}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      pageNum === currentPage ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => updateFilters({ page: String(currentPage + 1) })}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
