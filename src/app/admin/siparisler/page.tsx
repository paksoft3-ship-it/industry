import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const orders = [
  { id: "SP-1042", customer: "Ahmet Yılmaz", email: "ahmet@example.com", date: "19.02.2026", total: "₺4.250,00", items: 3, status: "Hazırlanıyor", payment: "Kredi Kartı" },
  { id: "SP-1041", customer: "Mehmet Kaya", email: "mehmet@example.com", date: "18.02.2026", total: "₺1.890,00", items: 1, status: "Kargoda", payment: "Havale/EFT" },
  { id: "SP-1040", customer: "Ayşe Demir", email: "ayse@example.com", date: "18.02.2026", total: "₺7.120,00", items: 5, status: "Teslim Edildi", payment: "Kredi Kartı" },
  { id: "SP-1039", customer: "Fatma Çelik", email: "fatma@example.com", date: "17.02.2026", total: "₺3.450,00", items: 2, status: "Ödeme Bekliyor", payment: "Havale/EFT" },
  { id: "SP-1038", customer: "Ali Öztürk", email: "ali@example.com", date: "17.02.2026", total: "₺2.100,00", items: 1, status: "Teslim Edildi", payment: "Kredi Kartı" },
  { id: "SP-1037", customer: "Veli Şahin", email: "veli@example.com", date: "16.02.2026", total: "₺12.800,00", items: 8, status: "İptal", payment: "Kredi Kartı" },
  { id: "SP-1036", customer: "Zeynep Arslan", email: "zeynep@example.com", date: "16.02.2026", total: "₺5.670,00", items: 4, status: "Kargoda", payment: "Havale/EFT" },
  { id: "SP-1035", customer: "Hasan Koç", email: "hasan@example.com", date: "15.02.2026", total: "₺890,00", items: 1, status: "Teslim Edildi", payment: "Kredi Kartı" },
];

const statusColors: Record<string, string> = {
  "Hazırlanıyor": "bg-yellow-100 text-yellow-700",
  "Kargoda": "bg-blue-100 text-blue-700",
  "Teslim Edildi": "bg-green-100 text-green-700",
  "Ödeme Bekliyor": "bg-red-100 text-red-700",
  "İptal": "bg-gray-100 text-gray-500",
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Siparişler</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam 356 sipariş</p>
        </div>
        <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <MaterialIcon icon="download" className="text-lg" />
          Dışa Aktar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Tümü", count: 356, active: true },
          { label: "Bekleyen", count: 12, active: false },
          { label: "Hazırlanıyor", count: 8, active: false },
          { label: "Kargoda", count: 15, active: false },
          { label: "Teslim Edildi", count: 321, active: false },
        ].map((tab) => (
          <button
            key={tab.label}
            className={`p-3 rounded-xl text-center transition-colors ${
              tab.active
                ? "bg-primary text-white shadow-sm"
                : "bg-white border border-gray-100 text-gray-600 hover:border-primary/30"
            }`}
          >
            <p className={`text-xl font-bold ${tab.active ? "" : "text-gray-800"}`}>{tab.count}</p>
            <p className={`text-xs mt-0.5 ${tab.active ? "text-white/80" : "text-gray-500"}`}>{tab.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Sipariş no veya müşteri adı ile ara..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <input
            type="date"
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Tüm Durumlar</option>
            <option>Hazırlanıyor</option>
            <option>Kargoda</option>
            <option>Teslim Edildi</option>
            <option>İptal</option>
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
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tutar</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ödeme</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/siparisler/${order.id}`} className="font-medium text-primary hover:underline">
                      #{order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-gray-600">{order.items} ürün</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{order.total}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{order.payment}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/siparisler/${order.id}`}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Detay"
                      >
                        <MaterialIcon icon="visibility" className="text-lg" />
                      </Link>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Yazdır">
                        <MaterialIcon icon="print" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">1-8 / 356 sipariş gösteriliyor</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors" disabled>Önceki</button>
            <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">2</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">45</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Sonraki</button>
          </div>
        </div>
      </div>
    </div>
  );
}
