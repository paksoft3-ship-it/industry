import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getOrderByNumber } from "@/lib/actions/orders";

export const dynamic = "force-dynamic";

const statusSteps = [
  { key: "PENDING", label: "Sipariş Alındı", icon: "receipt_long" },
  { key: "CONFIRMED", label: "Onaylandı", icon: "check_circle" },
  { key: "PROCESSING", label: "Hazırlanıyor", icon: "inventory_2" },
  { key: "SHIPPED", label: "Kargoya Verildi", icon: "local_shipping" },
  { key: "DELIVERED", label: "Teslim Edildi", icon: "done_all" },
];

const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const statusLabels: Record<string, string> = {
  PENDING: "Ödeme Bekliyor",
  CONFIRMED: "Onaylandı",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
};

interface SiparisTakipPageProps {
  searchParams: Promise<{ no?: string }>;
}

export default async function SiparisTakipPage({ searchParams }: SiparisTakipPageProps) {
  const { no } = await searchParams;
  const order = no ? await getOrderByNumber(no.trim()) : null;
  const currentStepIndex = order ? statusOrder.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Sipariş Takip</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8 text-center">
          Sipariş Takip
        </h1>

        {/* Search Form */}
        <form method="GET" action="/siparis-takip" className="max-w-lg mx-auto mb-10">
          <label className="block text-sm font-medium text-primary mb-2">
            Sipariş Numaranız
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MaterialIcon
                icon="tag"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="no"
                defaultValue={no || ""}
                placeholder="Örn: CNC260101234"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <MaterialIcon icon="search" className="text-xl" />
              Sorgula
            </button>
          </div>
        </form>

        {/* Result */}
        {no && !order && (
          <div className="max-w-2xl mx-auto text-center py-12 bg-white rounded-lg border border-gray-100">
            <MaterialIcon icon="search_off" className="text-5xl text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Sipariş bulunamadı.</p>
            <p className="text-sm text-gray-400 mt-1">"{no}" numaralı sipariş mevcut değil.</p>
          </div>
        )}

        {order && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-primary">Sipariş {order.orderNumber}</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} tarihinde oluşturuldu
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  order.status === "DELIVERED" ? "bg-green-50 text-green-700" :
                  order.status === "CANCELLED" ? "bg-red-50 text-red-600" :
                  order.status === "SHIPPED" ? "bg-indigo-50 text-indigo-700" :
                  "bg-yellow-50 text-yellow-700"
                }`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              {/* Status Steps (only for non-cancelled orders) */}
              {order.status !== "CANCELLED" && order.status !== "REFUNDED" && (
                <div className="space-y-0 mb-6">
                  {statusSteps.map((step, i) => {
                    const isDone = currentStepIndex >= i;
                    const isLast = i === statusSteps.length - 1;
                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <MaterialIcon
                            icon={step.icon}
                            className={`text-2xl ${isDone ? "text-green-500" : "text-gray-300"}`}
                          />
                          {!isLast && (
                            <div className={`w-0.5 h-8 ${isDone ? "bg-green-500" : "bg-gray-200"}`} />
                          )}
                        </div>
                        <div className="pb-6">
                          <p className={`font-medium ${isDone ? "text-primary" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tracking info */}
              {order.trackingNumber && (
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Kargo Takip No</p>
                  <p className="text-primary font-mono font-bold">{order.trackingNumber}</p>
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                    >
                      <MaterialIcon icon="open_in_new" className="text-base" />
                      Kargo Takip Sayfası
                    </a>
                  )}
                </div>
              )}

              {/* Order items */}
              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Sipariş İçeriği</p>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.product?.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.product.images[0].url} alt={item.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <MaterialIcon icon="image" className="text-gray-300 text-xl" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.quantity} adet × {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(item.price))}</p>
                      </div>
                      <p className="text-sm font-bold text-primary">
                        {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(item.total))}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                  <span className="font-semibold text-gray-700">Toplam</span>
                  <span className="font-bold text-primary text-lg">
                    {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(order.total))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Not Searched State */}
        {!no && (
          <div className="text-center py-12 text-gray-400">
            <MaterialIcon icon="local_shipping" className="text-6xl mb-4" />
            <p>Sipariş numaranızı girerek kargonuzu takip edebilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
