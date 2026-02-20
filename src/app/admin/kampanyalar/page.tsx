import MaterialIcon from "@/components/ui/MaterialIcon";

const sampleCoupons = [
  { id: "1", code: "HOSGELDIN10", type: "Yüzde", value: "%10", minOrder: "₺500", used: "23/100", status: true, expiry: "31.12.2026" },
  { id: "2", code: "YAZ2026", type: "Sabit", value: "₺100", minOrder: "₺1.000", used: "45/200", status: true, expiry: "30.09.2026" },
  { id: "3", code: "ILKALIS", type: "Yüzde", value: "%15", minOrder: "₺750", used: "12/50", status: false, expiry: "01.01.2026" },
];

export default function AdminKampanyalarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">Kampanyalar & Kuponlar</h2>
          <p className="text-sm text-gray-500 mt-1">İndirim kuponları ve kampanyaları yönetin</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <MaterialIcon icon="add" className="text-[20px]" /> Yeni Kupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kod</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tür</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Değer</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Min. Sipariş</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kullanım</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Bitiş</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sampleCoupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono font-bold text-primary">{coupon.code}</td>
                <td className="px-6 py-4 text-gray-500">{coupon.type}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{coupon.value}</td>
                <td className="px-6 py-4 text-gray-500">{coupon.minOrder}</td>
                <td className="px-6 py-4 text-gray-500">{coupon.used}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${coupon.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {coupon.status ? "Aktif" : "Süresi Dolmuş"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{coupon.expiry}</td>
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
