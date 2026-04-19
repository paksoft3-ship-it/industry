"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useCart } from "@/context/CartContext";
import { placeOrder, type PlaceOrderResult } from "@/lib/actions/orders";
import { TURKIYE_ILLER } from "@/data/turkiyeIller";

const steps = [
  { key: "address", label: "Adres",  icon: "location_on"    },
  { key: "payment", label: "Ödeme",  icon: "account_balance" },
  { key: "review",  label: "Onay",   icon: "check_circle"   },
];

type PaymentMethod = "iyzico" | "havale-eft";

type AddressForm = {
  firstName: string; lastName: string; phone: string;
  address: string; city: string; district: string; postalCode: string;
};

const emptyAddress: AddressForm = {
  firstName: "", lastName: "", phone: "", address: "",
  city: "", district: "", postalCode: "",
};

const BANK_INFO = [
  { label: "Firma Adı",    value: "SİVTECH MAKİNA İMALAT İTHALAT İHRACAT TİC. VE SAN. LTD. ŞTİ." },
  { label: "Banka",        value: "Kuveyt Türk Bankası" },
  { label: "Para Birimi",  value: "Türk Lirası (TL)" },
  { label: "IBAN",         value: "TR10 0020 5000 0984 4795 3000 01" },
];

interface OdemeClientProps {
  guestEmail?: string;
}

export default function OdemeClient({ guestEmail }: OdemeClientProps) {
  const router = useRouter();
  const { items, count } = useCart();
  const [isPending, startTransition] = useTransition();
  const iyzicoFormRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState<AddressForm>(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("iyzico");
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [iyzicoFormHtml, setIyzicoFormHtml] = useState<string | null>(null);
  const [iyzicoLoading, setIyzicoLoading] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

  const isGuest = !!guestEmail;
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = subtotal >= 2000 ? 0 : 49.90;
  const total = subtotal + shippingCost;

  const selectedIl = TURKIYE_ILLER.find((il) => il.name === addr.city);
  const ilceler = selectedIl?.ilceler ?? [];

  const setField = (key: keyof AddressForm, val: string) =>
    setAddr((prev) => ({ ...prev, [key]: val }));

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

  // Inject iyzico checkout form HTML and execute its scripts
  useEffect(() => {
    if (iyzicoFormHtml && iyzicoFormRef.current) {
      iyzicoFormRef.current.innerHTML = iyzicoFormHtml;
      // Execute any <script> tags in the injected HTML
      const scripts = iyzicoFormRef.current.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [iyzicoFormHtml]);

  const handlePlaceOrder = () => {
    if (!termsAccepted) { setError("Sözleşmeyi kabul etmelisiniz."); return; }
    setError("");
    startTransition(async () => {
      const result: PlaceOrderResult = await placeOrder({
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
        guestEmail: isGuest ? guestEmail : undefined,
        paymentMethod,
      });

      if (!result.ok) { setError(result.error); return; }

      if (paymentMethod === "havale-eft") {
        router.push(`/siparis/tesekkurler?no=${result.orderNumber}&total=${result.total}&method=havale`);
        return;
      }

      // iyzico: initialize payment form
      setIyzicoLoading(true);
      try {
        const res = await fetch("/api/payment/iyzico/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: result.orderId }),
        });
        const data = await res.json();
        if (!res.ok || !data.checkoutFormContent) {
          setError(data.error || "iyzico ödeme formu başlatılamadı.");
          setIyzicoLoading(false);
          return;
        }
        setIyzicoFormHtml(data.checkoutFormContent);
        setStep(3); // special iyzico form step
      } catch {
        setError("Ödeme başlatılırken bir hata oluştu.");
      } finally {
        setIyzicoLoading(false);
      }
    });
  };

  const copyIban = () => {
    navigator.clipboard.writeText("TR100020500009844795300001");
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  if (count === 0 && !isPending && step !== 3) {
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

  const inputCls = "w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm";
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

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)]">
            Ödeme
          </h1>
          {isGuest && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <MaterialIcon icon="person_outline" className="text-base text-gray-400" />
              <span>Misafir: <span className="font-medium text-primary">{guestEmail}</span></span>
            </div>
          )}
        </div>

        {/* Step Indicator — hidden on iyzico form step */}
        {step < 3 && (
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
        )}

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 max-w-2xl">
            <MaterialIcon icon="error" className="text-lg flex-shrink-0" />
            {error}
          </div>
        )}

        {/* iyzico checkout form (step 3) */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                  <MaterialIcon icon="credit_card" className="text-primary text-xl" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">Kart Bilgilerini Girin</h2>
                  <p className="text-xs text-gray-400">iyzico güvenli ödeme altyapısı</p>
                </div>
                <Image
                  src="/images/iyzico-logo-pack/checkout_iyzico_ile_ode/TR/Tr_Colored/iyzico_ile_ode_colored.svg"
                  alt="iyzico"
                  width={100}
                  height={32}
                  className="ml-auto h-8 w-auto"
                />
              </div>
              {iyzicoLoading ? (
                <div className="flex items-center justify-center py-16">
                  <MaterialIcon icon="progress_activity" className="text-4xl text-primary animate-spin" />
                </div>
              ) : (
                <div ref={iyzicoFormRef} id="iyzico-checkout-form" />
              )}
              <button
                onClick={() => { setStep(2); setIyzicoFormHtml(null); }}
                className="mt-4 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                <MaterialIcon icon="arrow_back" className="text-base" />
                Geri dön
              </button>
            </div>
          </div>
        )}

        {step < 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Area */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6">

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
                          <select value={addr.city} onChange={(e) => { setField("city", e.target.value); setField("district", ""); }} className={inputCls}>
                            <option value="">İl seçin</option>
                            {TURKIYE_ILLER.map((il) => (
                              <option key={il.name} value={il.name}>{il.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>İlçe</label>
                          <select value={addr.district} onChange={(e) => setField("district", e.target.value)} disabled={!addr.city} className={`${inputCls} disabled:opacity-50`}>
                            <option value="">İlçe seçin</option>
                            {ilceler.map((ilce) => (
                              <option key={ilce} value={ilce}>{ilce}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Posta Kodu <span className="text-gray-400 font-normal text-xs">(opsiyonel)</span></label>
                          <input type="text" value={addr.postalCode} onChange={(e) => setField("postalCode", e.target.value)} placeholder="34000" className={inputCls} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 1: Payment Method ── */}
                {step === 1 && (
                  <div>
                    <h2 className="text-lg font-semibold text-primary mb-6">Ödeme Yöntemi</h2>
                    <div className="space-y-3 mb-6">
                      {/* iyzico — credit/debit card */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("iyzico")}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          paymentMethod === "iyzico"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "iyzico" ? "border-primary" : "border-gray-300"}`}>
                          {paymentMethod === "iyzico" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <MaterialIcon icon="credit_card" className={`text-xl ${paymentMethod === "iyzico" ? "text-primary" : "text-gray-400"}`} />
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${paymentMethod === "iyzico" ? "text-primary" : "text-gray-700"}`}>
                            Kredi / Banka Kartı
                          </p>
                          <p className="text-xs text-gray-400">iyzico güvenli ödeme • Visa, Mastercard, Troy</p>
                        </div>
                        <Image
                          src="/images/iyzico-logo-pack/checkout_iyzico_ile_ode/TR/Tr_Colored/iyzico_ile_ode_colored.svg"
                          alt="iyzico"
                          width={80}
                          height={26}
                          className="h-6 w-auto"
                        />
                      </button>

                      {/* Havale / EFT */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("havale-eft")}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          paymentMethod === "havale-eft"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "havale-eft" ? "border-primary" : "border-gray-300"}`}>
                          {paymentMethod === "havale-eft" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <MaterialIcon icon="account_balance" className={`text-xl ${paymentMethod === "havale-eft" ? "text-primary" : "text-gray-400"}`} />
                        <div>
                          <p className={`font-semibold text-sm ${paymentMethod === "havale-eft" ? "text-primary" : "text-gray-700"}`}>
                            Havale / EFT
                          </p>
                          <p className="text-xs text-gray-400">Banka transferi • Kuveyt Türk</p>
                        </div>
                      </button>
                    </div>

                    {/* Bank info — shown when havale selected */}
                    {paymentMethod === "havale-eft" && (
                      <div className="space-y-3">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
                          <MaterialIcon icon="info" className="text-blue-500 text-lg mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-700">
                            Sipariş oluşturduktan sonra aşağıdaki hesaba ödeme yapınız.
                            Açıklama kısmına <strong>sipariş numaranızı</strong> yazmayı unutmayınız.
                          </p>
                        </div>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
                            <p className="text-sm font-semibold text-primary">Banka Hesap Bilgileri</p>
                            <span className="text-xs text-gray-400">Kuveyt Türk</span>
                          </div>
                          <div className="divide-y divide-gray-100">
                            {BANK_INFO.map((row) => (
                              <div key={row.label} className="flex items-center justify-between px-4 py-3">
                                <span className="text-sm text-gray-500 flex-shrink-0">{row.label}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium text-primary text-right ${row.label === "IBAN" ? "font-mono" : ""}`}>
                                    {row.value}
                                  </span>
                                  {row.label === "IBAN" && (
                                    <button
                                      onClick={copyIban}
                                      title="Kopyala"
                                      className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                      <MaterialIcon icon={copiedIban ? "check" : "content_copy"} className="text-base" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          * Ödemeniz onaylandıktan sonra siparişiniz hazırlanmaya başlanacaktır. Onay 1–2 iş günü içinde gerçekleşir.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Step 2: Review ── */}
                {step === 2 && (
                  <div>
                    <h2 className="text-lg font-semibold text-primary mb-6">Sipariş Onayı</h2>
                    <div className="space-y-4">
                      {isGuest && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Sipariş E-posta</h3>
                          <p className="text-primary text-sm font-medium">{guestEmail}</p>
                        </div>
                      )}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Teslimat Adresi</h3>
                        <p className="text-primary text-sm font-medium">{addr.firstName} {addr.lastName}</p>
                        <p className="text-gray-600 text-sm">{addr.address}</p>
                        <p className="text-gray-600 text-sm">{addr.district} / {addr.city}{addr.postalCode ? ` — ${addr.postalCode}` : ""}</p>
                        <p className="text-gray-500 text-sm">{addr.phone}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Ödeme Yöntemi</h3>
                        {paymentMethod === "iyzico" ? (
                          <p className="text-primary text-sm flex items-center gap-2">
                            <MaterialIcon icon="credit_card" className="text-base" />
                            Kredi / Banka Kartı (iyzico)
                          </p>
                        ) : (
                          <p className="text-primary text-sm flex items-center gap-2">
                            <MaterialIcon icon="account_balance" className="text-base" />
                            Havale / EFT — Kuveyt Türk
                          </p>
                        )}
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
                      disabled={isPending || iyzicoLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {(isPending || iyzicoLoading) ? (
                        <>
                          <MaterialIcon icon="progress_activity" className="text-lg animate-spin" />
                          {paymentMethod === "iyzico" ? "Ödeme Başlatılıyor..." : "Sipariş Oluşturuluyor..."}
                        </>
                      ) : (
                        <>
                          <MaterialIcon icon={paymentMethod === "iyzico" ? "credit_card" : "lock"} className="text-lg" />
                          {paymentMethod === "iyzico" ? "Kartla Öde" : "Siparişi Onayla"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-white rounded-lg border border-gray-100 p-6 lg:sticky lg:top-4">
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
                {/* Security badges */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-3 text-gray-400">
                  <MaterialIcon icon="lock" className="text-sm" />
                  <span className="text-xs">256-bit SSL şifreleme</span>
                  <MaterialIcon icon="verified_user" className="text-sm" />
                  <span className="text-xs">3D Secure</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
