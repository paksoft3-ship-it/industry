import MaterialIcon from "@/components/ui/MaterialIcon";

const samplePages = [
  { id: "1", title: "Hakkımızda", slug: "hakkimizda", status: true },
  { id: "2", title: "Sıkça Sorulan Sorular", slug: "sss", status: true },
  { id: "3", title: "Banka Hesaplarımız", slug: "banka-bilgilerimiz", status: true },
  { id: "4", title: "İade ve Değişim", slug: "iade-degisim", status: true },
  { id: "5", title: "Kargo ve Teslimat", slug: "kargo-teslimat", status: true },
  { id: "6", title: "Gizlilik Politikası", slug: "gizlilik-politikasi", status: true },
  { id: "7", title: "Mesafeli Satış Sözleşmesi", slug: "mesafeli-satis-sozlesmesi", status: true },
];

export default function AdminSayfalarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">Sayfalar</h2>
          <p className="text-sm text-gray-500 mt-1">Kurumsal ve bilgi sayfalarını yönetin</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <MaterialIcon icon="add" className="text-[20px]" /> Yeni Sayfa
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Başlık</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {samplePages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{page.title}</td>
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">/{page.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${page.status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {page.status ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-primary mr-2"><MaterialIcon icon="edit" className="text-[18px]" /></button>
                  <button className="text-gray-400 hover:text-red-500"><MaterialIcon icon="delete" className="text-[18px]" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
