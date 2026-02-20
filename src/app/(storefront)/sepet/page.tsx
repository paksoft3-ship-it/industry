"use client";

import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function SepetPage() {
  const placeholderItems = [
    { id: 1, name: "Endüstriyel Ürün A", brand: "Marka A", price: 450.0, qty: 2 },
    { id: 2, name: "Endüstriyel Ürün B", brand: "Marka B", price: 320.0, qty: 1 },
    { id: 3, name: "Endüstriyel Ürün C", brand: "Marka C", price: 180.0, qty: 3 },
  ];

  const subtotal = placeholderItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Sepet</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8">
          Sepetim
          <span className="text-base font-normal text-gray-400 ml-2">({placeholderItems.length} ürün)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {placeholderItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-100 p-4 flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <MaterialIcon icon="image" className="text-3xl text-gray-300" />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-primary">{item.name}</h3>
                      <p className="text-sm text-gray-400">{item.brand}</p>
                    </div>
                    <button className="text-gray-300 hover:text-red-500 transition-colors">
                      <MaterialIcon icon="delete" className="text-xl" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                        <MaterialIcon icon="remove" className="text-lg" />
                      </button>
                      <span className="w-10 h-9 flex items-center justify-center text-sm font-medium text-primary border-x border-gray-200">
                        {item.qty}
                      </span>
                      <button className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                        <MaterialIcon icon="add" className="text-lg" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-bold text-primary text-lg">
                      {(item.price * item.qty).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-4">
              <h2 className="font-semibold text-primary text-lg mb-4">Sipariş Özeti</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Ara Toplam</span>
                  <span>{subtotal.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Kargo</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-primary font-bold text-lg">
                  <span>Toplam</span>
                  <span>{subtotal.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
                </div>
              </div>

              <Link
                href="/odeme"
                className="mt-6 w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <MaterialIcon icon="lock" className="text-xl" />
                Ödemeye Geç
              </Link>

              <Link
                href="/"
                className="mt-3 w-full py-3 border border-gray-200 text-primary rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <MaterialIcon icon="arrow_back" className="text-lg" />
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
