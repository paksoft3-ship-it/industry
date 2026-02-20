"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface AccountDropdownProps {
  isLoggedIn: boolean;
  userName?: string;
}

export default function AccountDropdown({ isLoggedIn, userName }: AccountDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center justify-center p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors group"
      >
        <MaterialIcon icon="person" className="group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-medium mt-0.5 hidden sm:block">
          {isLoggedIn ? "Hesabım" : "Giriş Yap"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {isLoggedIn ? (
            <>
              <div className="px-5 py-4 bg-gray-50 border-b">
                <p className="font-bold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-400">Hesap Paneli</p>
              </div>
              <nav className="py-2">
                <Link href="/hesap" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary" onClick={() => setIsOpen(false)}>
                  <MaterialIcon icon="dashboard" className="text-[20px]" /> Hesap Özeti
                </Link>
                <Link href="/hesap/siparisler" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary" onClick={() => setIsOpen(false)}>
                  <MaterialIcon icon="receipt_long" className="text-[20px]" /> Siparişlerim
                </Link>
                <Link href="/favoriler" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary" onClick={() => setIsOpen(false)}>
                  <MaterialIcon icon="favorite" className="text-[20px]" /> Favorilerim
                </Link>
                <Link href="/hesap/adresler" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary" onClick={() => setIsOpen(false)}>
                  <MaterialIcon icon="location_on" className="text-[20px]" /> Adreslerim
                </Link>
              </nav>
              <div className="border-t px-5 py-3">
                <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium">
                  <MaterialIcon icon="logout" className="text-[20px]" /> Çıkış Yap
                </button>
              </div>
            </>
          ) : (
            <div className="p-5 space-y-4">
              <div className="text-center">
                <MaterialIcon icon="account_circle" className="text-5xl text-gray-300" />
                <p className="text-sm text-gray-500 mt-2">Hesabınıza giriş yapın</p>
              </div>
              <Link
                href="/uye-girisi-sayfasi"
                className="block w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg text-center hover:bg-primary-dark transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Giriş Yap
              </Link>
              <Link
                href="/uye-girisi-sayfasi?tab=register"
                className="block w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg text-center hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
