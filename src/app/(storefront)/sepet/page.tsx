"use client";

import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useCart } from "@/context/CartContext";

export default function SepetPage() {
  const { items, loading, removeItem, updateItem } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 2000 ? 0 : 49.9;
  const total = subtotal + shippingCost;

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
          <span className="text-base font-normal text-gray-400 ml-2">
            ({items.length} ürün)
          </span>
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <MaterialIcon icon="shopping_cart" className="text-7xl mb-4" />
            <p className="text-xl font-medium mb-2">Sepetiniz boş</p>
            <p className="text-sm mb-6">Ürün ekleyerek alışverişe başlayın.</p>
            <Link
              href="/"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg border border-gray-100 p-4 flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 p-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/urun/${item.slug}`} className="font-semibold text-primary hover:underline">
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId)}
                        disabled={loading}
                        className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50 flex-shrink-0"
                      >
                        <MaterialIcon icon="delete" className="text-xl" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateItem(item.productId, item.quantity - 1)}
                          disabled={loading}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <MaterialIcon icon="remove" className="text-lg" />
                        </button>
                        <span className="w-10 h-9 flex items-center justify-center text-sm font-medium text-primary border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.productId, item.quantity + 1)}
                          disabled={loading}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <MaterialIcon icon="add" className="text-lg" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-bold text-primary text-lg">
                        {(item.price * item.quantity).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
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
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-medium">Ücretsiz</span>
                    ) : (
                      <span>{shippingCost.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
                    )}
                  </div>
                  {subtotal < 2000 && (
                    <p className="text-xs text-gray-400">
                      {(2000 - subtotal).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })} daha alışveriş yaparak ücretsiz kargoya ulaşın.
                    </p>
                  )}
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-primary font-bold text-lg">
                    <span>Toplam</span>
                    <span>{total.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}</span>
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
        )}
      </div>
    </div>
  );
}
