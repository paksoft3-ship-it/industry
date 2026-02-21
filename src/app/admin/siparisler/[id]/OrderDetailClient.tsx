"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { updateOrderStatus, updateOrderTracking, addOrderNote } from "@/lib/actions/orders";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponCode: string | null;
  notes: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  createdAt: string;
  items: {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    total: number;
    product: { images: { url: string }[] };
  }[];
  address: {
    title: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    district: string;
    address: string;
    postalCode: string | null;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    _count: { orders: number };
  };
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

const statusPipeline = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
const statusIcons: Record<string, string> = {
  PENDING: "hourglass_empty",
  CONFIRMED: "check_circle",
  PROCESSING: "inventory",
  SHIPPED: "local_shipping",
  DELIVERED: "done_all",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);
}

export default function OrderDetailClient({ order }: { order: Order }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl || "");
  const [noteText, setNoteText] = useState("");

  const currentStepIndex = statusPipeline.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED" || order.status === "REFUNDED";

  function handleStatusChange(newStatus: string) {
    if (!newStatus || newStatus === order.status) return;
    if (!confirm(`Sipariş durumunu "${statusLabels[newStatus]}" olarak güncellemek istiyor musunuz?`)) return;
    startTransition(async () => {
      try {
        await updateOrderStatus(order.id, newStatus);
        toast.success("Sipariş durumu güncellendi");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Güncelleme başarısız");
      }
    });
  }

  function handleTrackingSave() {
    startTransition(async () => {
      try {
        await updateOrderTracking(order.id, {
          trackingNumber: trackingNumber || undefined,
          trackingUrl: trackingUrl || undefined,
        });
        toast.success("Kargo bilgisi güncellendi");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Güncelleme başarısız");
      }
    });
  }

  function handleAddNote() {
    if (!noteText.trim()) return;
    startTransition(async () => {
      try {
        await addOrderNote(order.id, noteText.trim());
        toast.success("Not eklendi");
        setNoteText("");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Not eklenemedi");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/siparisler"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MaterialIcon icon="arrow_back" className="text-xl" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">
                Sipariş #{order.orderNumber}
              </h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                {statusLabels[order.status]}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(order.createdAt).toLocaleString("tr-TR")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value=""
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isPending}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
          >
            <option value="">Durumu Güncelle</option>
            {Object.entries(statusLabels)
              .filter(([key]) => key !== order.status)
              .map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800">
                Sipariş Kalemleri
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Adet</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Birim Fiyat</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Toplam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.product.images[0] ? (
                              <Image src={item.product.images[0].url} alt={item.name} width={40} height={40} className="object-cover w-full h-full" />
                            ) : (
                              <MaterialIcon icon="image" className="text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.sku}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(Number(item.price))}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-800">{formatCurrency(Number(item.total))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-8 text-sm">
                  <span className="text-gray-500">Ara Toplam:</span>
                  <span className="text-gray-700 font-medium">{formatCurrency(Number(order.subtotal))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex items-center gap-8 text-sm">
                    <span className="text-gray-500">İndirim{order.couponCode ? ` (${order.couponCode})` : ""}:</span>
                    <span className="text-red-600 font-medium">-{formatCurrency(Number(order.discount))}</span>
                  </div>
                )}
                <div className="flex items-center gap-8 text-sm">
                  <span className="text-gray-500">Kargo:</span>
                  <span className={Number(order.shippingCost) === 0 ? "text-green-600 font-medium" : "text-gray-700 font-medium"}>
                    {Number(order.shippingCost) === 0 ? "Ücretsiz" : formatCurrency(Number(order.shippingCost))}
                  </span>
                </div>
                <div className="flex items-center gap-8 text-base pt-2 border-t border-gray-200 mt-1">
                  <span className="font-semibold text-gray-700">Genel Toplam:</span>
                  <span className="font-bold text-primary text-lg">{formatCurrency(Number(order.total))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Pipeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-6">
              Sipariş Durumu
            </h2>
            {isCancelled ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <MaterialIcon icon="cancel" className="text-red-500 text-2xl" />
                <div>
                  <p className="font-medium text-red-700">{statusLabels[order.status]}</p>
                  <p className="text-sm text-red-500">Bu sipariş iptal edilmiş/iade edilmiştir.</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {statusPipeline.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={step} className="flex gap-4 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCurrent ? "bg-primary text-white ring-4 ring-primary/20" :
                          isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                        }`}>
                          <MaterialIcon icon={statusIcons[step]} className="text-lg" />
                        </div>
                        {index < statusPipeline.length - 1 && (
                          <div className={`w-0.5 flex-1 mt-2 ${isActive && index < currentStepIndex ? "bg-primary" : "bg-gray-200"}`} />
                        )}
                      </div>
                      <div className="pb-2">
                        <p className={`font-medium ${isActive ? "text-gray-800" : "text-gray-400"}`}>
                          {statusLabels[step]}
                        </p>
                        <p className={`text-sm ${isActive ? "text-gray-500" : "text-gray-300"}`}>
                          {isActive ? (isCurrent ? "Mevcut durum" : "Tamamlandı") : "Bekleniyor"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tracking & Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Kargo Takip
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Takip Numarası</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Kargo takip numarası"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Takip URL</label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <button
              onClick={handleTrackingSave}
              disabled={isPending}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <MaterialIcon icon="save" className="text-lg" />
              {isPending ? "Kaydediliyor..." : "Kargo Bilgisini Kaydet"}
            </button>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Notlar
            </h2>
            {order.notes && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-700 whitespace-pre-wrap">
                {order.notes}
              </div>
            )}
            <div className="flex gap-3">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Not ekleyin..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                disabled={isPending || !noteText.trim()}
                className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Müşteri Bilgileri
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center">
                <MaterialIcon icon="person" className="text-primary text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{order.user.firstName} {order.user.lastName}</p>
                <p className="text-sm text-gray-500">{order.user.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {order.user.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MaterialIcon icon="phone" className="text-gray-400 text-lg" />
                  <span>{order.user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <MaterialIcon icon="shopping_bag" className="text-gray-400 text-lg" />
                <span>{order.user._count.orders} sipariş</span>
              </div>
            </div>
            <Link
              href={`/admin/musteriler/${order.user.id}`}
              className="block mt-4 text-center text-sm text-primary hover:underline font-medium"
            >
              Müşteri Profilini Görüntüle
            </Link>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Teslimat Adresi
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>{order.address.address}</p>
              <p>{order.address.district} / {order.address.city}</p>
              {order.address.postalCode && <p>{order.address.postalCode}</p>}
              <p className="text-gray-500">{order.address.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Ödeme Bilgisi
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Durum:</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" :
                  order.paymentStatus === "FAILED" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.paymentStatus === "PAID" ? "Onaylandı" :
                   order.paymentStatus === "FAILED" ? "Başarısız" :
                   order.paymentStatus === "REFUNDED" ? "İade Edildi" : "Bekliyor"}
                </span>
              </div>
              {order.couponCode && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Kupon:</span>
                  <span className="text-gray-800 font-mono text-xs">{order.couponCode}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
