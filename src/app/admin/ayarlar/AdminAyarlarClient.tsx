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
  // Hero
  heroTitle: string | null;
  heroHighlight: string | null;
  heroSubtitle: string | null;
  heroBadge: string | null;
  heroBadgeIcon: string | null;
  heroImage: string | null;
  heroCta1Text: string | null;
  heroCta1Url: string | null;
  heroCta2Text: string | null;
  heroCta2Url: string | null;
  // Contact
  mapEmbedUrl: string | null;
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
    // Hero
    heroTitle: settings.heroTitle ?? "",
    heroHighlight: settings.heroHighlight ?? "",
    heroSubtitle: settings.heroSubtitle ?? "",
    heroBadge: settings.heroBadge ?? "",
    heroBadgeIcon: settings.heroBadgeIcon ?? "",
    heroImage: settings.heroImage ?? "",
    heroCta1Text: settings.heroCta1Text ?? "",
    heroCta1Url: settings.heroCta1Url ?? "",
    heroCta2Text: settings.heroCta2Text ?? "",
    heroCta2Url: settings.heroCta2Url ?? "",
    // Contact
    mapEmbedUrl: settings.mapEmbedUrl ?? "",
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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

  const removeMedia = async (key: "logoUrl" | "faviconUrl" | "heroImage") => {
    const url = form[key];
    if (!url) return;
    setForm((prev) => ({ ...prev, [key]: "" }));
    try {
      await updateSettings({ [key]: "" });
      if (url.includes("public.blob.vercel-storage.com")) {
        fetch(`/api/blob/delete?url=${encodeURIComponent(url)}`, { method: "DELETE" }).catch(console.error);
      }
      toast.success("Görsel kaldırıldı");
      router.refresh();
    } catch {
      setForm((prev) => ({ ...prev, [key]: url }));
      toast.error("Görsel kaldırılamadı");
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  const renderField = (key: keyof typeof form, label: string, placeholder?: string) => (
    <div key={key}>
      <label className={labelCls}>{label}</label>
      <input
        type="text"
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );

  const renderMediaPreview = (key: "logoUrl" | "faviconUrl" | "heroImage", label: string, folder: string, aspectClass = "h-20 w-40") => (
    <>
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 pt-4">{label}</h3>
      {form[key] ? (
        <div className="flex items-center gap-4 group relative w-fit">
          <div className={`${aspectClass} bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-2`}>
            <img src={form[key]} alt={label} className="h-full w-full object-contain" />
          </div>
          <button
            type="button"
            onClick={() => removeMedia(key)}
            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MaterialIcon icon="delete" className="text-lg" />
          </button>
        </div>
      ) : (
        <MediaUploader
          folderPrefix={folder}
          onUploaded={async (items) => {
            const newUrl = items[0].url;
            setForm((prev) => ({ ...prev, [key]: newUrl }));
            try {
              await updateSettings({ [key]: newUrl });
              toast.success(`${label} kaydedildi`);
              router.refresh();
            } catch {
              toast.error(`${label} kaydedilemedi`);
            }
          }}
        />
      )}
    </>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">Site Ayarları</h2>
        <p className="text-sm text-gray-500 mt-1">Genel site yapılandırmasını düzenleyin</p>
      </div>

      {/* ── General Info ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3">Genel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField("siteName", "Site Adı")}
          {renderField("email", "E-posta")}
          {renderField("phone", "Telefon")}
          {renderField("whatsapp", "WhatsApp")}
          {renderField("workingHours", "Çalışma Saatleri", "Pzt-Cum: 08:00 - 18:00")}
        </div>
        <div>
          <label className={labelCls}>Site Açıklaması</label>
          <textarea
            value={form.siteDescription}
            onChange={(e) => set("siteDescription", e.target.value)}
            rows={3}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Adres</label>
          <textarea
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            rows={2}
            className={inputCls}
          />
        </div>

        {/* Sosyal Medya */}
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 pt-4">Sosyal Medya</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField("facebookUrl", "Facebook URL")}
          {renderField("instagramUrl", "Instagram URL")}
          {renderField("linkedinUrl", "LinkedIn URL")}
          {renderField("youtubeUrl", "YouTube URL")}
        </div>

        {/* Logo & Favicon */}
        {renderMediaPreview("logoUrl", "Logo", "settings", "h-20 w-40")}
        {renderMediaPreview("faviconUrl", "Favicon", "settings", "h-16 w-16")}

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

      {/* ── Hero Section ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Hero Bölümü</h3>
          <p className="text-sm text-gray-400 mt-1">Ana sayfanın üst hero alanını düzenleyin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField("heroTitle", "Başlık", "SivTech Makina")}
          {renderField("heroHighlight", "Vurgulanan Metin", "& Otomasyon")}
          {renderField("heroBadge", "Rozet Metni", "Endüstriyel Otomasyon Çözümleri")}
          {renderField("heroBadgeIcon", "Rozet İkonu (Material Symbol)", "precision_manufacturing")}
          {renderField("heroCta1Text", "Birinci Buton Metni", "Ürünleri Keşfet")}
          {renderField("heroCta1Url", "Birinci Buton URL", "/kategori/tumu")}
          {renderField("heroCta2Text", "İkinci Buton Metni", "Kategoriler")}
          {renderField("heroCta2Url", "İkinci Buton URL", "/kategori/tumu")}
        </div>
        <div>
          <label className={labelCls}>Alt Başlık (Açıklama)</label>
          <textarea
            value={form.heroSubtitle}
            onChange={(e) => set("heroSubtitle", e.target.value)}
            rows={2}
            placeholder="Endüstriyel otomasyon ve CNC makine parçalarında..."
            className={inputCls}
          />
        </div>

        {/* Hero Background Image */}
        <h3 className="text-base font-medium text-gray-700 border-b pb-2">Arka Plan Görseli</h3>
        {form.heroImage ? (
          <div className="flex items-center gap-4 group relative w-fit">
            <div className="h-28 w-56 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <img src={form.heroImage} alt="Hero arka planı" className="h-full w-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => removeMedia("heroImage")}
              className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MaterialIcon icon="delete" className="text-lg" />
            </button>
          </div>
        ) : (
          <MediaUploader
            folderPrefix="hero"
            onUploaded={async (items) => {
              const newUrl = items[0].url;
              setForm((prev) => ({ ...prev, heroImage: newUrl }));
              try {
                await updateSettings({ heroImage: newUrl });
                toast.success("Hero görseli kaydedildi");
                router.refresh();
              } catch {
                toast.error("Hero görseli kaydedilemedi");
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

      {/* ── Contact Page ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">İletişim Sayfası</h3>
          <p className="text-sm text-gray-400 mt-1">İletişim sayfasında görünecek harita embed URL&apos;sini girin</p>
        </div>
        <div>
          <label className={labelCls}>Google Maps Embed URL</label>
          <input
            type="text"
            value={form.mapEmbedUrl}
            onChange={(e) => set("mapEmbedUrl", e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className={inputCls}
          />
          <p className="text-xs text-gray-400 mt-1">
            Google Maps → Paylaş → Haritayı göm → iframe src değerini buraya yapıştırın
          </p>
        </div>

        <div className="flex justify-end pt-2">
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
