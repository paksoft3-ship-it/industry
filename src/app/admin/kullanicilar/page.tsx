import MaterialIcon from "@/components/ui/MaterialIcon";

const sampleUsers = [
  { id: "1", name: "Admin CNC", email: "admin@cncotomasyon.com", role: "SUPER_ADMIN", date: "01.01.2026" },
  { id: "2", name: "Ahmet Yılmaz", email: "ahmet@example.com", role: "CUSTOMER", date: "15.01.2026" },
  { id: "3", name: "Mehmet Kaya", email: "mehmet@example.com", role: "CUSTOMER", date: "20.01.2026" },
];

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-700",
  ADMIN: "bg-purple-100 text-purple-700",
  CUSTOMER: "bg-gray-100 text-gray-600",
};

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Süper Admin",
  ADMIN: "Admin",
  CUSTOMER: "Müşteri",
};

export default function AdminKullanicilarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">Kullanıcılar</h2>
          <p className="text-sm text-gray-500 mt-1">Kullanıcı hesaplarını ve rollerini yönetin</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <MaterialIcon icon="person_add" className="text-[20px]" /> Kullanıcı Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ad Soyad</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">E-posta</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rol</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kayıt Tarihi</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sampleUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <MaterialIcon icon="person" className="text-gray-500 text-[16px]" />
                  </div>
                  {user.name}
                </td>
                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.date}</td>
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
