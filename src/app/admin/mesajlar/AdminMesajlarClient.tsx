"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { markMessageRead, deleteContactMessage } from "@/lib/actions/contact";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminMesajlarClient({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Message | null>(null);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  function openMessage(msg: Message) {
    setSelected(msg);
    if (!msg.isRead) {
      startTransition(async () => {
        await markMessageRead(msg.id);
        router.refresh();
      });
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      try {
        await deleteContactMessage(id);
        toast.success("Mesaj silindi");
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
            Mesajlar
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {messages.length} mesaj
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                {unreadCount} okunmamış
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {messages.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-400">
              <MaterialIcon icon="mail_outline" className="text-4xl mb-2 block" />
              Henüz mesaj yok.
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {messages.map((msg) => (
                <li key={msg.id}>
                  <button
                    onClick={() => openMessage(msg)}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${
                      selected?.id === msg.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                          <span className={`text-sm truncate ${!msg.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                            {msg.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{msg.subject}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" })}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <MaterialIcon icon="mark_email_unread" className="text-4xl mb-2" />
              <p className="text-sm">Görüntülemek için bir mesaj seçin</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selected.subject}</h3>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(selected.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  disabled={isPending}
                  className="text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors p-1"
                  title="Sil"
                >
                  <MaterialIcon icon="delete" className="text-xl" />
                </button>
              </div>

              {/* Sender Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MaterialIcon icon="person" className="text-gray-400 text-base" />
                  <span className="font-medium text-gray-700">{selected.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MaterialIcon icon="mail" className="text-gray-400 text-base" />
                  <a href={`mailto:${selected.email}`} className="text-primary hover:underline">
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <MaterialIcon icon="phone" className="text-gray-400 text-base" />
                    <a href={`tel:${selected.phone}`} className="text-primary hover:underline">
                      {selected.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>

              {/* Quick Reply */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <MaterialIcon icon="reply" className="text-base" />
                  E-posta ile Yanıtla
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
