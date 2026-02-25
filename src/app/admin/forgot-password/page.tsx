"use client";

import { useState } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { requestPasswordReset } from "@/lib/actions/auth";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d121c] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 mb-4">
            <MaterialIcon icon="lock_reset" className="text-primary text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)] tracking-tight">
            Şifremi Unuttum
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            E-posta adresinize sıfırlama bağlantısı göndereceğiz
          </p>
        </div>

        <div className="bg-[#161d2d] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {submitted ? (
            /* Success state — always shown regardless of whether email exists */
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-2">
                <MaterialIcon icon="mark_email_read" className="text-green-400 text-2xl" />
              </div>
              <p className="text-white font-medium">Bağlantı Gönderildi</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Eğer bu e-posta adresi sistemimizde kayıtlıysa, şifre sıfırlama bağlantısı birkaç dakika
                içinde iletilecektir. Lütfen spam klasörünüzü de kontrol edin.
              </p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <MaterialIcon icon="arrow_back" className="text-base" />
                Giriş sayfasına dön
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <MaterialIcon
                    icon="mail"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sirket.com"
                    required
                    autoComplete="email"
                    className="w-full bg-[#0d121c] border border-white/10 text-white placeholder-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                {loading ? (
                  <>
                    <MaterialIcon icon="progress_activity" className="text-lg animate-spin" />
                    Gönderiliyor…
                  </>
                ) : (
                  <>
                    <MaterialIcon icon="send" className="text-lg" />
                    Sıfırlama Bağlantısı Gönder
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <Link
                  href="/admin/login"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-1"
                >
                  <MaterialIcon icon="arrow_back" className="text-sm" />
                  Giriş sayfasına dön
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
