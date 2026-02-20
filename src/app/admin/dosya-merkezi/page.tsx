import MaterialIcon from "@/components/ui/MaterialIcon";

const sampleFiles = [
  { id: "1", title: "NEMA 23 Teknik Çizim", category: "Teknik Çizimler", type: "PDF", size: "2.4 MB" },
  { id: "2", title: "Spindle Kullanım Kılavuzu", category: "Kullanım Kılavuzları", type: "PDF", size: "5.1 MB" },
  { id: "3", title: "HGR20 CAD Dosyası", category: "CAD Dosyaları", type: "STEP", size: "12.6 MB" },
];

export default function AdminDosyaMerkeziPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">Dosya Merkezi</h2>
          <p className="text-sm text-gray-500 mt-1">Teknik dökümanlar ve dosyaları yönetin</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <MaterialIcon icon="upload_file" className="text-[20px]" /> Dosya Yükle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Dosya</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kategori</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tür</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Boyut</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sampleFiles.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                  <MaterialIcon icon="description" className="text-[20px] text-gray-400" />
                  {file.title}
                </td>
                <td className="px-6 py-4 text-gray-500">{file.category}</td>
                <td className="px-6 py-4"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{file.type}</span></td>
                <td className="px-6 py-4 text-gray-500">{file.size}</td>
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
