"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { createBrand, updateBrand, deleteBrand } from "@/lib/actions/brands";

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { products: number };
};

type ModalState = {
  open: boolean;
  mode: "create" | "edit";
  brand: Brand | null;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g").replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o").replace(/[şŞ]/g, "s").replace(/[üÜ]/g, "u")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminBrandsClient({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState<ModalState>({ open: false, mode: "create", brand: null });

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formLogo, setFormLogo] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  const filteredBrands = searchTerm
    ? brands.filter((b) => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : brands;

  function openCreateModal() {
    setFormName("");
    setFormSlug("");
    setFormLogo("");
    setFormDescription("");
    setFormWebsite("");
    setFormIsActive(true);
    setModal({ open: true, mode: "create", brand: null });
  }

  function openEditModal(brand: Brand) {
    setFormName(brand.name);
    setFormSlug(brand.slug);
    setFormLogo(brand.logo || "");
    setFormDescription(brand.description || "");
    setFormWebsite(brand.website || "");
    setFormIsActive(brand.isActive);
    setModal({ open: true, mode: "edit", brand });
  }

  function handleNameChange(val: string) {
    setFormName(val);
    if (modal.mode === "create") setFormSlug(slugify(val));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entity", "brands");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setFormLogo(url);
      toast.success("Logo yüklendi");
    } catch {
      toast.error("Logo yüklenemedi");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName || !formSlug) {
      toast.error("Marka adı ve slug zorunludur");
      return;
    }

    startTransition(async () => {
      try {
        if (modal.mode === "create") {
          await createBrand({
            name: formName,
            slug: formSlug,
            logo: formLogo || undefined,
            description: formDescription || undefined,
            website: formWebsite || undefined,
          });
          toast.success("Marka oluşturuldu");
        } else if (modal.brand) {
          await updateBrand(modal.brand.id, {
            name: formName,
            slug: formSlug,
            logo: formLogo || undefined,
            description: formDescription || undefined,
            website: formWebsite || undefined,
            isActive: formIsActive,
          });
          toast.success("Marka güncellendi");
        }
        setModal({ open: false, mode: "create", brand: null });
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "İşlem başarısız");
      }
    });
  }

  function handleDelete(brand: Brand) {
    if (!confirm(`"${brand.name}" markasını silmek istediğinize emin misiniz?`)) return;
    startTransition(async () => {
      try {
        await deleteBrand(brand.id);
        toast.success("Marka silindi");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Silme başarısız");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Markalar</h1>
          <p className="text-sm text-gray-500 mt-1">{brands.length} marka kayıtlı</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <MaterialIcon icon="add" className="text-lg" />
          Yeni Marka
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative max-w-md">
          <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Marka adı ile ara..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => (
          <div key={brand.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
                {brand.logo ? (
                  <Image src={brand.logo} alt={brand.name} width={64} height={64} className="object-contain w-full h-full p-1" />
                ) : (
                  <MaterialIcon icon="branding_watermark" className="text-gray-400 text-3xl" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(brand)}
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  title="Düzenle"
                >
                  <MaterialIcon icon="edit" className="text-lg" />
                </button>
                <button
                  onClick={() => handleDelete(brand)}
                  disabled={isPending}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Sil"
                >
                  <MaterialIcon icon="delete" className="text-lg" />
                </button>
              </div>
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-gray-800 text-lg">{brand.name}</h3>
            {brand.website && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{brand.website}</p>
            )}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-600">
                <span className="font-medium">{brand._count.products}</span> ürün
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  brand.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {brand.isActive ? "Aktif" : "Pasif"}
              </span>
            </div>
          </div>
        ))}

        {/* Add New Brand Card */}
        <button
          onClick={openCreateModal}
          className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-6 hover:border-primary/30 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center min-h-[200px] group"
        >
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-3">
            <MaterialIcon icon="add" className="text-gray-400 group-hover:text-primary text-2xl transition-colors" />
          </div>
          <span className="text-sm font-medium text-gray-500 group-hover:text-primary transition-colors">Yeni Marka Ekle</span>
        </button>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModal({ ...modal, open: false })} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800">
                {modal.mode === "create" ? "Yeni Marka" : "Marka Düzenle"}
              </h2>
              <button
                onClick={() => setModal({ ...modal, open: false })}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <MaterialIcon icon="close" className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Marka Adı</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo</label>
                {formLogo && (
                  <div className="mb-2 flex items-center gap-2">
                    <img src={formLogo} alt="" className="h-12 w-12 object-contain rounded-lg border" />
                    <button type="button" onClick={() => setFormLogo("")} className="text-red-500 text-sm">Kaldır</button>
                  </div>
                )}
                <label className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <MaterialIcon icon="cloud_upload" className="text-lg" />
                  {uploading ? "Yükleniyor..." : "Logo Yükle"}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                <input
                  type="url"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  placeholder="https://"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              {modal.mode === "edit" && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModal({ ...modal, open: false })}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Kaydediliyor..." : modal.mode === "create" ? "Oluştur" : "Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
