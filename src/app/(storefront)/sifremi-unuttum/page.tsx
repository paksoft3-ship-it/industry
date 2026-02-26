"use client";

import { useState } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { requestCustomerPasswordReset } from "@/lib/actions/auth";

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestCustomerPasswordReset(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <Link href="/uye-girisi-sayfasi" className="hover:text-primary">Üye Girişi</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Şifremi Unuttum</span>
        </nav>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                <MaterialIcon icon="lock_reset" className="text-xl text-primary" />
              </div>
              <h1 className="text-xl font-bold text-primary font-[family-name:var(--font-display)]">
                Şifremi Unuttum
              </h1>
            </div>

            {sent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <MaterialIcon icon="mark_email_read" className="text-3xl text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-primary mb-2">E-posta Gönderildi</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.
                  Gelen kutunuzu kontrol edin.
                </p>
                <Link
                  href="/uye-girisi-sayfasi"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <MaterialIcon icon="arrow_back" className="text-base" />
                  Giriş sayfasına dön
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-6">
                  Kayıtlı e-posta adresinizi girin; şifre sıfırlama bağlantısını göndereceğiz.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">E-posta</label>
                    <div className="relative">
                      <MaterialIcon icon="mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@email.com"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <MaterialIcon icon="progress_activity" className="text-xl animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <MaterialIcon icon="send" className="text-xl" />
                        Sıfırlama Bağlantısı Gönder
                      </>
                    )}
                  </button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-6">
                  <Link href="/uye-girisi-sayfasi" className="text-primary hover:underline">
                    Giriş sayfasına dön
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
