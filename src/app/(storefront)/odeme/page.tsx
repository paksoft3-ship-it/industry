"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "@/lib/actions/orders";
import { TURKIYE_ILLER } from "@/data/turkiyeIller";

const steps = [
  { key: "address", label: "Adres",  icon: "location_on"    },
  { key: "payment", label: "Ödeme",  icon: "account_balance" },
  { key: "review",  label: "Onay",   icon: "check_circle"   },
];

type AddressForm = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
};

const emptyAddress: AddressForm = {
  firstName: "", lastName: "", phone: "", address: "",
  city: "", district: "", postalCode: "",
};

export default function OdemePage() {
  const router = useRouter();
  const { items, count } = useCart();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState<AddressForm>(emptyAddress);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = subtotal >= 2000 ? 0 : 49.90;
  const total = subtotal + shippingCost;

  const selectedIl = TURKIYE_ILLER.find((il) => il.name === addr.city);
  const ilceler = selectedIl?.ilceler ?? [];

  const setField = (key: keyof AddressForm, value: string) =>
    setAddr((prev) => ({ ...prev, [key]: value }));

  const validateAddress = () => {
    if (!addr.firstName.trim()) return "Ad alanı zorunludur.";
    if (!addr.lastName.trim()) return "Soyad alanı zorunludur.";
    if (!addr.phone.trim()) return "Telefon alanı zorunludur.";
    if (!addr.address.trim()) return "Adres alanı zorunludur.";
    if (!addr.city) return "İl seçimi zorunludur.";
    if (!addr.district) return "İlçe seçimi zorunludur.";
    return null;
  };

  const handleNextStep = () => {
    if (step === 0) {
      const err = validateAddress();
      if (err) { setError(err); return; }
    }
    setError("");
    setStep((s) => s + 1);
  };

  const handlePlaceOrder = () => {
    if (!termsAccepted) { setError("Sözleşmeyi kabul etmelisiniz."); return; }
    setError("");
    startTransition(async () => {
      try {
        const result = await placeOrder({
          address: {
            title: "Teslimat Adresim",
            firstName: addr.firstName,
            lastName: addr.lastName,
            phone: addr.phone,
            city: addr.city,
            district: addr.district,
            address: addr.address,
            postalCode: addr.postalCode || undefined,
          },
        });
        router.push(`/siparis/tesekkurler?no=${result.orderNumber}&total=${result.total}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sipariş oluşturulamadı.");
      }
    });
  };

  if (count === 0 && !isPending) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <MaterialIcon icon="shopping_cart" className="text-6xl text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">Sepetiniz boş.</p>
          <Link href="/" className="text-primary hover:underline text-sm">Alışverişe devam et</Link>
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
  const labelCls = "block text-sm font-medium text-primary mb-1";

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

        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8">
          Ödeme
        </h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                i === step ? "bg-primary text-white" :
                i < step ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
              }`}>
                <MaterialIcon icon={i < step ? "check" : s.icon} className="text-lg" />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-1 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 max-w-2xl">
            <MaterialIcon icon="error" className="text-lg flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-100 p-6">

              {/* ── Step 0: Address ── */}
              {step === 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-6">Teslimat Adresi</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Ad</label>
                        <input type="text" value={addr.firstName} onChange={(e) => setField("firstName", e.target.value)} placeholder="Adınız" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Soyad</label>
                        <input type="text" value={addr.lastName} onChange={(e) => setField("lastName", e.target.value)} placeholder="Soyadınız" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Telefon</label>
                      <input type="tel" value={addr.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="0(5XX) XXX XX XX" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Açık Adres</label>
                      <textarea rows={3} value={addr.address} onChange={(e) => setField("address", e.target.value)} placeholder="Mahalle, cadde, sokak, bina no, daire no..." className={`${inputCls} resize-none`} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className={labelCls}>İl</label>
                        <select
                          value={addr.city}
                          onChange={(e) => {
                            setField("city", e.target.value);
                            setField("district", "");
                          }}
                          className={inputCls}
                        >
                          <option value="">İl seçin</option>
                          {TURKIYE_ILLER.map((il) => (
                            <option key={il.name} value={il.name}>{il.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>İlçe</label>
                        <select
                          value={addr.district}
                          onChange={(e) => setField("district", e.target.value)}
                          disabled={!addr.city}
                          className={`${inputCls} disabled:opacity-50`}
                        >
                          <option value="">İlçe seçin</option>
                          {ilceler.map((ilce) => (
                            <option key={ilce} value={ilce}>{ilce}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Posta Kodu <span className="text-gray-400 font-normal text-xs">(isteğe bağlı)</span></label>
                        <input type="text" value={addr.postalCode} onChange={(e) => setField("postalCode", e.target.value)} placeholder="34000" className={inputCls} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 1: Payment (EFT/Havale only) ── */}
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-6">Ödeme Yöntemi</h2>

                  {/* Havale/EFT card — selected by default, only option */}
                  <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-primary bg-primary/5 mb-6">
                    <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                    <MaterialIcon icon="account_balance" className="text-primary text-xl" />
                    <div>
                      <p className="font-medium text-primary text-sm">Havale / EFT</p>
                      <p className="text-xs text-gray-400">Banka transferi ile ödeme</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
                      <MaterialIcon icon="info" className="text-blue-500 text-lg mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-700">
                        Siparişiniz oluşturulduktan sonra aşağıdaki banka hesabına ödeme yapınız.
                        Havale açıklamasına <strong>sipariş numaranızı</strong> yazmayı unutmayınız.
                      </p>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-primary">Banka Hesap Bilgileri</p>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {[
                          { label: "Banka",        value: "Ziraat Bankası" },
                          { label: "Hesap Sahibi", value: "SivTech Makina Ltd. Şti." },
                          { label: "IBAN",         value: "TR00 0000 0000 0000 0000 0000 00" },
                          { label: "Şube",         value: "İstanbul / Merkez" },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center justify-between px-4 py-3">
                            <span className="text-sm text-gray-500">{row.label}</span>
                            <span className="text-sm font-medium text-primary">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      * Ödemeniz onaylandıktan sonra siparişiniz hazırlanmaya başlanacaktır. Ödeme onayı 1-2 iş günü içinde gerçekleşir.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Step 2: Review ── */}
              {step === 2 && (
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-6">Sipariş Onayı</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Teslimat Adresi</h3>
                      <p className="text-primary text-sm font-medium">{addr.firstName} {addr.lastName}</p>
                      <p className="text-gray-600 text-sm">{addr.address}</p>
                      <p className="text-gray-600 text-sm">{addr.district} / {addr.city}{addr.postalCode ? ` — ${addr.postalCode}` : ""}</p>
                      <p className="text-gray-500 text-sm">{addr.phone}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Ödeme Yöntemi</h3>
                      <p className="text-primary text-sm flex items-center gap-2">
                        <MaterialIcon icon="account_balance" className="text-base" />
                        Havale / EFT — Ziraat Bankası
                      </p>
                    </div>
                    <label className="flex items-start gap-2 mt-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 rounded border-gray-300"
                      />
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
                  onClick={() => { setError(""); setStep((s) => s - 1); }}
                  className={`flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-primary transition-colors ${step === 0 ? "invisible" : ""}`}
                >
                  <MaterialIcon icon="arrow_back" className="text-lg" />
                  Geri
                </button>
                {step < steps.length - 1 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Devam Et
                    <MaterialIcon icon="arrow_forward" className="text-lg" />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPending}
                    className="flex items-center gap-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <MaterialIcon icon="progress_activity" className="text-lg animate-spin" />
                        Sipariş Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <MaterialIcon icon="lock" className="text-lg" />
                        Siparişi Onayla
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-4">
              <h2 className="font-semibold text-primary text-lg mb-4">Sipariş Özeti</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-gray-50 flex items-center justify-center flex-shrink-0 p-1 overflow-hidden">
                      <Image src={item.image} alt={item.name} width={44} height={44} className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-primary flex-shrink-0">
                      {(item.price * item.quantity).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="border-gray-100 mb-3" />
              <div className="space-y-2 text-sm">
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
                {subtotal < 2000 && subtotal > 0 && (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
