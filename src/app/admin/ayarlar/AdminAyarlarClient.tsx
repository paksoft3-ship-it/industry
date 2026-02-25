"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { updateSettings } from "@/lib/actions/settings";
import MediaUploader from "@/components/admin/MediaUploader";

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
  faviconUrl: string | null;
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
    faviconUrl: settings.faviconUrl ?? "",
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

  const handleRemoveLogo = async () => {
    if (!form.logoUrl) return;
    const urlToDelete = form.logoUrl;
    setForm((prev) => ({ ...prev, logoUrl: "" }));
    try {
      // Persist removal to DB first so page is consistent on refresh
      await updateSettings({ logoUrl: "" });
      // Then delete the blob (fire-and-forget; orphaned blobs are harmless)
      if (urlToDelete.includes("public.blob.vercel-storage.com")) {
        fetch(`/api/blob/delete?url=${encodeURIComponent(urlToDelete)}`, { method: "DELETE" }).catch(console.error);
      }
      toast.success("Logo kaldırıldı");
      router.refresh();
    } catch (error) {
      console.error("Remove logo error:", error);
      // Rollback local state on failure
      setForm((prev) => ({ ...prev, logoUrl: urlToDelete }));
      toast.error("Logo kaldırılamadı");
    }
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
          <div className="flex items-center gap-4 group relative w-fit">
            <div className="h-20 w-40 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-2">
              <img
                src={form.logoUrl}
                alt="Site logo"
                className="h-full w-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MaterialIcon icon="delete" className="text-lg" />
            </button>
          </div>
        ) : (
          <MediaUploader
            folderPrefix="settings"
            onUploaded={async (items) => {
              const newUrl = items[0].url;
              setForm((prev) => ({ ...prev, logoUrl: newUrl }));
              try {
                await updateSettings({ logoUrl: newUrl });
                toast.success("Logo kaydedildi");
                router.refresh();
              } catch {
                toast.error("Logo kaydedilemedi");
              }
            }}
          />
        )}

        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 pt-4">Favicon</h3>
        {form.faviconUrl ? (
          <div className="flex items-center gap-4 group relative w-fit">
            <div className="h-16 w-16 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-2">
              <img
                src={form.faviconUrl}
                alt="Favicon"
                className="h-full w-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={async () => {
                const urlToDelete = form.faviconUrl;
                if (!urlToDelete) return;
                setForm((prev) => ({ ...prev, faviconUrl: "" }));
                try {
                  await updateSettings({ faviconUrl: "" });
                  if (urlToDelete.includes("public.blob.vercel-storage.com")) {
                    fetch(`/api/blob/delete?url=${encodeURIComponent(urlToDelete)}`, { method: "DELETE" }).catch(console.error);
                  }
                  toast.success("Favicon kaldırıldı");
                  router.refresh();
                } catch {
                  setForm((prev) => ({ ...prev, faviconUrl: urlToDelete }));
                  toast.error("Favicon kaldırılamadı");
                }
              }}
              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MaterialIcon icon="delete" className="text-lg" />
            </button>
          </div>
        ) : (
          <MediaUploader
            folderPrefix="settings"
            onUploaded={async (items) => {
              const newUrl = items[0].url;
              setForm((prev) => ({ ...prev, faviconUrl: newUrl }));
              try {
                await updateSettings({ faviconUrl: newUrl });
                toast.success("Favicon kaydedildi");
                router.refresh();
              } catch {
                toast.error("Favicon kaydedilemedi");
              }
            }}
          />
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
