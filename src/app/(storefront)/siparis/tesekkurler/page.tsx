import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function SiparisTesekkurlerPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-lg mx-auto text-center py-16">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <MaterialIcon icon="check_circle" className="text-5xl text-green-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-3">
            Siparişiniz Alındı!
          </h1>
          <p className="text-gray-500 mb-8">
            Siparişiniz başarıyla oluşturuldu. Sipariş detaylarınız e-posta adresinize gönderildi.
          </p>

          {/* Order Info Card */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 mb-8 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Sipariş Numarası</p>
                <p className="font-semibold text-primary">ORD-2026-00123</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Sipariş Tarihi</p>
                <p className="font-semibold text-primary">19 Şubat 2026</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Toplam Tutar</p>
                <p className="font-semibold text-primary">1.350,00 TL</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Tahmini Teslimat</p>
                <p className="font-semibold text-primary">24-26 Şubat 2026</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/siparis-takip"
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <MaterialIcon icon="local_shipping" className="text-xl" />
              Siparişi Takip Et
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 border border-gray-200 text-primary rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <MaterialIcon icon="home" className="text-xl" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
