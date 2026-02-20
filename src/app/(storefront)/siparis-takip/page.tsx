"use client";

import { useState } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function SiparisTakipPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <MaterialIcon icon="chevron_right" className="text-base" />
          <span className="text-primary">Sipariş Takip</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-[family-name:var(--font-display)] mb-8 text-center">
          Sipariş Takip
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-10">
          <label className="block text-sm font-medium text-primary mb-2">
            Sipariş Numaranız
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MaterialIcon
                icon="tag"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Örn: ORD-2026-00123"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <MaterialIcon icon="search" className="text-xl" />
              Sorgula
            </button>
          </div>
        </form>

        {/* Tracking Status Placeholder */}
        {searched && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-primary">Sipariş #{orderNumber}</h2>
                  <p className="text-sm text-gray-400 mt-1">19 Şubat 2026 tarihinde oluşturuldu</p>
                </div>
                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-full">
                  Kargoya Verildi
                </span>
              </div>

              {/* Status Steps */}
              <div className="space-y-0">
                {[
                  { icon: "check_circle", label: "Sipariş Alındı", date: "19 Şub 10:30", active: true },
                  { icon: "check_circle", label: "Hazırlanıyor", date: "19 Şub 14:00", active: true },
                  { icon: "check_circle", label: "Kargoya Verildi", date: "20 Şub 09:15", active: true },
                  { icon: "radio_button_unchecked", label: "Teslim Edildi", date: "", active: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <MaterialIcon
                        icon={step.icon}
                        className={`text-2xl ${step.active ? "text-green-500" : "text-gray-300"}`}
                      />
                      {i < 3 && (
                        <div className={`w-0.5 h-8 ${step.active ? "bg-green-500" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`font-medium ${step.active ? "text-primary" : "text-gray-400"}`}>
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Not Searched State */}
        {!searched && (
          <div className="text-center py-12 text-gray-400">
            <MaterialIcon icon="local_shipping" className="text-6xl mb-4" />
            <p>Sipariş numaranızı girerek kargonuzu takip edebilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
