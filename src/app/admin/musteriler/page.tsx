import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const customers = [
  { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com", phone: "+90 532 123 45 67", orders: 12, totalSpent: "₺28.400,00", registered: "15.01.2025", status: "Aktif" },
  { id: 2, name: "Mehmet Kaya", email: "mehmet@example.com", phone: "+90 533 234 56 78", orders: 8, totalSpent: "₺15.200,00", registered: "22.03.2025", status: "Aktif" },
  { id: 3, name: "Ayşe Demir", email: "ayse@example.com", phone: "+90 535 345 67 89", orders: 24, totalSpent: "₺52.800,00", registered: "08.11.2024", status: "Aktif" },
  { id: 4, name: "Fatma Çelik", email: "fatma@example.com", phone: "+90 536 456 78 90", orders: 3, totalSpent: "₺6.450,00", registered: "12.06.2025", status: "Aktif" },
  { id: 5, name: "Ali Öztürk", email: "ali@example.com", phone: "+90 537 567 89 01", orders: 15, totalSpent: "₺34.100,00", registered: "30.09.2024", status: "Aktif" },
  { id: 6, name: "Veli Şahin", email: "veli@example.com", phone: "+90 538 678 90 12", orders: 1, totalSpent: "₺890,00", registered: "01.02.2026", status: "Yeni" },
  { id: 7, name: "Zeynep Arslan", email: "zeynep@example.com", phone: "+90 539 789 01 23", orders: 0, totalSpent: "₺0,00", registered: "18.02.2026", status: "Yeni" },
  { id: 8, name: "Hasan Koç", email: "hasan@example.com", phone: "+90 531 890 12 34", orders: 6, totalSpent: "₺11.200,00", registered: "05.07.2025", status: "Pasif" },
];

const statusColors: Record<string, string> = {
  "Aktif": "bg-green-100 text-green-700",
  "Yeni": "bg-blue-100 text-blue-700",
  "Pasif": "bg-gray-100 text-gray-500",
};

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Müşteriler</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam 2.540 kayıtlı müşteri</p>
        </div>
        <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <MaterialIcon icon="download" className="text-lg" />
          Dışa Aktar
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="İsim, e-posta veya telefon ile ara..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Tüm Durumlar</option>
            <option>Aktif</option>
            <option>Yeni</option>
            <option>Pasif</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Sıralama: Son Kayıt</option>
            <option>En Çok Sipariş</option>
            <option>En Yüksek Harcama</option>
            <option>İsme Göre A-Z</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Müşteri</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">E-posta</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefon</th>
                <th className="text-center px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Siparişler</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Toplam Harcama</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary text-sm font-semibold">
                          {customer.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <Link href={`/admin/musteriler/${customer.id}`} className="font-medium text-gray-800 hover:text-primary transition-colors">
                        {customer.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{customer.email}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{customer.phone}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{customer.orders}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-800">{customer.totalSpent}</td>
                  <td className="px-6 py-4 text-gray-500">{customer.registered}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[customer.status]}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/musteriler/${customer.id}`}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Detay"
                      >
                        <MaterialIcon icon="visibility" className="text-lg" />
                      </Link>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="E-posta Gönder">
                        <MaterialIcon icon="email" className="text-lg" />
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
          <p className="text-sm text-gray-500">1-8 / 2.540 müşteri gösteriliyor</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors" disabled>Önceki</button>
            <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">2</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">318</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Sonraki</button>
          </div>
        </div>
      </div>
    </div>
  );
}
