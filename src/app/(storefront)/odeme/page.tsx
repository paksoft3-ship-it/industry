"use client";

import { useState } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

const steps = [
  { key: "address", label: "Adres", icon: "location_on" },
  { key: "shipping", label: "Kargo", icon: "local_shipping" },
  { key: "payment", label: "Ödeme", icon: "credit_card" },
  { key: "review", label: "Onay", icon: "check_circle" },
];

export default function OdemePage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <Link href="/sepet" className="hover:text-primary">Sepet</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Ödeme</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8">
          Ödeme
        </h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center">
              <button
                onClick={() => setCurrentStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === currentStep
                    ? "bg-primary text-white"
                    : i < currentStep
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <MaterialIcon icon={i < currentStep ? "check" : step.icon} className="text-lg" />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-1 ${i < currentStep ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              {/* Step 0: Address */}
              {currentStep === 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-6">Teslimat Adresi</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">Ad</label>
                        <input type="text" placeholder="Adınız" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">Soyad</label>
                        <input type="text" placeholder="Soyadınız" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">Adres</label>
                      <textarea rows={3} placeholder="Açık adresiniz" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">İl</label>
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                          <option value="">İl seçin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">İlçe</label>
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                          <option value="">İlçe seçin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">Posta Kodu</label>
                        <input type="text" placeholder="34000" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">Telefon</label>
                      <input type="tel" placeholder="0(5XX) XXX XX XX" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-6">Kargo Seçimi</h2>
                  <div className="space-y-3">
                    {[
                      { name: "Standart Kargo", time: "3-5 iş günü", price: "Ücretsiz", selected: true },
                      { name: "Hızlı Kargo", time: "1-2 iş günü", price: "49,90 TL", selected: false },
                    ].map((option, i) => (
                      <label
                        key={i}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          option.selected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${option.selected ? "border-primary" : "border-gray-300"}`}>
                            {option.selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                          <div>
                            <p className="font-medium text-primary">{option.name}</p>
                            <p className="text-sm text-gray-400">{option.time}</p>
                          </div>
                        </div>
                        <span className={`font-semibold ${option.price === "Ücretsiz" ? "text-green-600" : "text-primary"}`}>
                          {option.price}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-6">Ödeme Bilgileri</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">Kart Üzerindeki İsim</label>
                      <input type="text" placeholder="Ad Soyad" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">Kart Numarası</label>
                      <div className="relative">
                        <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                        <MaterialIcon icon="credit_card" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">Son Kullanma</label>
                        <input type="text" placeholder="AA/YY" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1">CVV</label>
                        <input type="text" placeholder="XXX" className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-6">Sipariş Onayı</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Teslimat Adresi</h3>
                      <p className="text-primary text-sm">Adres bilgileri burada gösterilecek</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Kargo</h3>
                      <p className="text-primary text-sm">Standart Kargo - 3-5 iş günü</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Ödeme</h3>
                      <p className="text-primary text-sm">**** **** **** 1234</p>
                    </div>
                    <label className="flex items-start gap-2 mt-4">
                      <input type="checkbox" className="mt-1 rounded border-gray-300" />
                      <span className="text-sm text-gray-500">
                        <Link href="/sayfa/mesafeli-satis-sozlesmesi" className="text-primary underline">Mesafeli Satış Sözleşmesi</Link>&apos;ni
                        ve <Link href="/sayfa/gizlilik-politikasi" className="text-primary underline">Gizlilik Politikası</Link>&apos;nı okudum, kabul ediyorum.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  className={`flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-primary transition-colors ${currentStep === 0 ? "invisible" : ""}`}
                >
                  <MaterialIcon icon="arrow_back" className="text-lg" />
                  Geri
                </button>
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    className="flex items-center gap-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Devam Et
                    <MaterialIcon icon="arrow_forward" className="text-lg" />
                  </button>
                ) : (
                  <Link
                    href="/siparis/tesekkurler"
                    className="flex items-center gap-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    <MaterialIcon icon="lock" className="text-lg" />
                    Siparişi Onayla
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-4">
              <h2 className="font-semibold text-primary text-lg mb-4">Sipariş Özeti</h2>
              <div className="space-y-3 mb-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <MaterialIcon icon="image" className="text-lg text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">Ürün {i}</p>
                      <p className="text-xs text-gray-400">x{i}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">{(i * 450).toLocaleString("tr-TR")} TL</span>
                  </div>
                ))}
              </div>
              <hr className="border-gray-100 mb-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Ara Toplam</span>
                  <span>1.350,00 TL</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Kargo</span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-primary font-bold text-lg">
                  <span>Toplam</span>
                  <span>1.350,00 TL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
