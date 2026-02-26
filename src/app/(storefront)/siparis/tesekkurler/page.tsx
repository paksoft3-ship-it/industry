import { Suspense } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function SiparisTesekkurlerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  return (
    <Suspense>
      <TesekkurlerContent searchParams={searchParams} />
    </Suspense>
  );
}

async function TesekkurlerContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const orderNumber = params.no || "";
  const total = params.total ? Number(params.total) : null;

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-lg mx-auto text-center py-16">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <MaterialIcon icon="check_circle" className="text-5xl text-green-500" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-3">
            Siparişiniz Alındı!
          </h1>
          <p className="text-gray-500 mb-8">
            Siparişiniz başarıyla oluşturuldu. Havale / EFT ödemesini tamamladıktan sonra siparişiniz hazırlanmaya başlanacaktır.
          </p>

          {/* Order Info Card */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Sipariş Numarası</p>
                <p className="font-semibold text-primary">{orderNumber || "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Sipariş Tarihi</p>
                <p className="font-semibold text-primary">
                  {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              {total !== null && (
                <div>
                  <p className="text-gray-400 mb-1">Toplam Tutar</p>
                  <p className="font-semibold text-primary">
                    {total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL
                  </p>
                </div>
              )}
              <div>
                <p className="text-gray-400 mb-1">Ödeme Yöntemi</p>
                <p className="font-semibold text-primary">Havale / EFT</p>
              </div>
            </div>
          </div>

          {/* Havale reminder */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-start gap-2">
              <MaterialIcon icon="info" className="text-blue-500 text-lg mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Ödeme Hatırlatması</p>
                <p>Havale / EFT yaparken açıklama kısmına <strong>{orderNumber || "sipariş numaranızı"}</strong> yazmayı unutmayınız. Ödemeniz onaylandıktan sonra siparişiniz hazırlanmaya başlanacaktır.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/hesap/siparisler"
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <MaterialIcon icon="shopping_bag" className="text-xl" />
              Siparişlerim
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
