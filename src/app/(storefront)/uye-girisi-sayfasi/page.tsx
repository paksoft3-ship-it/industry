"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function UyeGirisiPage() {
  return (
    <Suspense>
      <UyeGirisiContent />
    </Suspense>
  );
}

function UyeGirisiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setLoginError("E-posta veya şifre hatalı.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setLoginError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement register
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Üye Girişi</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Login Form */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                <MaterialIcon icon="login" className="text-xl text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary font-[family-name:var(--font-display)]">
                Üye Girişi
              </h2>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <MaterialIcon icon="error" className="text-lg" />
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">E-posta</label>
                <div className="relative">
                  <MaterialIcon icon="mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Şifre</label>
                <div className="relative">
                  <MaterialIcon icon="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Şifreniz"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Beni hatırla
                </label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Şifremi unuttum
                </Link>
              </div>
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? (
                  <>
                    <MaterialIcon icon="progress_activity" className="text-xl animate-spin" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    <MaterialIcon icon="login" className="text-xl" />
                    Giriş Yap
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-lg border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                <MaterialIcon icon="person_add" className="text-xl text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary font-[family-name:var(--font-display)]">
                Üye Ol
              </h2>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Ad</label>
                  <input
                    type="text"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="Adınız"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Soyad</label>
                  <input
                    type="text"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Soyadınız"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">E-posta</label>
                <div className="relative">
                  <MaterialIcon icon="mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Şifre</label>
                <div className="relative">
                  <MaterialIcon icon="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="En az 8 karakter"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Şifre Tekrar</label>
                <div className="relative">
                  <MaterialIcon icon="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <label className="flex items-start gap-2 text-sm text-gray-500">
                <input type="checkbox" className="mt-1 rounded border-gray-300" />
                <span>
                  <Link href="/sayfa/kullanim-kosullari" className="text-primary underline">Kullanım Koşulları</Link>&apos;nı
                  ve <Link href="/sayfa/gizlilik-politikasi" className="text-primary underline">Gizlilik Politikası</Link>&apos;nı kabul ediyorum.
                </span>
              </label>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <MaterialIcon icon="person_add" className="text-xl" />
                Üye Ol
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
