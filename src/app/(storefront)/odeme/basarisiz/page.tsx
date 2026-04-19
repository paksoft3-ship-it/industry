import { Suspense } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function OdemeBasarisizPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return (
    <Suspense>
      <BasarisizContent searchParams={searchParams} />
    </Suspense>
  );
}

async function BasarisizContent({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const orderNumber = params.no;

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <MaterialIcon icon="cancel" className="text-5xl text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-display)] mb-3">
          Ödeme Başarısız
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          Ödeme işlemi tamamlanamadı.
        </p>
        {orderNumber && (
          <p className="text-xs text-gray-400 mb-6">Sipariş No: {orderNumber}</p>
        )}
        <p className="text-sm text-gray-500 mb-8">
          Kart bilgilerinizi kontrol ederek tekrar deneyebilir veya farklı bir ödeme yöntemi seçebilirsiniz.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sepet"
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Tekrar Dene
          </Link>
          <Link
            href="/iletisim"
            className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Destek Al
          </Link>
        </div>
      </div>
    </div>
  );
}
