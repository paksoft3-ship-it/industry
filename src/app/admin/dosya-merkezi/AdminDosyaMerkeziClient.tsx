"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import {
  createFileLibraryItem,
  updateFileLibraryItem,
  deleteFileLibraryItem,
} from "@/lib/actions/fileLibrary";

type FileItem = {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ModalState = {
  open: boolean;
  mode: "create" | "edit";
  item: FileItem | null;
};

const FILE_TYPES = ["PDF", "STEP", "DWG", "DXF", "ZIP", "XLSX", "DOCX", "IMAGE"];

const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-100 text-red-700",
  STEP: "bg-blue-100 text-blue-700",
  DWG: "bg-purple-100 text-purple-700",
  DXF: "bg-indigo-100 text-indigo-700",
  ZIP: "bg-yellow-100 text-yellow-700",
  XLSX: "bg-green-100 text-green-700",
  DOCX: "bg-sky-100 text-sky-700",
  IMAGE: "bg-pink-100 text-pink-700",
};

const fileTypeIcons: Record<string, string> = {
  PDF: "picture_as_pdf",
  STEP: "view_in_ar",
  DWG: "architecture",
  DXF: "architecture",
  ZIP: "folder_zip",
  XLSX: "table_chart",
  DOCX: "article",
  IMAGE: "image",
};

export default function AdminDosyaMerkeziClient({ items }: { items: FileItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState<ModalState>({ open: false, mode: "create", item: null });
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formFileUrl, setFormFileUrl] = useState("");
  const [formFileType, setFormFileType] = useState("PDF");
  const [formFileSize, setFormFileSize] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [formIsActive, setFormIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Stats
  const totalFiles = items.length;
  const activeFiles = items.filter((i) => i.isActive).length;
  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return Array.from(cats).sort();
  }, [items]);

  // Filter
  const filteredItems = searchTerm
    ? items.filter(
        (i) =>
          i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.fileType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items;

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, FileItem[]>();
    for (const item of filteredItems) {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b, "tr"));
  }, [filteredItems]);

  function toggleCategory(cat: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function openCreateModal() {
    setFormTitle("");
    setFormCategory("");
    setFormFileUrl("");
    setFormFileType("PDF");
    setFormFileSize("");
    setFormIcon("");
    setFormSortOrder(0);
    setFormIsActive(true);
    setModal({ open: true, mode: "create", item: null });
  }

  function openEditModal(item: FileItem) {
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormFileUrl(item.fileUrl);
    setFormFileType(item.fileType);
    setFormFileSize(item.fileSize || "");
    setFormIcon(item.icon || "");
    setFormSortOrder(item.sortOrder);
    setFormIsActive(item.isActive);
    setModal({ open: true, mode: "edit", item });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entity", "dosya-merkezi");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setFormFileUrl(url);
      toast.success("Dosya yuklendi");
    } catch {
      toast.error("Dosya yuklenemedi");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle || !formCategory || !formFileUrl || !formFileType) {
      toast.error("Baslik, kategori, dosya URL ve dosya turu zorunludur");
      return;
    }

    startTransition(async () => {
      try {
        if (modal.mode === "create") {
          await createFileLibraryItem({
            title: formTitle,
            category: formCategory,
            fileUrl: formFileUrl,
            fileType: formFileType,
            fileSize: formFileSize || undefined,
            icon: formIcon || undefined,
            sortOrder: formSortOrder || undefined,
          });
          toast.success("Dosya olusturuldu");
        } else if (modal.item) {
          await updateFileLibraryItem(modal.item.id, {
            title: formTitle,
            category: formCategory,
            fileUrl: formFileUrl,
            fileType: formFileType,
            fileSize: formFileSize || undefined,
            icon: formIcon || undefined,
            sortOrder: formSortOrder,
            isActive: formIsActive,
          });
          toast.success("Dosya guncellendi");
        }
        setModal({ open: false, mode: "create", item: null });
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Islem basarisiz");
      }
    });
  }

  function handleDelete(item: FileItem) {
    if (!confirm(`"${item.title}" dosyasini silmek istediginize emin misiniz?`)) return;
    startTransition(async () => {
      try {
        await deleteFileLibraryItem(item.id);
        toast.success("Dosya silindi");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Silme basarisiz");
      }
    });
  }

  function truncateUrl(url: string, max = 40) {
    if (url.length <= max) return url;
    return url.slice(0, max) + "...";
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">
            Dosya Merkezi
          </h1>
          <p className="text-sm text-gray-500 mt-1">Teknik dokumanlar ve dosyalari yonetin</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <MaterialIcon icon="upload_file" className="text-[20px]" />
          Dosya Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <MaterialIcon icon="folder" className="text-2xl text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">
              {totalFiles}
            </p>
            <p className="text-sm text-gray-500">Toplam Dosya</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <MaterialIcon icon="category" className="text-2xl text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">
              {categories.length}
            </p>
            <p className="text-sm text-gray-500">Kategori</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <MaterialIcon icon="check_circle" className="text-2xl text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">
              {activeFiles}
            </p>
            <p className="text-sm text-gray-500">Aktif Dosya</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative max-w-md">
          <MaterialIcon
            icon="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Dosya adi, kategori veya tur ile ara..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Grouped Tables */}
      {grouped.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <MaterialIcon icon="folder_off" className="text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">Henuz dosya eklenmemis</p>
        </div>
      )}

      {grouped.map(([category, catItems]) => (
        <div
          key={category}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category)}
            className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MaterialIcon
                icon={collapsedCategories.has(category) ? "chevron_right" : "expand_more"}
                className="text-xl text-gray-500"
              />
              <h3 className="font-[family-name:var(--font-display)] font-semibold text-gray-800 text-base">
                {category}
              </h3>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                {catItems.length}
              </span>
            </div>
          </button>

          {/* Table */}
          {!collapsedCategories.has(category) && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Dosya
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Tur
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Boyut
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    URL
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Durum
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {catItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                        <MaterialIcon
                          icon={item.icon || fileTypeIcons[item.fileType] || "description"}
                          className="text-[20px] text-gray-400"
                        />
                        {item.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          fileTypeColors[item.fileType] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.fileType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.fileSize || "-"}</td>
                    <td className="px-6 py-4">
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs"
                        title={item.fileUrl}
                      >
                        {truncateUrl(item.fileUrl)}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors mr-1"
                        title="Duzenle"
                      >
                        <MaterialIcon icon="edit" className="text-[18px]" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={isPending}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Sil"
                      >
                        <MaterialIcon icon="delete" className="text-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setModal({ ...modal, open: false })}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800">
                {modal.mode === "create" ? "Yeni Dosya Ekle" : "Dosya Duzenle"}
              </h2>
              <button
                onClick={() => setModal({ ...modal, open: false })}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <MaterialIcon icon="close" className="text-xl" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Baslik</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Dosya basligi"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Kategori adi girin veya secin"
                    list="category-list"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                  <datalist id="category-list">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* File URL + Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Dosya URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formFileUrl}
                    onChange={(e) => setFormFileUrl(e.target.value)}
                    placeholder="https://... veya dosya yukleyin"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary/30 hover:text-primary transition-colors cursor-pointer whitespace-nowrap">
                    <MaterialIcon icon="cloud_upload" className="text-lg" />
                    {uploading ? "..." : "Yukle"}
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              {/* File Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Dosya Turu</label>
                <select
                  value={formFileType}
                  onChange={(e) => setFormFileType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  {FILE_TYPES.map((ft) => (
                    <option key={ft} value={ft}>
                      {ft}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Size + Icon row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Dosya Boyutu
                  </label>
                  <input
                    type="text"
                    value={formFileSize}
                    onChange={(e) => setFormFileSize(e.target.value)}
                    placeholder="orn. 2.4 MB"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ikon (Material)
                  </label>
                  <input
                    type="text"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    placeholder="orn. picture_as_pdf"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Siralama
                </label>
                <input
                  type="number"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* isActive toggle (edit mode only) */}
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

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModal({ ...modal, open: false })}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Iptal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isPending
                    ? "Kaydediliyor..."
                    : modal.mode === "create"
                      ? "Olustur"
                      : "Guncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
