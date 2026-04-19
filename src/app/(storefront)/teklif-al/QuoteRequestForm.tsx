"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { submitQuoteRequest } from "@/lib/actions/quoteRequests";

export default function QuoteRequestForm() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [products, setProducts] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await submitQuoteRequest({ name, company, email, phone, products, quantity, notes });
        toast.success("Teklif talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.");
        setSent(true);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gönderim başarısız.");
      }
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <MaterialIcon icon="check_circle" className="text-5xl text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-primary">Talebiniz Alındı!</h3>
        <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
          Teklif talebiniz başarıyla gönderildi. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={() => { setSent(false); setName(""); setCompany(""); setEmail(""); setPhone(""); setProducts(""); setQuantity(""); setNotes(""); }}
            className="px-6 py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            Yeni Teklif Talebi
          </button>
          <a
            href="/"
            className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors text-center"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Contact Info */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">İletişim Bilgileri</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Ad Soyad <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınız Soyadınız"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Firma Adı</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Şirket adı (opsiyonel)"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">E-posta <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@firma.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0(5XX) XXX XX XX"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
        </div>
      </div>

      {/* Request Details */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Teklif Detayları</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">
              Talep Edilen Ürün / Hizmet <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={products}
              onChange={(e) => setProducts(e.target.value)}
              placeholder="Talep ettiğiniz ürün veya hizmetleri açıklayınız. Örn: CNC Torna Tezgahı, model veya özellik bilgisi varsa belirtiniz..."
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Miktar / Adet</label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Örn: 2 adet, 5 takım..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Ek Notlar</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Teslimat süresi, özel gereksinimler veya eklemek istediğiniz bilgiler..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 bg-secondary text-white rounded-lg font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
      >
        <MaterialIcon icon="request_quote" className="text-xl" />
        {isPending ? "Gönderiliyor..." : "Teklif Talebini Gönder"}
      </button>
    </form>
  );
}
