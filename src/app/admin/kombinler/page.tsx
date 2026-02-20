import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const bundles = [
  { id: 1, name: "Rulman Başlangıç Seti", products: 5, discount: "%10", price: "₺1.200,00", status: "Aktif", sales: 42 },
  { id: 2, name: "Pnömatik Komple Paket", products: 8, discount: "%15", price: "₺4.850,00", status: "Aktif", sales: 28 },
  { id: 3, name: "Lineer Hareket Kiti", products: 4, discount: "%8", price: "₺6.200,00", status: "Aktif", sales: 15 },
  { id: 4, name: "Kayış-Kasnak Seti", products: 6, discount: "%12", price: "₺2.400,00", status: "Pasif", sales: 8 },
  { id: 5, name: "Hidrolik Bakım Paketi", products: 10, discount: "%20", price: "₺8.900,00", status: "Aktif", sales: 34 },
  { id: 6, name: "Endüstriyel Zincir Seti", products: 3, discount: "%5", price: "₺980,00", status: "Taslak", sales: 0 },
];

const statusColors: Record<string, string> = {
  "Aktif": "bg-green-100 text-green-700",
  "Pasif": "bg-gray-100 text-gray-500",
  "Taslak": "bg-yellow-100 text-yellow-700",
};

export default function AdminBundlesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Kombinler</h1>
          <p className="text-sm text-gray-500 mt-1">Ürün kombin paketlerini yönetin</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <MaterialIcon icon="add" className="text-lg" />
          Yeni Kombin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <MaterialIcon icon="package_2" className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Toplam Kombin</p>
            <p className="text-xl font-bold text-gray-800">{bundles.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <MaterialIcon icon="check_circle" className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Aktif</p>
            <p className="text-xl font-bold text-gray-800">{bundles.filter(b => b.status === "Aktif").length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <MaterialIcon icon="shopping_cart" className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Toplam Satış</p>
            <p className="text-xl font-bold text-gray-800">{bundles.reduce((a, b) => a + b.sales, 0)}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kombin Adı</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün Sayısı</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">İndirim</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fiyat</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Satış</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bundles.map((bundle) => (
                <tr key={bundle.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                        <MaterialIcon icon="package_2" className="text-primary" />
                      </div>
                      <span className="font-medium text-gray-800">{bundle.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{bundle.products} ürün</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs font-medium">
                      {bundle.discount}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{bundle.price}</td>
                  <td className="px-6 py-4 text-gray-600">{bundle.sales}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[bundle.status]}`}>
                      {bundle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Düzenle">
                        <MaterialIcon icon="edit" className="text-lg" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                        <MaterialIcon icon="delete" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
