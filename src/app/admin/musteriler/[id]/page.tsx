import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const customerOrders = [
  { id: "SP-1042", date: "19.02.2026", total: "₺4.250,00", items: 3, status: "Hazırlanıyor" },
  { id: "SP-1028", date: "05.02.2026", total: "₺2.100,00", items: 2, status: "Teslim Edildi" },
  { id: "SP-1015", date: "18.01.2026", total: "₺6.890,00", items: 5, status: "Teslim Edildi" },
  { id: "SP-0998", date: "02.01.2026", total: "₺1.450,00", items: 1, status: "Teslim Edildi" },
  { id: "SP-0967", date: "12.12.2025", total: "₺3.200,00", items: 2, status: "Teslim Edildi" },
  { id: "SP-0945", date: "28.11.2025", total: "₺5.670,00", items: 4, status: "Teslim Edildi" },
];

const addresses = [
  { id: 1, title: "İş Adresi (Varsayılan)", name: "Ahmet Yılmaz", address: "Organize Sanayi Bölgesi, 14. Cadde No: 28", city: "Nilüfer / Bursa", zip: "16140", phone: "+90 532 123 45 67" },
  { id: 2, title: "Depo Adresi", name: "Yılmaz Makina", address: "Demirtaş OSB, 5. Sokak No: 12", city: "Osmangazi / Bursa", zip: "16110", phone: "+90 224 456 78 90" },
];

const statusColors: Record<string, string> = {
  "Hazırlanıyor": "bg-yellow-100 text-yellow-700",
  "Kargoda": "bg-blue-100 text-blue-700",
  "Teslim Edildi": "bg-green-100 text-green-700",
};

export default function AdminCustomerDetailPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/musteriler"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MaterialIcon icon="arrow_back" className="text-xl" />
          </Link>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Müşteri Detayı</h1>
            <p className="text-sm text-gray-500 mt-0.5">Müşteri #1 - Ahmet Yılmaz</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <MaterialIcon icon="email" className="text-lg" />
            E-posta Gönder
          </button>
          <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <MaterialIcon icon="edit" className="text-lg" />
            Düzenle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800">
                Sipariş Geçmişi
              </h2>
              <span className="text-sm text-gray-500">{customerOrders.length} sipariş</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sipariş No</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tutar</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customerOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <Link href={`/admin/siparisler/${order.id}`} className="font-medium text-primary hover:underline">
                          #{order.id}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500">{order.date}</td>
                      <td className="px-6 py-3.5 text-center text-gray-600">{order.items}</td>
                      <td className="px-6 py-3.5 text-right font-medium text-gray-800">{order.total}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link href={`/admin/siparisler/${order.id}`} className="text-gray-400 hover:text-primary transition-colors">
                          <MaterialIcon icon="open_in_new" className="text-lg" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Kayıtlı Adresler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-gray-100 rounded-xl p-4 hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-primary">{addr.title}</span>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <MaterialIcon icon="edit" className="text-sm" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-800">{addr.name}</p>
                    <p>{addr.address}</p>
                    <p>{addr.city}, {addr.zip}</p>
                    <p className="text-gray-500">{addr.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl font-bold">AY</span>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-gray-800">Ahmet Yılmaz</h3>
            <p className="text-sm text-gray-500 mt-1">ahmet@example.com</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-2">
              Aktif
            </span>
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MaterialIcon icon="phone" className="text-gray-400 text-lg" />
                <span>+90 532 123 45 67</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MaterialIcon icon="business" className="text-gray-400 text-lg" />
                <span>Yılmaz Makina San. Tic. Ltd. Şti.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MaterialIcon icon="badge" className="text-gray-400 text-lg" />
                <span>VKN: 1234567890</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MaterialIcon icon="calendar_today" className="text-gray-400 text-lg" />
                <span>Kayıt: 15.01.2025</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-gray-800 mb-4">İstatistikler</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <MaterialIcon icon="shopping_bag" className="text-blue-600 text-sm" />
                  </div>
                  <span className="text-sm text-gray-600">Toplam Sipariş</span>
                </div>
                <span className="font-bold text-gray-800">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <MaterialIcon icon="payments" className="text-green-600 text-sm" />
                  </div>
                  <span className="text-sm text-gray-600">Toplam Harcama</span>
                </div>
                <span className="font-bold text-gray-800">₺28.400</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <MaterialIcon icon="trending_up" className="text-purple-600 text-sm" />
                  </div>
                  <span className="text-sm text-gray-600">Ort. Sipariş</span>
                </div>
                <span className="font-bold text-gray-800">₺2.367</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <MaterialIcon icon="schedule" className="text-orange-600 text-sm" />
                  </div>
                  <span className="text-sm text-gray-600">Son Sipariş</span>
                </div>
                <span className="font-bold text-gray-800">19.02.2026</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-gray-800 mb-3">Notlar</h3>
            <textarea
              rows={4}
              placeholder="Müşteri hakkında not ekleyin..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              defaultValue="Kurumsal müşteri. Genellikle büyük miktarlarda sipariş verir. Fatura adresi şirket adresine kesilmeli."
            />
            <button className="mt-2 text-sm text-primary hover:text-primary/80 font-medium">Notu Kaydet</button>
          </div>
        </div>
      </div>
    </div>
  );
}
