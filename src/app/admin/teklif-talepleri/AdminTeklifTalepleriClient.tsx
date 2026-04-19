"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { markQuoteRequestRead, updateQuoteRequestStatus, deleteQuoteRequest } from "@/lib/actions/quoteRequests";

type QuoteRequest = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  products: string;
  quantity: string | null;
  notes: string | null;
  status: string;
  isRead: boolean;
  createdAt: string;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW:        { label: "Yeni",          color: "bg-blue-100 text-blue-700" },
  IN_PROGRESS:{ label: "İşlemde",       color: "bg-yellow-100 text-yellow-700" },
  QUOTED:     { label: "Teklif Verildi",color: "bg-green-100 text-green-700" },
  CLOSED:     { label: "Kapatıldı",     color: "bg-gray-100 text-gray-600" },
};

export default function AdminTeklifTalepleriClient({ requests }: { requests: QuoteRequest[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const [filter, setFilter] = useState("ALL");

  const unreadCount = requests.filter((r) => !r.isRead).length;

  const filtered = filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  function openRequest(req: QuoteRequest) {
    setSelected(req);
    if (!req.isRead) {
      startTransition(async () => {
        await markQuoteRequestRead(req.id);
        router.refresh();
      });
    }
  }

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => {
      try {
        await updateQuoteRequestStatus(id, status);
        if (selected?.id === id) setSelected({ ...selected, status });
        router.refresh();
      } catch {
        toast.error("Durum güncellenemedi");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Bu teklif talebini silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      try {
        await deleteQuoteRequest(id);
        toast.success("Teklif talebi silindi");
        if (selected?.id === id) setSelected(null);
        router.refresh();
      } catch {
        toast.error("Silme başarısız");
      }
    });
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-800">
            Teklif Talepleri
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {requests.length} talep
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                {unreadCount} okunmamış
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/siparisler/yeni"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <MaterialIcon icon="add" className="text-[20px]" />
          Yeni Teklif/Sipariş
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", "NEW", "IN_PROGRESS", "QUOTED", "CLOSED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === s
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
            }`}
          >
            {s === "ALL" ? "Tümü" : STATUS_LABELS[s]?.label}
            {s === "ALL" && requests.length > 0 && (
              <span className="ml-1.5 opacity-70">{requests.length}</span>
            )}
            {s !== "ALL" && (
              <span className="ml-1.5 opacity-70">{requests.filter((r) => r.status === s).length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Request List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-400">
              <MaterialIcon icon="request_quote" className="text-4xl mb-2 block" />
              Teklif talebi yok.
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((req) => (
                <li key={req.id}>
                  <button
                    onClick={() => openRequest(req)}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${
                      selected?.id === req.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {!req.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                          <span className={`text-sm truncate ${!req.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                            {req.name}
                          </span>
                        </div>
                        {req.company && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">{req.company}</p>
                        )}
                        <p className="text-xs text-gray-400 truncate mt-0.5">{req.products}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(req.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" })}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_LABELS[req.status]?.color || "bg-gray-100 text-gray-600"}`}>
                          {STATUS_LABELS[req.status]?.label || req.status}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Request Detail */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <MaterialIcon icon="request_quote" className="text-4xl mb-2" />
              <p className="text-sm">Görüntülemek için bir talep seçin</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Top: status + delete */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Teklif Talebi</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(selected.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selected.status}
                    onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                    disabled={isPending}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="NEW">Yeni</option>
                    <option value="IN_PROGRESS">İşlemde</option>
                    <option value="QUOTED">Teklif Verildi</option>
                    <option value="CLOSED">Kapatıldı</option>
                  </select>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    disabled={isPending}
                    className="text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors p-1"
                    title="Sil"
                  >
                    <MaterialIcon icon="delete" className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Sender Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <MaterialIcon icon="person" className="text-gray-400 text-base flex-shrink-0" />
                  <span className="font-medium text-gray-700">{selected.name}</span>
                </div>
                {selected.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <MaterialIcon icon="business" className="text-gray-400 text-base flex-shrink-0" />
                    <span className="text-gray-600">{selected.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MaterialIcon icon="mail" className="text-gray-400 text-base flex-shrink-0" />
                  <a href={`mailto:${selected.email}`} className="text-primary hover:underline truncate">
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <MaterialIcon icon="phone" className="text-gray-400 text-base flex-shrink-0" />
                    <a href={`tel:${selected.phone}`} className="text-primary hover:underline">
                      {selected.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Request Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Talep Edilen Ürün / Hizmet</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{selected.products}</p>
                </div>
                {selected.quantity && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Miktar / Adet</p>
                    <p className="text-sm text-gray-700">{selected.quantity}</p>
                  </div>
                )}
                {selected.notes && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Ek Notlar</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Teklif: ${encodeURIComponent(selected.products.slice(0, 50))}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <MaterialIcon icon="reply" className="text-base" />
                  E-posta ile Yanıtla
                </a>
                <Link
                  href="/admin/siparisler/yeni"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors"
                >
                  <MaterialIcon icon="add_shopping_cart" className="text-base" />
                  Teklif/Sipariş Oluştur
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
