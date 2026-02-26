"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function GuestCheckoutGate() {
  const router = useRouter();
  const [guestEmail, setGuestEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleGuestContinue = () => {
    if (!guestEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      setEmailError("Geçerli bir e-posta adresi giriniz.");
      return;
    }
    setEmailError("");
    router.push(`/odeme?guestEmail=${encodeURIComponent(guestEmail.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <Link href="/sepet" className="hover:text-primary">Sepet</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Ödeme</span>
        </nav>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-2 text-center">
            Nasıl Devam Etmek İstersiniz?
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Siparişinizi tamamlamak için bir seçenek belirleyin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Option 1: Sign In */}
            <Link
              href="/uye-girisi-sayfasi?callbackUrl=/odeme"
              className="group flex flex-col items-center text-center p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <MaterialIcon icon="login" className="text-primary text-2xl" />
              </div>
              <h2 className="font-bold text-primary text-base mb-2 font-[family-name:var(--font-display)]">
                Giriş Yapın
              </h2>
              <p className="text-sm text-gray-500">
                Hesabınız varsa giriş yaparak hızlıca ödeme yapın.
              </p>
              <span className="mt-4 text-xs font-medium text-primary flex items-center gap-1">
                Giriş yap <MaterialIcon icon="arrow_forward" className="text-sm" />
              </span>
            </Link>

            {/* Option 2: Guest Checkout */}
            <div className="flex flex-col items-center text-center p-6 bg-white border-2 border-secondary/40 rounded-xl shadow-sm">
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <MaterialIcon icon="person_outline" className="text-secondary text-2xl" />
              </div>
              <h2 className="font-bold text-primary text-base mb-2 font-[family-name:var(--font-display)]">
                Misafir Olarak Devam Et
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Hesap oluşturmadan alışveriş yapın.
              </p>
              <div className="w-full space-y-2">
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => { setGuestEmail(e.target.value); setEmailError(""); }}
                  placeholder="E-posta adresiniz"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                  onKeyDown={(e) => e.key === "Enter" && handleGuestContinue()}
                />
                {emailError && (
                  <p className="text-xs text-red-500 text-left">{emailError}</p>
                )}
                <button
                  onClick={handleGuestContinue}
                  className="w-full py-2.5 bg-secondary text-white rounded-lg text-sm font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1"
                >
                  Devam Et
                  <MaterialIcon icon="arrow_forward" className="text-sm" />
                </button>
              </div>
            </div>

            {/* Option 3: Create Account */}
            <Link
              href="/uye-girisi-sayfasi?callbackUrl=/odeme#kayit"
              className="group flex flex-col items-center text-center p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <MaterialIcon icon="person_add" className="text-green-600 text-2xl" />
              </div>
              <h2 className="font-bold text-primary text-base mb-2 font-[family-name:var(--font-display)]">
                Hesap Oluşturun
              </h2>
              <p className="text-sm text-gray-500">
                Yeni hesap oluşturun, siparişlerinizi takip edin.
              </p>
              <span className="mt-4 text-xs font-medium text-green-600 flex items-center gap-1">
                Kayıt ol <MaterialIcon icon="arrow_forward" className="text-sm" />
              </span>
            </Link>
          </div>

          {/* Back to cart */}
          <div className="text-center mt-8">
            <Link
              href="/sepet"
              className="text-sm text-gray-500 hover:text-primary flex items-center justify-center gap-1"
            >
              <MaterialIcon icon="arrow_back" className="text-base" />
              Sepete Geri Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
