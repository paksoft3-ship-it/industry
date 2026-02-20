import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const categories = [
  {
    id: 1,
    name: "Rulmanlar",
    slug: "rulmanlar",
    productCount: 342,
    children: [
      { id: 11, name: "Bilyalı Rulmanlar", slug: "bilyali-rulmanlar", productCount: 128, children: [] },
      { id: 12, name: "Makaralı Rulmanlar", slug: "makarali-rulmanlar", productCount: 96, children: [] },
      { id: 13, name: "İğne Rulmanlar", slug: "igne-rulmanlar", productCount: 54, children: [] },
      { id: 14, name: "Eksenel Rulmanlar", slug: "eksenel-rulmanlar", productCount: 64, children: [] },
    ],
  },
  {
    id: 2,
    name: "Kayış ve Kasnaklar",
    slug: "kayis-kasnaklar",
    productCount: 218,
    children: [
      { id: 21, name: "V Kayışları", slug: "v-kayislari", productCount: 89, children: [] },
      { id: 22, name: "Zamanlama Kayışları", slug: "zamanlama-kayislari", productCount: 72, children: [] },
      { id: 23, name: "Kasnaklar", slug: "kasnaklar", productCount: 57, children: [] },
    ],
  },
  {
    id: 3,
    name: "Lineer Hareket Sistemleri",
    slug: "lineer-hareket",
    productCount: 156,
    children: [
      { id: 31, name: "Lineer Kızaklar", slug: "lineer-kizaklar", productCount: 68, children: [] },
      { id: 32, name: "Bilyalı Vidalar", slug: "bilyali-vidalar", productCount: 45, children: [] },
      { id: 33, name: "Lineer Yataklar", slug: "lineer-yataklar", productCount: 43, children: [] },
    ],
  },
  {
    id: 4,
    name: "Pnömatik",
    slug: "pnomatik",
    productCount: 198,
    children: [],
  },
  {
    id: 5,
    name: "Hidrolik",
    slug: "hidrolik",
    productCount: 134,
    children: [],
  },
  {
    id: 6,
    name: "Zincir ve Dişliler",
    slug: "zincir-disliler",
    productCount: 200,
    children: [],
  },
];

function CategoryRow({ category, level = 0 }: { category: typeof categories[0]; level?: number }) {
  return (
    <>
      <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
        <td className="px-6 py-3.5">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            {category.children.length > 0 && (
              <MaterialIcon icon="expand_more" className="text-gray-400 text-lg" />
            )}
            {category.children.length === 0 && level > 0 && (
              <span className="w-5 h-px bg-gray-200 inline-block mr-1" />
            )}
            <MaterialIcon icon="folder" className={`text-lg ${level === 0 ? "text-primary" : "text-gray-400"}`} />
            <span className={`text-sm ${level === 0 ? "font-semibold text-gray-800" : "text-gray-600"}`}>
              {category.name}
            </span>
          </div>
        </td>
        <td className="px-6 py-3.5 text-sm text-gray-500 font-mono text-xs">{category.slug}</td>
        <td className="px-6 py-3.5 text-sm text-gray-600">{category.productCount} ürün</td>
        <td className="px-6 py-3.5">
          <div className="flex items-center justify-end gap-1">
            <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Düzenle">
              <MaterialIcon icon="edit" className="text-lg" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Alt Kategori Ekle">
              <MaterialIcon icon="add" className="text-lg" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sil">
              <MaterialIcon icon="delete" className="text-lg" />
            </button>
          </div>
        </td>
      </tr>
      {category.children.map((child) => (
        <CategoryRow key={child.id} category={child} level={level + 1} />
      ))}
    </>
  );
}

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Kategoriler</h1>
          <p className="text-sm text-gray-500 mt-1">Kategori ağacını yönetin</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <MaterialIcon icon="add" className="text-lg" />
          Yeni Kategori
        </button>
      </div>

      {/* Category Tree */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Kategori ara..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MaterialIcon icon="account_tree" className="text-lg" />
            <span>{categories.length} ana kategori</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori Adı</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün Sayısı</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
