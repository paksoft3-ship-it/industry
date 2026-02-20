import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function AdreslerPage() {
  const addresses = [
    {
      id: 1,
      title: "Ev Adresi",
      name: "Ad Soyad",
      address: "Örnek Mah. Örnek Sok. No: 1 Daire: 5",
      district: "Kadıköy",
      city: "İstanbul",
      phone: "0(532) 123 45 67",
      isDefault: true,
    },
    {
      id: 2,
      title: "İş Adresi",
      name: "Ad Soyad",
      address: "Organize Sanayi Bölgesi, B Blok No: 42",
      district: "Gebze",
      city: "Kocaeli",
      phone: "0(532) 765 43 21",
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <Link href="/hesap" className="hover:text-primary">Hesabım</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Adreslerim</span>
        </nav>

        {/* Title + Add Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)]">
            Adreslerim
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <MaterialIcon icon="add" className="text-xl" />
            Yeni Adres Ekle
          </button>
        </div>

        {/* Address Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-lg border p-5 relative ${
                addr.isDefault ? "border-primary" : "border-gray-100"
              }`}
            >
              {addr.isDefault && (
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                  Varsayılan
                </span>
              )}
              <div className="flex items-center gap-2 mb-3">
                <MaterialIcon icon="location_on" className="text-xl text-primary" />
                <h3 className="font-semibold text-primary">{addr.title}</h3>
              </div>
              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <p className="font-medium text-primary">{addr.name}</p>
                <p>{addr.address}</p>
                <p>{addr.district} / {addr.city}</p>
                <p>{addr.phone}</p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/70 transition-colors">
                  <MaterialIcon icon="edit" className="text-base" />
                  Düzenle
                </button>
                <button className="flex items-center gap-1 text-sm text-red-500 hover:text-red-400 transition-colors">
                  <MaterialIcon icon="delete" className="text-base" />
                  Sil
                </button>
              </div>
            </div>
          ))}

          {/* Add New Address Card */}
          <button className="bg-white rounded-lg border border-dashed border-gray-300 p-5 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-colors min-h-[200px]">
            <MaterialIcon icon="add_circle_outline" className="text-4xl" />
            <span className="text-sm font-medium">Yeni Adres Ekle</span>
          </button>
        </div>
      </div>
    </div>
  );
}
