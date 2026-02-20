import MaterialIcon from "@/components/ui/MaterialIcon";

const sampleLogs = [
  { id: "1", date: "20.02.2026 14:32", user: "Admin CNC", action: "Ürün güncellendi", entity: "Product", entityId: "spindle-motor-2-2kw", details: "Fiyat güncellendi: ₺3.850" },
  { id: "2", date: "20.02.2026 12:15", user: "Admin CNC", action: "Sipariş durumu değiştirildi", entity: "Order", entityId: "#SP-1042", details: "PENDING → PROCESSING" },
  { id: "3", date: "19.02.2026 16:40", user: "Admin CNC", action: "Yeni ürün eklendi", entity: "Product", entityId: "nema-34-step-motor", details: "NEMA 34 Step Motor 4.5Nm" },
  { id: "4", date: "19.02.2026 10:22", user: "Admin CNC", action: "Kategori güncellendi", entity: "Category", entityId: "spindle-motorlar", details: "Açıklama güncellendi" },
  { id: "5", date: "18.02.2026 09:00", user: "Admin CNC", action: "Kupon oluşturuldu", entity: "Coupon", entityId: "YAZ2026", details: "₺100 indirim kuponu" },
];

export default function AdminAuditLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">Audit Log</h2>
        <p className="text-sm text-gray-500 mt-1">Sistem işlem geçmişi</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tarih</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kullanıcı</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İşlem</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Varlık</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Detay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sampleLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{log.date}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{log.user}</td>
                <td className="px-6 py-4 text-gray-800">{log.action}</td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{log.entity}:{log.entityId}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
