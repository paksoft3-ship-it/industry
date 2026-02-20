import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function SiparislerPage() {
  const orders = [
    { no: "ORD-2026-00123", date: "19 Şub 2026", items: 3, status: "Kargoda", statusColor: "text-blue-600 bg-blue-50", amount: "1.350,00 TL" },
    { no: "ORD-2026-00101", date: "12 Şub 2026", items: 1, status: "Teslim Edildi", statusColor: "text-green-600 bg-green-50", amount: "780,00 TL" },
    { no: "ORD-2026-00087", date: "3 Şub 2026", items: 5, status: "Teslim Edildi", statusColor: "text-green-600 bg-green-50", amount: "2.100,00 TL" },
    { no: "ORD-2026-00065", date: "20 Oca 2026", items: 2, status: "Teslim Edildi", statusColor: "text-green-600 bg-green-50", amount: "920,00 TL" },
    { no: "ORD-2025-00432", date: "15 Ara 2025", items: 1, status: "İptal Edildi", statusColor: "text-red-600 bg-red-50", amount: "450,00 TL" },
  ];

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

        {/* Orders Table */}
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
                <tr key={order.no} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-primary">{order.no}</td>
                  <td className="p-4 text-gray-500">{order.date}</td>
                  <td className="p-4 text-gray-500">{order.items} ürün</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium text-primary">{order.amount}</td>
                  <td className="p-4 text-right">
                    <button className="text-primary hover:text-primary/70 transition-colors">
                      <MaterialIcon icon="visibility" className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-50">
            {orders.map((order) => (
              <div key={order.no} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-primary text-sm">{order.no}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{order.date} - {order.items} ürün</span>
                  <span className="font-medium text-primary">{order.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
