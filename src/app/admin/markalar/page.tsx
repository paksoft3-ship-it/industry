import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const brands = [
  { id: 1, name: "SKF", productCount: 245, country: "İsveç", status: "Aktif" },
  { id: 2, name: "NSK", productCount: 189, country: "Japonya", status: "Aktif" },
  { id: 3, name: "FAG/Schaeffler", productCount: 210, country: "Almanya", status: "Aktif" },
  { id: 4, name: "HIWIN", productCount: 96, country: "Tayvan", status: "Aktif" },
  { id: 5, name: "Festo", productCount: 134, country: "Almanya", status: "Aktif" },
  { id: 6, name: "Bosch Rexroth", productCount: 78, country: "Almanya", status: "Aktif" },
  { id: 7, name: "THK", productCount: 65, country: "Japonya", status: "Aktif" },
  { id: 8, name: "Gates", productCount: 112, country: "ABD", status: "Pasif" },
  { id: 9, name: "Timken", productCount: 87, country: "ABD", status: "Aktif" },
];

export default function AdminBrandsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Markalar</h1>
          <p className="text-sm text-gray-500 mt-1">{brands.length} marka kayıtlı</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <MaterialIcon icon="add" className="text-lg" />
          Yeni Marka
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative max-w-md">
          <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Marka adı ile ara..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                <MaterialIcon icon="branding_watermark" className="text-gray-400 text-3xl" />
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Düzenle">
                  <MaterialIcon icon="edit" className="text-lg" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
                  <MaterialIcon icon="delete" className="text-lg" />
                </button>
              </div>
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-gray-800 text-lg">{brand.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{brand.country}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-600">
                <span className="font-medium">{brand.productCount}</span> ürün
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                brand.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {brand.status}
              </span>
            </div>
          </div>
        ))}

        {/* Add New Brand Card */}
        <button className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-6 hover:border-primary/30 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center min-h-[200px] group">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-3">
            <MaterialIcon icon="add" className="text-gray-400 group-hover:text-primary text-2xl transition-colors" />
          </div>
          <span className="text-sm font-medium text-gray-500 group-hover:text-primary transition-colors">Yeni Marka Ekle</span>
        </button>
      </div>
    </div>
  );
}
