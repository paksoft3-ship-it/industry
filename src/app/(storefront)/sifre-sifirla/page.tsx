"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { resetPassword } from "@/lib/actions/auth";

export default function SifreSifirlaPage() {
  return (
    <Suspense>
      <SifreSifirlaContent />
    </Suspense>
  );
}

function SifreSifirlaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <MaterialIcon icon="error" className="text-5xl text-red-400 mb-3" />
          <p className="text-gray-500">Geçersiz veya eksik bağlantı.</p>
          <Link href="/sifremi-unuttum" className="mt-4 inline-block text-primary hover:underline text-sm">
            Yeniden sıfırlama isteyin
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    try {
      const result = await resetPassword(token, password);
      if (result.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/uye-girisi-sayfasi"), 3000);
      } else {
        setError(result.error);
      }
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
          <span className="text-primary">Şifre Sıfırla</span>
        </nav>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                <MaterialIcon icon="lock_reset" className="text-xl text-primary" />
              </div>
              <h1 className="text-xl font-bold text-primary font-[family-name:var(--font-display)]">
                Yeni Şifre Belirle
              </h1>
            </div>

            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <MaterialIcon icon="check_circle" className="text-3xl text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-primary mb-2">Şifre Güncellendi!</h2>
                <p className="text-sm text-gray-500">Giriş sayfasına yönlendiriliyorsunuz...</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                    <MaterialIcon icon="error" className="text-lg" />
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Yeni Şifre</label>
                    <div className="relative">
                      <MaterialIcon icon="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="En az 8 karakter"
                        required
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
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Şifrenizi tekrar girin"
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
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <MaterialIcon icon="save" className="text-xl" />
                        Şifreyi Güncelle
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
