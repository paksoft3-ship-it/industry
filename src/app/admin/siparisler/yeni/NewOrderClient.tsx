"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import MaterialIcon from "@/components/ui/MaterialIcon";
import {
  searchCustomers,
  searchAdminProducts,
  getCustomerAddresses,
  createAdminOrder,
} from "@/lib/actions/orders";

type Customer = { id: string; firstName: string; lastName: string; email: string; phone: string | null };
type ProductResult = { id: string; name: string; sku: string; price: number; inStock: boolean; images: { url: string }[] };
type SavedAddress = { id: string; title: string; firstName: string; lastName: string; phone: string; city: string; district: string; address: string; postalCode: string | null };
type LineItem = { productId: string; name: string; sku: string; quantity: number; unitPrice: number };

function fmt(v: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(v);
}

export default function NewOrderClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ── Order type ────────────────────────────────────────────
  const [orderType, setOrderType] = useState<"ORDER" | "QUOTE">("ORDER");

  // ── Customer ──────────────────────────────────────────────
  const [customerType, setCustomerType] = useState<"registered" | "guest">("registered");
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const customerSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Products ──────────────────────────────────────────────
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState<ProductResult[]>([]);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const productSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Address ───────────────────────────────────────────────
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [addrFirstName, setAddrFirstName] = useState("");
  const [addrLastName, setAddrLastName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrDistrict, setAddrDistrict] = useState("");
  const [addrLine, setAddrLine] = useState("");
  const [addrPostal, setAddrPostal] = useState("");

  // ── Pricing ───────────────────────────────────────────────
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  // ── Quote extras ─────────────────────────────────────────
  const defaultExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [quoteExpiresAt, setQuoteExpiresAt] = useState(defaultExpiry);
  const [quoteNote, setQuoteNote] = useState("");

  // ── Derived pricing ───────────────────────────────────────
  const subtotal = lineItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shippingCost = subtotal >= 2000 ? 0 : 49.9;
  const total = subtotal - discount + shippingCost;

  // ── Customer search ───────────────────────────────────────
  useEffect(() => {
    if (customerType !== "registered" || customerSearch.length < 2) {
      setCustomerResults([]);
      return;
    }
    if (customerSearchTimer.current) clearTimeout(customerSearchTimer.current);
    customerSearchTimer.current = setTimeout(async () => {
      try {
        const results = await searchCustomers(customerSearch);
        setCustomerResults(results);
      } catch { /* silent */ }
    }, 300);
  }, [customerSearch, customerType]);

  // ── Product search ────────────────────────────────────────
  useEffect(() => {
    if (productSearch.length < 2) {
      setProductResults([]);
      return;
    }
    if (productSearchTimer.current) clearTimeout(productSearchTimer.current);
    productSearchTimer.current = setTimeout(async () => {
      try {
        const results = await searchAdminProducts(productSearch);
        setProductResults(results);
      } catch { /* silent */ }
    }, 300);
  }, [productSearch]);

  // ── Load customer addresses when a customer is selected ───
  useEffect(() => {
    if (!selectedCustomer) {
      setSavedAddresses([]);
      setSelectedAddressId("new");
      return;
    }
    getCustomerAddresses(selectedCustomer.id)
      .then((addrs) => {
        setSavedAddresses(addrs as SavedAddress[]);
        if (addrs.length > 0) setSelectedAddressId(addrs[0].id);
        else setSelectedAddressId("new");
      })
      .catch(() => { });
  }, [selectedCustomer]);

  // ── Pre-fill address form when a saved address is chosen ──
  useEffect(() => {
    if (selectedAddressId === "new") {
      if (selectedCustomer) {
        setAddrFirstName(selectedCustomer.firstName);
        setAddrLastName(selectedCustomer.lastName);
        setAddrPhone(selectedCustomer.phone ?? "");
      }
      return;
    }
    const addr = savedAddresses.find((a) => a.id === selectedAddressId);
    if (addr) {
      setAddrFirstName(addr.firstName);
      setAddrLastName(addr.lastName);
      setAddrPhone(addr.phone);
      setAddrCity(addr.city);
      setAddrDistrict(addr.district);
      setAddrLine(addr.address);
      setAddrPostal(addr.postalCode ?? "");
    }
  }, [selectedAddressId, savedAddresses, selectedCustomer]);

  function addProduct(p: ProductResult) {
    setProductSearch("");
    setProductResults([]);
    setLineItems((prev) => {
      const existing = prev.find((i) => i.productId === p.id);
      if (existing) return prev.map((i) => i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: p.id, name: p.name, sku: p.sku, quantity: 1, unitPrice: Number(p.price) }];
    });
  }

  function removeItem(productId: string) {
    setLineItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function updateItemQty(productId: string, qty: number) {
    if (qty < 1) return;
    setLineItems((prev) => prev.map((i) => i.productId === productId ? { ...i, quantity: qty } : i));
  }

  function updateItemPrice(productId: string, price: number) {
    if (price < 0) return;
    setLineItems((prev) => prev.map((i) => i.productId === productId ? { ...i, unitPrice: price } : i));
  }

  const needsAddressForm = selectedAddressId === "new";
  const addressFilled = !needsAddressForm || (addrFirstName && addrLastName && addrPhone && addrCity && addrDistrict && addrLine);
  const addressPayload = needsAddressForm
    ? { firstName: addrFirstName, lastName: addrLastName, phone: addrPhone, city: addrCity, district: addrDistrict, address: addrLine, postalCode: addrPostal || undefined }
    : null; // if a saved address was selected, we don't create a new one

  async function handleSubmit() {
    if (lineItems.length === 0) { toast.error("En az bir ürün ekleyin."); return; }
    if (orderType === "ORDER" && !addressFilled) { toast.error("Teslimat adresini doldurun."); return; }
    if (customerType === "guest" && !guestEmail.trim()) { toast.error("Misafir için e-posta adresi gereklidir."); return; }

    startTransition(async () => {
      try {
        const order = await createAdminOrder({
          type: orderType,
          userId: customerType === "registered" ? selectedCustomer?.id ?? null : null,
          guestEmail: customerType === "guest" ? guestEmail : null,
          address: orderType === "ORDER" ? addressPayload : (addressFilled && needsAddressForm ? addressPayload : null),
          items: lineItems,
          shippingCost,
          discount,
          notes: notes || undefined,
          quoteExpiresAt: orderType === "QUOTE" ? quoteExpiresAt : undefined,
          quoteNote: orderType === "QUOTE" && quoteNote ? quoteNote : undefined,
        });
        toast.success(orderType === "QUOTE" ? "Teklif oluşturuldu!" : "Sipariş oluşturuldu!");
        router.push(`/admin/siparisler/${order.id}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu.");
      }
    });
  }

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/siparisler" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <MaterialIcon icon="arrow_back" className="text-xl" />
        </Link>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Yeni Sipariş / Teklif</h1>
          <p className="text-sm text-gray-500 mt-0.5">Admin tarafından manuel oluşturma</p>
        </div>
      </div>

      {/* Order Type */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-gray-800 mb-4">İşlem Türü</h2>
        <div className="grid grid-cols-2 gap-3">
          {(["ORDER", "QUOTE"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                orderType === type ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <MaterialIcon icon={type === "ORDER" ? "shopping_bag" : "request_quote"} className={`text-2xl ${orderType === type ? "text-primary" : "text-gray-400"}`} />
              <div>
                <p className={`font-semibold text-sm ${orderType === type ? "text-primary" : "text-gray-700"}`}>
                  {type === "ORDER" ? "Manuel Sipariş" : "Teklif Ver"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {type === "ORDER" ? "Ödeme alındı, sipariş oluştur" : "Müşteriye teklif gönder"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Customer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-gray-800 mb-4">Müşteri</h2>
        <div className="flex gap-3 mb-4">
          {(["registered", "guest"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setCustomerType(t); setSelectedCustomer(null); setCustomerSearch(""); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                customerType === t ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t === "registered" ? "Kayıtlı Müşteri" : "Misafir / Manuel"}
            </button>
          ))}
        </div>

        {customerType === "registered" ? (
          <div className="relative">
            {selectedCustomer ? (
              <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                    <MaterialIcon icon="person" className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                    <p className="text-xs text-gray-500">{selectedCustomer.email}</p>
                  </div>
                </div>
                <button onClick={() => { setSelectedCustomer(null); setCustomerSearch(""); }} className="text-gray-400 hover:text-red-500 transition-colors">
                  <MaterialIcon icon="close" className="text-lg" />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Ad, soyad veya e-posta ile ara..."
                    className={`${inputCls} pl-10`}
                  />
                </div>
                {customerResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {customerResults.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCustomer(c); setCustomerSearch(""); setCustomerResults([]); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MaterialIcon icon="person" className="text-gray-400 text-sm" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800">{c.firstName} {c.lastName}</p>
                          <p className="text-xs text-gray-500">{c.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>E-posta <span className="text-red-500">*</span></label>
              <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="musteri@ornek.com" className={inputCls} />
            </div>
          </div>
        )}
      </div>

      {/* Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-gray-800 mb-4">Ürünler</h2>
        <div className="relative mb-4">
          <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Ürün adı veya SKU ile ara..."
            className={`${inputCls} pl-10`}
          />
          {productResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {productResults.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addProduct(p)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {p.images[0] ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" /> : <MaterialIcon icon="image" className="text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.sku} · {fmt(Number(p.price))}</p>
                  </div>
                  {!p.inStock && <span className="text-xs text-red-500 flex-shrink-0">Stok yok</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {lineItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            <MaterialIcon icon="inventory_2" className="text-3xl mb-2" />
            <p className="text-sm">Ürün aramak için yukarıdaki alanı kullanın</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
                  <th className="text-center py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Adet</th>
                  <th className="text-right py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Birim Fiyat</th>
                  <th className="text-right py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Toplam</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lineItems.map((item) => (
                  <tr key={item.productId}>
                    <td className="py-3">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.sku}</p>
                    </td>
                    <td className="py-3 text-center">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItemQty(item.productId, parseInt(e.target.value) || 1)}
                        className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </td>
                    <td className="py-3 text-right">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={item.unitPrice}
                        onChange={(e) => updateItemPrice(item.productId, parseFloat(e.target.value) || 0)}
                        className="w-28 text-right border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </td>
                    <td className="py-3 text-right font-medium text-gray-800">{fmt(item.unitPrice * item.quantity)}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => removeItem(item.productId)} className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded">
                        <MaterialIcon icon="delete_outline" className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Address (required for ORDER, optional for QUOTE) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-gray-800">
            Teslimat Adresi
            {orderType === "ORDER" && <span className="text-red-500 ml-1">*</span>}
            {orderType === "QUOTE" && <span className="text-xs font-normal text-gray-400 ml-2">(opsiyonel)</span>}
          </h2>
        </div>

        {savedAddresses.length > 0 && (
          <div className="mb-4">
            <label className={labelCls}>Kayıtlı Adresler</label>
            <select value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)} className={inputCls}>
              {savedAddresses.map((a) => (
                <option key={a.id} value={a.id}>{a.title} — {a.city} / {a.district}</option>
              ))}
              <option value="new">+ Yeni Adres Gir</option>
            </select>
          </div>
        )}

        {needsAddressForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Ad {orderType === "ORDER" && <span className="text-red-500">*</span>}</label>
              <input type="text" value={addrFirstName} onChange={(e) => setAddrFirstName(e.target.value)} placeholder="Ad" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Soyad {orderType === "ORDER" && <span className="text-red-500">*</span>}</label>
              <input type="text" value={addrLastName} onChange={(e) => setAddrLastName(e.target.value)} placeholder="Soyad" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Telefon {orderType === "ORDER" && <span className="text-red-500">*</span>}</label>
              <input type="tel" value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} placeholder="+90 5xx xxx xx xx" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Şehir {orderType === "ORDER" && <span className="text-red-500">*</span>}</label>
              <input type="text" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} placeholder="İstanbul" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>İlçe {orderType === "ORDER" && <span className="text-red-500">*</span>}</label>
              <input type="text" value={addrDistrict} onChange={(e) => setAddrDistrict(e.target.value)} placeholder="Kadıköy" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Posta Kodu</label>
              <input type="text" value={addrPostal} onChange={(e) => setAddrPostal(e.target.value)} placeholder="34700" className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Açık Adres {orderType === "ORDER" && <span className="text-red-500">*</span>}</label>
              <textarea value={addrLine} onChange={(e) => setAddrLine(e.target.value)} placeholder="Mahalle, sokak, bina no, daire..." rows={2} className={`${inputCls} resize-none`} />
            </div>
          </div>
        )}
      </div>

      {/* Pricing & Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-gray-800 mb-4">Fiyatlandırma & Notlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelCls}>İndirim (₺)</label>
            <input type="number" min={0} step={0.01} value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Kargo Ücreti (Otomatik)</label>
            <input type="text" value={shippingCost === 0 ? "Ücretsiz" : fmt(shippingCost)} readOnly className={`${inputCls} bg-gray-50 text-gray-500 cursor-default`} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>İç Not</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="İç not (müşteriye gönderilmez)..." rows={2} className={`${inputCls} resize-none`} />
          </div>
        </div>
      </div>

      {/* Quote extras */}
      {orderType === "QUOTE" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <MaterialIcon icon="request_quote" className="text-amber-600" />
            Teklif Ayarları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`${labelCls} text-amber-800`}>Geçerlilik Tarihi</label>
              <input type="date" value={quoteExpiresAt} onChange={(e) => setQuoteExpiresAt(e.target.value)} className={`${inputCls} border-amber-200 focus:border-amber-400 focus:ring-amber-200`} />
            </div>
            <div className="md:col-span-1">
              <label className={`${labelCls} text-amber-800`}>Teklif Notu (müşteriye gösterilir)</label>
              <textarea value={quoteNote} onChange={(e) => setQuoteNote(e.target.value)} placeholder="Teklife özel şartlar, notlar..." rows={2} className={`${inputCls} border-amber-200 focus:border-amber-400 focus:ring-amber-200 resize-none`} />
            </div>
          </div>
        </div>
      )}

      {/* Summary + Submit */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-8">
              <span className="text-gray-500 w-28">Ara Toplam:</span>
              <span className="font-medium text-gray-800">{fmt(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center gap-8">
                <span className="text-gray-500 w-28">İndirim:</span>
                <span className="font-medium text-red-600">-{fmt(discount)}</span>
              </div>
            )}
            <div className="flex items-center gap-8">
              <span className="text-gray-500 w-28">Kargo:</span>
              <span className={shippingCost === 0 ? "font-medium text-green-600" : "font-medium text-gray-800"}>
                {shippingCost === 0 ? "Ücretsiz" : fmt(shippingCost)}
              </span>
            </div>
            <div className="flex items-center gap-8 pt-2 border-t border-gray-100 mt-1">
              <span className="font-semibold text-gray-700 w-28">Genel Toplam:</span>
              <span className="font-bold text-primary text-lg">{fmt(total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/siparisler" className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              İptal
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isPending || lineItems.length === 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                orderType === "QUOTE"
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-primary hover:bg-primary/90 text-white"
              }`}
            >
              <MaterialIcon icon={isPending ? "progress_activity" : orderType === "QUOTE" ? "send" : "check_circle"} className={`text-lg ${isPending ? "animate-spin" : ""}`} />
              {isPending ? "İşleniyor..." : orderType === "QUOTE" ? "Teklif Oluştur & Gönder" : "Siparişi Oluştur"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
