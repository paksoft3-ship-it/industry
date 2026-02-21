"use client";

import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderDate: string | null;
  _count: { orders: number; reviews: number; wishlist: number };
  orders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    _count: { items: number };
  }[];
  addresses: {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    district: string;
    address: string;
    postalCode: string | null;
    isDefault: boolean;
  }[];
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(value);
}

export default function CustomerDetailClient({ customer }: { customer: Customer }) {
  const initials = `${customer.firstName[0] || ""}${customer.lastName[0] || ""}`.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/musteriler"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MaterialIcon icon="arrow_back" className="text-xl" />
          </Link>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Müşteri Detayı</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {customer.firstName} {customer.lastName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800">
                Sipariş Geçmişi
              </h2>
              <span className="text-sm text-gray-500">{customer._count.orders} sipariş</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sipariş No</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tutar</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customer.orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Henüz sipariş yok</td>
                    </tr>
                  ) : (
                    customer.orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <Link href={`/admin/siparisler/${order.id}`} className="font-medium text-primary hover:underline">
                            #{order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-3.5 text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                        </td>
                        <td className="px-6 py-3.5 text-center text-gray-600">{order._count.items}</td>
                        <td className="px-6 py-3.5 text-right font-medium text-gray-800">
                          {formatCurrency(Number(order.total))}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <Link href={`/admin/siparisler/${order.id}`} className="text-gray-400 hover:text-primary transition-colors">
                            <MaterialIcon icon="open_in_new" className="text-lg" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Kayıtlı Adresler
            </h2>
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">Kayıtlı adres yok</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.addresses.map((addr) => (
                  <div key={addr.id} className="border border-gray-100 rounded-xl p-4 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-primary">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">Varsayılan</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-800">{addr.firstName} {addr.lastName}</p>
                      <p>{addr.address}</p>
                      <p>{addr.district} / {addr.city}{addr.postalCode ? `, ${addr.postalCode}` : ""}</p>
                      <p className="text-gray-500">{addr.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl font-bold">{initials}</span>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-gray-800">
              {customer.firstName} {customer.lastName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
              {customer.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MaterialIcon icon="phone" className="text-gray-400 text-lg" />
                  <span>{customer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MaterialIcon icon="calendar_today" className="text-gray-400 text-lg" />
                <span>Kayıt: {new Date(customer.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-gray-800 mb-4">İstatistikler</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <MaterialIcon icon="shopping_bag" className="text-blue-600 text-sm" />
                  </div>
                  <span className="text-sm text-gray-600">Toplam Sipariş</span>
                </div>
                <span className="font-bold text-gray-800">{customer._count.orders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <MaterialIcon icon="payments" className="text-green-600 text-sm" />
                  </div>
                  <span className="text-sm text-gray-600">Toplam Harcama</span>
                </div>
                <span className="font-bold text-gray-800">{formatCurrency(customer.totalSpent)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <MaterialIcon icon="trending_up" className="text-purple-600 text-sm" />
                  </div>
                  <span className="text-sm text-gray-600">Ort. Sipariş</span>
                </div>
                <span className="font-bold text-gray-800">{formatCurrency(customer.avgOrderValue)}</span>
              </div>
              {customer.lastOrderDate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                      <MaterialIcon icon="schedule" className="text-orange-600 text-sm" />
                    </div>
                    <span className="text-sm text-gray-600">Son Sipariş</span>
                  </div>
                  <span className="font-bold text-gray-800">
                    {new Date(customer.lastOrderDate).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                    <MaterialIcon icon="star" className="text-pink-600 text-sm" />
                  </div>
                  <span className="text-sm text-gray-600">Değerlendirme</span>
                </div>
                <span className="font-bold text-gray-800">{customer._count.reviews}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
