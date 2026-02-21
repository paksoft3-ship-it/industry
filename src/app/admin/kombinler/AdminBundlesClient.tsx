"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { createBundle, updateBundle, deleteBundle } from "@/lib/actions/bundles";

type BundleItem = {
  id: string;
  productId: string;
  quantity: number;
  product: { name: string; price: number };
};

type Bundle = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  discount: number | null;
  isActive: boolean;
  items: BundleItem[];
  createdAt: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
};

type ModalState = {
  open: boolean;
  mode: "create" | "edit";
  bundle: Bundle | null;
};

type FormItem = {
  productId: string;
  quantity: number;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminBundlesClient({
  bundles,
  products,
}: {
  bundles: Bundle[];
  products: Product[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<ModalState>({ open: false, mode: "create", bundle: null });

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDiscount, setFormDiscount] = useState<number>(0);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formItems, setFormItems] = useState<FormItem[]>([]);

  // Item picker state
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const activeCount = bundles.filter((b) => b.isActive).length;
  const totalItems = bundles.reduce((acc, b) => acc + b.items.length, 0);

  function openCreateModal() {
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormDiscount(0);
    setFormIsActive(true);
    setFormItems([]);
    setSelectedProductId("");
    setSelectedQuantity(1);
    setModal({ open: true, mode: "create", bundle: null });
  }

  function openEditModal(bundle: Bundle) {
    setFormName(bundle.name);
    setFormSlug(bundle.slug);
    setFormDescription(bundle.description || "");
    setFormDiscount(bundle.discount || 0);
    setFormIsActive(bundle.isActive);
    setFormItems(bundle.items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
    setSelectedProductId("");
    setSelectedQuantity(1);
    setModal({ open: true, mode: "edit", bundle });
  }

  function handleNameChange(val: string) {
    setFormName(val);
    if (modal.mode === "create") setFormSlug(slugify(val));
  }

  function addItem() {
    if (!selectedProductId) {
      toast.error("Lütfen bir ürün seçin");
      return;
    }
    if (formItems.some((i) => i.productId === selectedProductId)) {
      toast.error("Bu ürün zaten eklenmiş");
      return;
    }
    setFormItems([...formItems, { productId: selectedProductId, quantity: selectedQuantity }]);
    setSelectedProductId("");
    setSelectedQuantity(1);
  }

  function removeItem(productId: string) {
    setFormItems(formItems.filter((i) => i.productId !== productId));
  }

  function updateItemQuantity(productId: string, quantity: number) {
    setFormItems(formItems.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }

  function getProductName(productId: string) {
    return products.find((p) => p.id === productId)?.name || "Bilinmeyen Ürün";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName || !formSlug) {
      toast.error("Kombin adı ve slug zorunludur");
      return;
    }

    startTransition(async () => {
      try {
        if (modal.mode === "create") {
          await createBundle({
            name: formName,
            slug: formSlug,
            description: formDescription || undefined,
            discount: formDiscount || undefined,
            isActive: formIsActive,
            items: formItems.length > 0 ? formItems : undefined,
          });
          toast.success("Kombin oluşturuldu");
        } else if (modal.bundle) {
          await updateBundle(modal.bundle.id, {
            name: formName,
            slug: formSlug,
            description: formDescription || undefined,
            discount: formDiscount || undefined,
            isActive: formIsActive,
            items: formItems,
          });
          toast.success("Kombin güncellendi");
        }
        setModal({ open: false, mode: "create", bundle: null });
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "İşlem başarısız");
      }
    });
  }

  function handleDelete(bundle: Bundle) {
    if (!confirm(`"${bundle.name}" kombinini silmek istediğinize emin misiniz?`)) return;
    startTransition(async () => {
      try {
        await deleteBundle(bundle.id);
        toast.success("Kombin silindi");
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
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Kombinler</h1>
          <p className="text-sm text-gray-500 mt-1">Ürün kombin paketlerini yönetin</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <MaterialIcon icon="add" className="text-lg" />
          Yeni Kombin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <MaterialIcon icon="package_2" className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Toplam Kombin</p>
            <p className="text-xl font-bold text-gray-800">{bundles.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <MaterialIcon icon="check_circle" className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Aktif</p>
            <p className="text-xl font-bold text-gray-800">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <MaterialIcon icon="inventory_2" className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Toplam Ürün</p>
            <p className="text-xl font-bold text-gray-800">{totalItems}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kombin Adı</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün Sayısı</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">İndirim</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bundles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Henüz kombin eklenmemiş
                  </td>
                </tr>
              )}
              {bundles.map((bundle) => (
                <tr key={bundle.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                        <MaterialIcon icon="package_2" className="text-primary" />
                      </div>
                      <span className="font-medium text-gray-800">{bundle.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{bundle.items.length} ürün</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs font-medium">
                      %{bundle.discount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bundle.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {bundle.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(bundle)}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <MaterialIcon icon="edit" className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(bundle)}
                        disabled={isPending}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Sil"
                      >
                        <MaterialIcon icon="delete" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
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
                {modal.mode === "create" ? "Yeni Kombin" : "Kombin Düzenle"}
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kombin Adı</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">İndirim (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formDiscount}
                  onChange={(e) => setFormDiscount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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

              {/* Items Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ürünler</label>
                <div className="flex items-center gap-2 mb-3">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Ürün seçin...</option>
                    {products
                      .filter((p) => !formItems.some((i) => i.productId === p.id))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    className="w-20 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={addItem}
                    className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <MaterialIcon icon="add" className="text-lg" />
                  </button>
                </div>
                {formItems.length > 0 && (
                  <div className="space-y-2 border border-gray-100 rounded-lg p-3">
                    {formItems.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between gap-2 py-1.5">
                        <span className="text-sm text-gray-700 flex-1 truncate">{getProductName(item.productId)}</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.productId, Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <MaterialIcon icon="close" className="text-base" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
