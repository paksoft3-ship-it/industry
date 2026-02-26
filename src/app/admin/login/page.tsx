"use client";

import { Suspense, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const resetSuccess = searchParams.get("reset") === "success";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-posta veya şifre hatalı.");
        return;
      }

      // Verify that the authenticated user is actually an admin
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        // User exists but is not an admin — sign them out immediately
        await signOut({ redirect: false });
        setError("Bu hesabın yönetici paneline erişim izni yok.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d121c] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center pt-12 pb-2">
          <a
            href="https://www.paksoft.com.tr/tr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:scale-105 transition-transform duration-500"
          >
            <div className="relative w-64 h-28 mx-auto">
              <Image
                src="/images/paksoft_logo_white.png?v=2"
                alt="PakSoft"
                fill
                className="object-contain"
                priority
              />
            </div>
          </a>
          <div className="mt-8">
            <a
              href="https://www.paksoft.com.tr/tr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group"
            >
              <h1 className="text-4xl font-black text-white font-[family-name:var(--font-display)] tracking-tight group-hover:text-amber-500 transition-colors">
                Geliştiren PakSoft
              </h1>
            </a>
            <div className="h-px w-12 bg-white/20 mx-auto mt-6" />
            <h2 className="text-lg font-medium text-gray-400 uppercase tracking-[0.3em] mt-6">
              Yönetici Paneli
            </h2>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#161d2d] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {resetSuccess && (
            <div className="mb-5 flex items-start gap-3 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
              <MaterialIcon icon="check_circle" className="text-lg flex-shrink-0 mt-0.5" />
              <span>Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.</span>
            </div>
          )}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              <MaterialIcon icon="error_outline" className="text-lg flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <MaterialIcon
                  icon="lock"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#0d121c] border border-white/10 text-white placeholder-gray-600 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  <MaterialIcon icon={showPassword ? "visibility_off" : "visibility"} className="text-[18px]" />
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Link
                href="/admin/forgot-password"
                className="text-xs text-gray-500 hover:text-primary transition-colors"
              >
                Şifremi unuttum
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <MaterialIcon icon="progress_activity" className="text-lg animate-spin" />
                  Giriş yapılıyor…
                </>
              ) : (
                <>
                  <MaterialIcon icon="login" className="text-lg" />
                  Giriş Yap
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <p className="text-center mt-6 text-xs text-gray-600">
          <Link href="/" className="hover:text-gray-400 transition-colors inline-flex items-center gap-1">
            <MaterialIcon icon="arrow_back" className="text-sm" />
            Siteye dön
          </Link>
        </p>
      </div>
    </div>
  );
}
