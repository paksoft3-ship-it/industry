import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function HesapPage() {
  const sections = [
    { title: "Siparişlerim", description: "Sipariş geçmişinizi görüntüleyin", icon: "shopping_bag", href: "/hesap/siparisler", count: "3 aktif" },
    { title: "Adreslerim", description: "Teslimat adreslerinizi yönetin", icon: "location_on", href: "/hesap/adresler", count: "2 adres" },
    { title: "Favorilerim", description: "Beğendiğiniz ürünleri görün", icon: "favorite", href: "/favoriler", count: "8 ürün" },
    { title: "Hesap Bilgilerim", description: "Kişisel bilgilerinizi düzenleyin", icon: "person", href: "#", count: "" },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Hesabım</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MaterialIcon icon="person" className="text-3xl text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)]">
              Hesabım
            </h1>
            <p className="text-gray-500 text-sm">Hoş geldiniz!</p>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group bg-white rounded-lg border border-gray-100 p-6 hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <MaterialIcon icon={section.icon} className="text-2xl text-primary" />
              </div>
              <h2 className="font-semibold text-primary mb-1">{section.title}</h2>
              <p className="text-sm text-gray-400 mb-3">{section.description}</p>
              {section.count && (
                <span className="text-xs text-primary/70 font-medium">{section.count}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Recent Orders Quick View */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary mb-4">Son Siparişler</h2>
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-medium text-gray-400">Sipariş No</th>
                  <th className="text-left p-4 font-medium text-gray-400">Tarih</th>
                  <th className="text-left p-4 font-medium text-gray-400">Durum</th>
                  <th className="text-right p-4 font-medium text-gray-400">Tutar</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { no: "ORD-2026-00123", date: "19 Şub 2026", status: "Kargoda", amount: "1.350,00 TL", color: "text-blue-600 bg-blue-50" },
                  { no: "ORD-2026-00101", date: "12 Şub 2026", status: "Teslim Edildi", amount: "780,00 TL", color: "text-green-600 bg-green-50" },
                  { no: "ORD-2026-00087", date: "3 Şub 2026", status: "Teslim Edildi", amount: "2.100,00 TL", color: "text-green-600 bg-green-50" },
                ].map((order) => (
                  <tr key={order.no} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 font-medium text-primary">{order.no}</td>
                    <td className="p-4 text-gray-500">{order.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.color}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-primary">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
