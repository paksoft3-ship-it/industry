"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  createStaticPage,
  updateStaticPage,
  deleteStaticPage,
} from "@/lib/actions/staticPages";

type StaticPage = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  seoTitle: string | null;
  seoDesc: string | null;
  isActive: boolean;
  createdAt: string;
};

type ModalState = {
  open: boolean;
  mode: "create" | "edit";
  page: StaticPage | null;
};

function slugify(str: string) {
  return str
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminSayfalarClient({ pages }: { pages: StaticPage[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<ModalState>({ open: false, mode: "create", page: null });

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formSeoTitle, setFormSeoTitle] = useState("");
  const [formSeoDesc, setFormSeoDesc] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  function openCreateModal() {
    setFormTitle("");
    setFormSlug("");
    setFormContent("");
    setFormSeoTitle("");
    setFormSeoDesc("");
    setFormIsActive(true);
    setModal({ open: true, mode: "create", page: null });
  }

  function openEditModal(page: StaticPage) {
    setFormTitle(page.title);
    setFormSlug(page.slug);
    setFormContent(page.content || "");
    setFormSeoTitle(page.seoTitle || "");
    setFormSeoDesc(page.seoDesc || "");
    setFormIsActive(page.isActive);
    setModal({ open: true, mode: "edit", page });
  }

  function handleTitleChange(val: string) {
    setFormTitle(val);
    if (modal.mode === "create") setFormSlug(slugify(val));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle || !formSlug) {
      toast.error("Başlık ve slug zorunludur");
      return;
    }

    startTransition(async () => {
      try {
        if (modal.mode === "create") {
          await createStaticPage({
            title: formTitle,
            slug: formSlug,
            content: formContent || undefined,
            seoTitle: formSeoTitle || undefined,
            seoDesc: formSeoDesc || undefined,
            isActive: formIsActive,
          });
          toast.success("Sayfa oluşturuldu");
        } else if (modal.page) {
          await updateStaticPage(modal.page.id, {
            title: formTitle,
            slug: formSlug,
            content: formContent || undefined,
            seoTitle: formSeoTitle || undefined,
            seoDesc: formSeoDesc || undefined,
            isActive: formIsActive,
          });
          toast.success("Sayfa güncellendi");
        }
        setModal({ open: false, mode: "create", page: null });
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "İşlem başarısız");
      }
    });
  }

  function handleDelete(page: StaticPage) {
    if (!confirm(`"${page.title}" sayfasını silmek istediğinize emin misiniz?`)) return;
    startTransition(async () => {
      try {
        await deleteStaticPage(page.id);
        toast.success("Sayfa silindi");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Silme başarısız");
      }
    });
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">
            Sayfalar
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kurumsal ve bilgi sayfalarını yönetin ({pages.length} sayfa)
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <MaterialIcon icon="add" className="text-[20px]" /> Yeni Sayfa
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                Başlık
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                Slug
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                Durum
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                Oluşturulma
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{page.title}</td>
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">/{page.slug}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      page.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {page.isActive ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(page.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openEditModal(page)}
                    className="text-gray-400 hover:text-primary mr-2"
                    title="Düzenle"
                  >
                    <MaterialIcon icon="edit" className="text-[18px]" />
                  </button>
                  <button
                    onClick={() => handleDelete(page)}
                    disabled={isPending}
                    className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                    title="Sil"
                  >
                    <MaterialIcon icon="delete" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Henüz sayfa eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setModal({ ...modal, open: false })}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800">
                {modal.mode === "create" ? "Yeni Sayfa" : "Sayfa Düzenle"}
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Sayfa Başlığı
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  İçerik
                </label>
                <RichTextEditor
                  value={formContent}
                  onChange={setFormContent}
                  placeholder="Sayfa içeriğini buraya yazın..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  SEO Başlık
                </label>
                <input
                  type="text"
                  value={formSeoTitle}
                  onChange={(e) => setFormSeoTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  SEO Açıklama
                </label>
                <textarea
                  rows={3}
                  value={formSeoDesc}
                  onChange={(e) => setFormSeoDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Aktif</span>
              </label>
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
                  {isPending
                    ? "Kaydediliyor..."
                    : modal.mode === "create"
                      ? "Oluştur"
                      : "Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
