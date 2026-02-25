"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { resetPassword } from "@/lib/actions/auth";

export default function AdminResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <ResetLayout>
        <InvalidToken message="Geçersiz sıfırlama bağlantısı. Lütfen tekrar isteyin." />
      </ResetLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(token, password);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      // Redirect to login with a success flag
      router.push("/admin/login?reset=success");
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResetLayout>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-3 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            <MaterialIcon icon="error_outline" className="text-lg flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* New password */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Yeni Şifre
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
              placeholder="En az 8 karakter"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full bg-[#0d121c] border border-white/10 text-white placeholder-gray-600 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              tabIndex={-1}
            >
              <MaterialIcon
                icon={showPassword ? "visibility_off" : "visibility"}
                className="text-[18px]"
              />
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-600">En az 8 karakter</p>
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Şifre Tekrar
          </label>
          <div className="relative">
            <MaterialIcon
              icon="lock"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifrenizi tekrar girin"
              required
              autoComplete="new-password"
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
              Kaydediliyor…
            </>
          ) : (
            <>
              <MaterialIcon icon="check_circle" className="text-lg" />
              Şifreyi Güncelle
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
    </ResetLayout>
  );
}

function ResetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d121c] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 mb-4">
            <MaterialIcon icon="key" className="text-primary text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-display)] tracking-tight">
            Yeni Şifre Belirle
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Hesabınız için güçlü bir şifre oluşturun
          </p>
        </div>
        <div className="bg-[#161d2d] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

function InvalidToken({ message }: { message: string }) {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-2">
        <MaterialIcon icon="link_off" className="text-red-400 text-2xl" />
      </div>
      <p className="text-white font-medium">Bağlantı Geçersiz</p>
      <p className="text-gray-400 text-sm">{message}</p>
      <Link
        href="/admin/forgot-password"
        className="inline-flex items-center gap-2 mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <MaterialIcon icon="refresh" className="text-base" />
        Yeni bağlantı talep et
      </Link>
    </div>
  );
}
