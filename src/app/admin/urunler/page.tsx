import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const products = [
  { id: 1, name: "Endüstriyel Rulman 6205-2RS", sku: "RLM-6205", price: "₺245,00", stock: 150, status: "Aktif", image: "/images/placeholder.jpg" },
  { id: 2, name: "Kayış Kasnağı SPB 200-3", sku: "KSN-SPB200", price: "₺1.890,00", stock: 24, status: "Aktif", image: "/images/placeholder.jpg" },
  { id: 3, name: "Lineer Kızak HGH20CA", sku: "LNR-HGH20", price: "₺3.420,00", stock: 8, status: "Aktif", image: "/images/placeholder.jpg" },
  { id: 4, name: "Pnömatik Silindir DNC-40", sku: "PNM-DNC40", price: "₺2.100,00", stock: 0, status: "Stokta Yok", image: "/images/placeholder.jpg" },
  { id: 5, name: "Servo Motor 750W", sku: "SRV-750W", price: "₺8.500,00", stock: 12, status: "Aktif", image: "/images/placeholder.jpg" },
  { id: 6, name: "Endüstriyel Zincir 08B-1", sku: "ZNC-08B1", price: "₺320,00", stock: 200, status: "Aktif", image: "/images/placeholder.jpg" },
  { id: 7, name: "Hidrolik Pompa A10V045", sku: "HDP-A10V", price: "₺15.600,00", stock: 3, status: "Az Stok", image: "/images/placeholder.jpg" },
];

const statusColors: Record<string, string> = {
  "Aktif": "bg-green-100 text-green-700",
  "Stokta Yok": "bg-red-100 text-red-700",
  "Az Stok": "bg-yellow-100 text-yellow-700",
  "Pasif": "bg-gray-100 text-gray-500",
};

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Ürünler</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam 1.248 ürün</p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <MaterialIcon icon="add" className="text-lg" />
          Yeni Ürün Ekle
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Ürün adı, SKU veya barkod ile ara..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Tüm Kategoriler</option>
            <option>Rulmanlar</option>
            <option>Kayışlar</option>
            <option>Lineer Sistemler</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Tüm Durumlar</option>
            <option>Aktif</option>
            <option>Pasif</option>
            <option>Stokta Yok</option>
          </select>
          <button className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <MaterialIcon icon="filter_list" className="text-lg" />
            Daha Fazla Filtre
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Görsel</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fiyat</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 text-gray-500">#{product.id}</td>
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MaterialIcon icon="image" className="text-gray-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/urunler/${product.id}`} className="font-medium text-gray-800 hover:text-primary transition-colors">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{product.price}</td>
                  <td className="px-6 py-4 text-gray-700">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/urunler/${product.id}`}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <MaterialIcon icon="edit" className="text-lg" />
                      </Link>
                      <button
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Kopyala"
                      >
                        <MaterialIcon icon="content_copy" className="text-lg" />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <MaterialIcon icon="delete" className="text-lg" />
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
          <p className="text-sm text-gray-500">1-7 / 1.248 ürün gösteriliyor</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors" disabled>
              Önceki
            </button>
            <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">2</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">178</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
