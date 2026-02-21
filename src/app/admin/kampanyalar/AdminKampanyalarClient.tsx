"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { createCoupon, updateCoupon, deleteCoupon } from "@/lib/actions/coupons";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

type ModalState = {
  open: boolean;
  mode: "create" | "edit";
  coupon: Coupon | null;
};

function getStatus(coupon: Coupon): { label: string; className: string } {
  const now = new Date();
  if (coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt) > now)) {
    return { label: "Aktif", className: "bg-green-100 text-green-700" };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) <= now) {
    return { label: "Süresi Dolmuş", className: "bg-red-100 text-red-600" };
  }
  return { label: "Pasif", className: "bg-gray-100 text-gray-500" };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function toDateInputValue(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}

export default function AdminKampanyalarClient({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState<ModalState>({ open: false, mode: "create", coupon: null });

  // Form state
  const [formCode, setFormCode] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDiscountType, setFormDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [formDiscountValue, setFormDiscountValue] = useState("");
  const [formMinOrderAmount, setFormMinOrderAmount] = useState("");
  const [formMaxUses, setFormMaxUses] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formStartsAt, setFormStartsAt] = useState("");
  const [formExpiresAt, setFormExpiresAt] = useState("");

  const filteredCoupons = searchTerm
    ? coupons.filter((c) => c.code.toLowerCase().includes(searchTerm.toLowerCase()))
    : coupons;

  function openCreateModal() {
    setFormCode("");
    setFormDescription("");
    setFormDiscountType("PERCENTAGE");
    setFormDiscountValue("");
    setFormMinOrderAmount("");
    setFormMaxUses("");
    setFormIsActive(true);
    setFormStartsAt("");
    setFormExpiresAt("");
    setModal({ open: true, mode: "create", coupon: null });
  }

  function openEditModal(coupon: Coupon) {
    setFormCode(coupon.code);
    setFormDescription(coupon.description || "");
    setFormDiscountType(coupon.discountType as "PERCENTAGE" | "FIXED");
    setFormDiscountValue(String(coupon.discountValue));
    setFormMinOrderAmount(coupon.minOrderAmount != null ? String(coupon.minOrderAmount) : "");
    setFormMaxUses(coupon.maxUses != null ? String(coupon.maxUses) : "");
    setFormIsActive(coupon.isActive);
    setFormStartsAt(toDateInputValue(coupon.startsAt));
    setFormExpiresAt(toDateInputValue(coupon.expiresAt));
    setModal({ open: true, mode: "edit", coupon });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formCode || !formDiscountValue) {
      toast.error("Kupon kodu ve indirim değeri zorunludur");
      return;
    }

    startTransition(async () => {
      try {
        if (modal.mode === "create") {
          await createCoupon({
            code: formCode.toUpperCase(),
            description: formDescription || undefined,
            discountType: formDiscountType,
            discountValue: Number(formDiscountValue),
            minOrderAmount: formMinOrderAmount ? Number(formMinOrderAmount) : undefined,
            maxUses: formMaxUses ? Number(formMaxUses) : undefined,
            isActive: formIsActive,
            startsAt: formStartsAt || undefined,
            expiresAt: formExpiresAt || undefined,
          });
          toast.success("Kupon oluşturuldu");
        } else if (modal.coupon) {
          await updateCoupon(modal.coupon.id, {
            code: formCode.toUpperCase(),
            description: formDescription || undefined,
            discountType: formDiscountType,
            discountValue: Number(formDiscountValue),
            minOrderAmount: formMinOrderAmount ? Number(formMinOrderAmount) : undefined,
            maxUses: formMaxUses ? Number(formMaxUses) : undefined,
            isActive: formIsActive,
            startsAt: formStartsAt || null,
            expiresAt: formExpiresAt || null,
          });
          toast.success("Kupon güncellendi");
        }
        setModal({ open: false, mode: "create", coupon: null });
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "İşlem başarısız");
      }
    });
  }

  function handleDelete(coupon: Coupon) {
    if (!confirm(`"${coupon.code}" kuponunu silmek istediğinize emin misiniz?`)) return;
    startTransition(async () => {
      try {
        await deleteCoupon(coupon.id);
        toast.success("Kupon silindi");
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
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Kampanyalar & Kuponlar</h1>
          <p className="text-sm text-gray-500 mt-1">{coupons.length} kupon kayıtlı</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <MaterialIcon icon="add" className="text-lg" />
          Yeni Kupon
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
            placeholder="Kupon kodu ile ara..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kod</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tur</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Deger</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Min. Siparis</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kullanim</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Bitis</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Islemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    Henuz kupon bulunmuyor.
                  </td>
                </tr>
              )}
              {filteredCoupons.map((coupon) => {
                const status = getStatus(coupon);
                return (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-bold text-primary">{coupon.code}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {coupon.discountType === "PERCENTAGE" ? "Yuzde" : "Sabit"}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {coupon.discountType === "PERCENTAGE"
                        ? `%${coupon.discountValue}`
                        : `₺${coupon.discountValue.toLocaleString("tr-TR")}`}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {coupon.minOrderAmount != null
                        ? `₺${coupon.minOrderAmount.toLocaleString("tr-TR")}`
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {coupon.usedCount}/{coupon.maxUses ?? "∞"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(coupon.expiresAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Duzenle"
                      >
                        <MaterialIcon icon="edit" className="text-[18px]" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon)}
                        disabled={isPending}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 ml-1"
                        title="Sil"
                      >
                        <MaterialIcon icon="delete" className="text-[18px]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
                {modal.mode === "create" ? "Yeni Kupon" : "Kupon Duzenle"}
              </h2>
              <button
                onClick={() => setModal({ ...modal, open: false })}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <MaterialIcon icon="close" className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kupon Kodu</label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  placeholder="ORNEK10"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Aciklama</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Indirim Turu</label>
                  <select
                    value={formDiscountType}
                    onChange={(e) => setFormDiscountType(e.target.value as "PERCENTAGE" | "FIXED")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  >
                    <option value="PERCENTAGE">Yuzde (%)</option>
                    <option value="FIXED">Sabit (₺)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Indirim Degeri</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={formDiscountValue}
                    onChange={(e) => setFormDiscountValue(e.target.value)}
                    placeholder={formDiscountType === "PERCENTAGE" ? "10" : "100"}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Min Order & Max Uses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Min. Siparis Tutari (₺)</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={formMinOrderAmount}
                    onChange={(e) => setFormMinOrderAmount(e.target.value)}
                    placeholder="500"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Maks. Kullanim</label>
                  <input
                    type="number"
                    min="0"
                    value={formMaxUses}
                    onChange={(e) => setFormMaxUses(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Baslangic Tarihi</label>
                  <input
                    type="date"
                    value={formStartsAt}
                    onChange={(e) => setFormStartsAt(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bitis Tarihi</label>
                  <input
                    type="date"
                    value={formExpiresAt}
                    onChange={(e) => setFormExpiresAt(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Aktif</span>
              </label>

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
                  {isPending ? "Kaydediliyor..." : modal.mode === "create" ? "Olustur" : "Guncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
