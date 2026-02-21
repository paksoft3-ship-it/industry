"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  seoSlug: string | null;
  seoTitle: string | null;
  seoDesc: string | null;
  parentId: string | null;
  _count: { products: number };
  children: Category[];
};

type ModalState = {
  open: boolean;
  mode: "create" | "edit";
  parentId: string | null;
  category: Category | null;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g").replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o").replace(/[şŞ]/g, "s").replace(/[üÜ]/g, "u")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function countAll(cats: Category[]): number {
  return cats.reduce((sum, c) => sum + 1 + countAll(c.children || []), 0);
}

function CategoryRow({
  category,
  level = 0,
  onEdit,
  onAddChild,
  onDelete,
  isPending,
  searchTerm,
}: {
  category: Category;
  level?: number;
  onEdit: (c: Category) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (c: Category) => void;
  isPending: boolean;
  searchTerm: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  const matchesSearch =
    !searchTerm ||
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase());

  const childrenMatch = category.children?.some(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.children?.some(
        (cc) =>
          cc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cc.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (searchTerm && !matchesSearch && !childrenMatch) return null;

  return (
    <>
      <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
        <td className="px-6 py-3.5">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            {hasChildren ? (
              <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600">
                <MaterialIcon icon={expanded ? "expand_more" : "chevron_right"} className="text-lg" />
              </button>
            ) : level > 0 ? (
              <span className="w-5 h-px bg-gray-200 inline-block mr-1" />
            ) : (
              <span className="w-5" />
            )}
            <MaterialIcon icon="folder" className={`text-lg ${level === 0 ? "text-primary" : "text-gray-400"}`} />
            <span className={`text-sm ${level === 0 ? "font-semibold text-gray-800" : "text-gray-600"}`}>
              {category.name}
            </span>
            {!category.isActive && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500">Pasif</span>
            )}
          </div>
        </td>
        <td className="px-6 py-3.5 text-sm text-gray-500 font-mono text-xs">{category.slug}</td>
        <td className="px-6 py-3.5 text-sm text-gray-600">{category._count.products} ürün</td>
        <td className="px-6 py-3.5">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => onEdit(category)}
              className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              title="Düzenle"
            >
              <MaterialIcon icon="edit" className="text-lg" />
            </button>
            {level < 2 && (
              <button
                onClick={() => onAddChild(category.id)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Alt Kategori Ekle"
              >
                <MaterialIcon icon="add" className="text-lg" />
              </button>
            )}
            <button
              onClick={() => onDelete(category)}
              disabled={isPending}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Sil"
            >
              <MaterialIcon icon="delete" className="text-lg" />
            </button>
          </div>
        </td>
      </tr>
      {expanded &&
        hasChildren &&
        category.children.map((child) => (
          <CategoryRow
            key={child.id}
            category={child}
            level={level + 1}
            onEdit={onEdit}
            onAddChild={onAddChild}
            onDelete={onDelete}
            isPending={isPending}
            searchTerm={searchTerm}
          />
        ))}
    </>
  );
}

export default function AdminCategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    parentId: null,
    category: null,
  });

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formSortOrder, setFormSortOrder] = useState("0");
  const [formImage, setFormImage] = useState("");
  const [formSeoTitle, setFormSeoTitle] = useState("");
  const [formSeoDesc, setFormSeoDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  function openCreateModal(parentId: string | null = null) {
    setFormName("");
    setFormSlug("");
    setFormIcon("");
    setFormDescription("");
    setFormIsActive(true);
    setFormSortOrder("0");
    setFormImage("");
    setFormSeoTitle("");
    setFormSeoDesc("");
    setModal({ open: true, mode: "create", parentId, category: null });
  }

  function openEditModal(category: Category) {
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormIcon(category.icon || "");
    setFormDescription(category.description || "");
    setFormIsActive(category.isActive);
    setFormSortOrder(String(category.sortOrder));
    setFormImage(category.image || "");
    setFormSeoTitle(category.seoTitle || "");
    setFormSeoDesc(category.seoDesc || "");
    setModal({ open: true, mode: "edit", parentId: category.parentId, category });
  }

  function handleNameChange(val: string) {
    setFormName(val);
    if (modal.mode === "create") setFormSlug(slugify(val));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entity", "categories");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setFormImage(url);
      toast.success("Görsel yüklendi");
    } catch {
      toast.error("Görsel yüklenemedi");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName || !formSlug) {
      toast.error("Ad ve slug zorunludur");
      return;
    }

    startTransition(async () => {
      try {
        if (modal.mode === "create") {
          await createCategory({
            name: formName,
            slug: formSlug,
            icon: formIcon || undefined,
            image: formImage || undefined,
            description: formDescription || undefined,
            parentId: modal.parentId || undefined,
            sortOrder: parseInt(formSortOrder, 10) || 0,
            seoTitle: formSeoTitle || undefined,
            seoDesc: formSeoDesc || undefined,
          });
          toast.success("Kategori oluşturuldu");
        } else if (modal.category) {
          await updateCategory(modal.category.id, {
            name: formName,
            slug: formSlug,
            icon: formIcon || undefined,
            image: formImage || undefined,
            description: formDescription || undefined,
            isActive: formIsActive,
            sortOrder: parseInt(formSortOrder, 10) || 0,
            seoTitle: formSeoTitle || undefined,
            seoDesc: formSeoDesc || undefined,
          });
          toast.success("Kategori güncellendi");
        }
        setModal({ open: false, mode: "create", parentId: null, category: null });
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "İşlem başarısız");
      }
    });
  }

  function handleDelete(category: Category) {
    if (!confirm(`"${category.name}" kategorisini silmek istediğinize emin misiniz?`)) return;
    startTransition(async () => {
      try {
        await deleteCategory(category.id);
        toast.success("Kategori silindi");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Silme başarısız");
      }
    });
  }

  const rootCount = categories.length;
  const totalCount = countAll(categories);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Kategoriler</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam {totalCount} kategori ({rootCount} ana)</p>
        </div>
        <button
          onClick={() => openCreateModal(null)}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <MaterialIcon icon="add" className="text-lg" />
          Yeni Kategori
        </button>
      </div>

      {/* Category Tree */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kategori ara..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MaterialIcon icon="account_tree" className="text-lg" />
            <span>{rootCount} ana kategori</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori Adı</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün Sayısı</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Kategori bulunamadı</td>
                </tr>
              )}
              {categories.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  onEdit={openEditModal}
                  onAddChild={(parentId) => openCreateModal(parentId)}
                  onDelete={handleDelete}
                  isPending={isPending}
                  searchTerm={searchTerm}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModal({ ...modal, open: false })} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800">
                {modal.mode === "create"
                  ? modal.parentId
                    ? "Alt Kategori Ekle"
                    : "Yeni Kategori"
                  : "Kategori Düzenle"}
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori Adı</label>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">İkon</label>
                  <input
                    type="text"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    placeholder="Material icon adı"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sıralama</label>
                  <input
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Görsel</label>
                {formImage && (
                  <div className="mb-2 flex items-center gap-2">
                    <img src={formImage} alt="" className="h-16 w-16 object-cover rounded-lg" />
                    <button type="button" onClick={() => setFormImage("")} className="text-red-500 text-sm">Kaldır</button>
                  </div>
                )}
                <label className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <MaterialIcon icon="cloud_upload" className="text-lg" />
                  {uploading ? "Yükleniyor..." : "Görsel Yükle"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Başlık</label>
                  <input
                    type="text"
                    value={formSeoTitle}
                    onChange={(e) => setFormSeoTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Açıklama</label>
                  <input
                    type="text"
                    value={formSeoDesc}
                    onChange={(e) => setFormSeoDesc(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
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
