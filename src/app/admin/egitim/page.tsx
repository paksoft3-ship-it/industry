import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const samplePosts = [
  { id: "1", title: "Servo Motor Seçim Rehberi", category: "CNC Eğitimleri", status: "Yayında", date: "15.02.2026" },
  { id: "2", title: "Step Motor vs Servo Motor Karşılaştırma", category: "Otomasyon Rehberleri", status: "Taslak", date: "12.02.2026" },
  { id: "3", title: "Lineer Ray Montaj Kılavuzu", category: "Ürün İncelemeleri", status: "Yayında", date: "10.02.2026" },
];

export default function AdminEgitimPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">Blog / Eğitim</h2>
          <p className="text-sm text-gray-500 mt-1">Blog yazıları ve eğitim içeriklerini yönetin</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <MaterialIcon icon="add" className="text-[20px]" /> Yeni Yazı
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Başlık</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kategori</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tarih</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {samplePosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{post.title}</td>
                <td className="px-6 py-4 text-gray-500">{post.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === "Yayında" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{post.date}</td>
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
