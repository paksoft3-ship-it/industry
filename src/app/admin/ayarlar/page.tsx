"use client";
import { useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function AdminAyarlarPage() {
  const [form, setForm] = useState({
    siteName: "CNC Otomasyon",
    siteDescription: "Endüstriyel Otomasyonda Güvenilir Çözüm Ortağınız",
    phone: "+90 212 555 00 00",
    whatsapp: "+90 555 555 55 55",
    email: "info@cncotomasyon.com",
    address: "İkitelli OSB Mah. Marmara Sanayi Sitesi M Blok No:12 Başakşehir / İstanbul",
    workingHours: "Pzt-Cum: 09:00 - 18:00",
    facebookUrl: "#",
    instagramUrl: "#",
    linkedinUrl: "#",
    youtubeUrl: "#",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">Site Ayarları</h2>
        <p className="text-sm text-gray-500 mt-1">Genel site yapılandırmasını düzenleyin</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Genel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "siteName", label: "Site Adı" },
            { key: "email", label: "E-posta" },
            { key: "phone", label: "Telefon" },
            { key: "whatsapp", label: "WhatsApp" },
            { key: "workingHours", label: "Çalışma Saatleri" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type="text"
                value={form[field.key as keyof typeof form]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site Açıklaması</label>
          <textarea
            value={form.siteDescription}
            onChange={(e) => handleChange("siteDescription", e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
          <textarea
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 pt-4">Sosyal Medya</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "facebookUrl", label: "Facebook URL" },
            { key: "instagramUrl", label: "Instagram URL" },
            { key: "linkedinUrl", label: "LinkedIn URL" },
            { key: "youtubeUrl", label: "YouTube URL" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type="text"
                value={form[field.key as keyof typeof form]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 pt-4">Logo</h3>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <MaterialIcon icon="cloud_upload" className="text-4xl text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">Logo dosyasını buraya sürükleyin veya seçin</p>
          <p className="text-xs text-gray-400 mt-1">PNG, SVG veya JPEG (max 2MB)</p>
        </div>

        <div className="flex justify-end pt-4">
          <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
            <MaterialIcon icon="save" className="text-[20px]" />
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
