"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { updateSettings } from "@/lib/actions/settings";

interface SiteSettings {
  siteName: string | null;
  siteDescription: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  workingHours: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  logoUrl: string | null;
}

export default function AdminAyarlarClient({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    siteName: settings.siteName ?? "",
    siteDescription: settings.siteDescription ?? "",
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    email: settings.email ?? "",
    address: settings.address ?? "",
    workingHours: settings.workingHours ?? "",
    facebookUrl: settings.facebookUrl ?? "",
    instagramUrl: settings.instagramUrl ?? "",
    linkedinUrl: settings.linkedinUrl ?? "",
    youtubeUrl: settings.youtubeUrl ?? "",
    logoUrl: settings.logoUrl ?? "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateSettings(form);
        toast.success("Ayarlar kaydedildi");
        router.refresh();
      } catch {
        toast.error("Ayarlar kaydedilemedi");
      }
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("entity", "settings");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, logoUrl: data.url }));
        toast.success("Logo yüklendi");
      } else {
        toast.error("Logo yüklenemedi");
      }
    } catch {
      toast.error("Logo yüklenemedi");
    }
  };

  const handleRemoveLogo = () => {
    setForm((prev) => ({ ...prev, logoUrl: "" }));
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
        {form.logoUrl ? (
          <div className="flex items-center gap-4">
            <img
              src={form.logoUrl}
              alt="Site logo"
              className="h-16 object-contain rounded-lg border border-gray-200 p-2"
            />
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
            >
              <MaterialIcon icon="delete" className="text-[18px]" />
              Kaldır
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer block hover:border-gray-300 transition-colors">
            <MaterialIcon icon="cloud_upload" className="text-4xl text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Logo dosyasını buraya sürükleyin veya seçin</p>
            <p className="text-xs text-gray-400 mt-1">PNG, SVG veya JPEG (max 2MB)</p>
            <input
              type="file"
              accept="image/png,image/svg+xml,image/jpeg"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <MaterialIcon icon="save" className="text-[20px]" />
            {isPending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
