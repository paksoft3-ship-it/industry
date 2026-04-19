"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { submitContactForm } from "@/lib/actions/contact";

export default function ContactFormClient() {
  const [isPending, startTransition] = useTransition();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    startTransition(async () => {
      try {
        await submitContactForm({ name, email, phone: phone || undefined, subject, message });
        toast.success("Mesajınız gönderildi!");
        setSent(true);
        setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gönderim başarısız.");
      }
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <MaterialIcon icon="check_circle" className="text-4xl text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-primary">Mesajınız Alındı</h3>
        <p className="text-sm text-gray-500 max-w-xs">En kısa sürede sizinle iletişime geçeceğiz.</p>
        <button
          onClick={() => setSent(false)}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Ad</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Adınız"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Soyad</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Soyadınız"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">E-posta</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@email.com"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Telefon</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0(5XX) XXX XX XX"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Konu</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">Konu seçin</option>
          <option value="Satış">Satış</option>
          <option value="Teknik Destek">Teknik Destek</option>
          <option value="İade / Değişim">İade / Değişim</option>
          <option value="Diğer">Diğer</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Mesajınız</label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <MaterialIcon icon="send" className="text-xl" />
        {isPending ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
