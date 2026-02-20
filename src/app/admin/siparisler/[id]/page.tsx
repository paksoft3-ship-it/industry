import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const orderItems = [
  { id: 1, name: "Endüstriyel Rulman 6205-2RS", sku: "RLM-6205", qty: 4, price: "₺245,00", total: "₺980,00" },
  { id: 2, name: "Kayış Kasnağı SPB 200-3", sku: "KSN-SPB200", qty: 1, price: "₺1.890,00", total: "₺1.890,00" },
  { id: 3, name: "Lineer Kızak HGH20CA", sku: "LNR-HGH20", qty: 2, price: "₺690,00", total: "₺1.380,00" },
];

const timeline = [
  { date: "19.02.2026 14:30", status: "Hazırlanıyor", desc: "Sipariş hazırlanmaya başlandı", icon: "inventory", active: true },
  { date: "19.02.2026 10:15", status: "Onaylandı", desc: "Ödeme onaylandı, sipariş işleme alındı", icon: "check_circle", active: true },
  { date: "19.02.2026 09:42", status: "Ödeme Alındı", desc: "Kredi kartı ile ödeme yapıldı", icon: "payments", active: true },
  { date: "19.02.2026 09:40", status: "Sipariş Oluşturuldu", desc: "Müşteri siparişi tamamladı", icon: "shopping_cart", active: true },
  { date: "", status: "Kargoya Verildi", desc: "Bekleniyor", icon: "local_shipping", active: false },
  { date: "", status: "Teslim Edildi", desc: "Bekleniyor", icon: "done_all", active: false },
];

export default function AdminOrderDetailPage() {
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
                Sipariş #SP-1042
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                Hazırlanıyor
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">19 Şubat 2026, 09:40</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <MaterialIcon icon="print" className="text-lg" />
            Yazdır
          </button>
          <select className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
            <option>Durumu Güncelle</option>
            <option>Kargoya Verildi</option>
            <option>Teslim Edildi</option>
            <option>İptal Et</option>
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
                  {orderItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <MaterialIcon icon="image" className="text-gray-400" />
                          </div>
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.sku}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{item.qty}</td>
                      <td className="px-6 py-4 text-right text-gray-600">{item.price}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-800">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-8 text-sm">
                  <span className="text-gray-500">Ara Toplam:</span>
                  <span className="text-gray-700 font-medium">₺4.250,00</span>
                </div>
                <div className="flex items-center gap-8 text-sm">
                  <span className="text-gray-500">KDV (%20):</span>
                  <span className="text-gray-700 font-medium">₺850,00</span>
                </div>
                <div className="flex items-center gap-8 text-sm">
                  <span className="text-gray-500">Kargo:</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                <div className="flex items-center gap-8 text-base pt-2 border-t border-gray-200 mt-1">
                  <span className="font-semibold text-gray-700">Genel Toplam:</span>
                  <span className="font-bold text-primary text-lg">₺5.100,00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-6">
              Sipariş Durumu
            </h2>
            <div className="relative">
              {timeline.map((step, index) => (
                <div key={index} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.active ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      <MaterialIcon icon={step.icon} className="text-lg" />
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-2 ${
                        step.active && timeline[index + 1]?.active ? "bg-primary" : "bg-gray-200"
                      }`} />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className={`font-medium ${step.active ? "text-gray-800" : "text-gray-400"}`}>
                      {step.status}
                    </p>
                    <p className={`text-sm ${step.active ? "text-gray-500" : "text-gray-300"}`}>{step.desc}</p>
                    {step.date && <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>}
                  </div>
                </div>
              ))}
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
                <p className="font-medium text-gray-800">Ahmet Yılmaz</p>
                <p className="text-sm text-gray-500">ahmet@example.com</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MaterialIcon icon="phone" className="text-gray-400 text-lg" />
                <span>+90 532 123 45 67</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MaterialIcon icon="shopping_bag" className="text-gray-400 text-lg" />
                <span>12 sipariş</span>
              </div>
            </div>
            <Link
              href="/admin/musteriler/1"
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
              <p className="font-medium text-gray-800">Ahmet Yılmaz</p>
              <p>Organize Sanayi Bölgesi</p>
              <p>14. Cadde No: 28</p>
              <p>Nilüfer / Bursa</p>
              <p>16140</p>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Fatura Adresi
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">Yılmaz Makina San. Tic. Ltd. Şti.</p>
              <p>VKN: 1234567890</p>
              <p>Organize Sanayi Bölgesi</p>
              <p>14. Cadde No: 28</p>
              <p>Nilüfer / Bursa, 16140</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Ödeme Bilgisi
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Yöntem:</span>
                <span className="text-gray-800 font-medium">Kredi Kartı</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kart:</span>
                <span className="text-gray-800">**** **** **** 4242</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taksit:</span>
                <span className="text-gray-800">Tek Çekim</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-500">Durum:</span>
                <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                  Onaylandı
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
