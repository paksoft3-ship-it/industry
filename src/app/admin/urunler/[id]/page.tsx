"use client";

import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useState } from "react";

export default function AdminProductEditPage() {
  const [attributes, setAttributes] = useState([
    { key: "Malzeme", value: "Krom Çelik" },
    { key: "Ağırlık", value: "0.5 kg" },
    { key: "İç Çap", value: "25 mm" },
  ]);

  const addAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/urunler"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MaterialIcon icon="arrow_back" className="text-xl" />
          </Link>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Ürün Düzenle</h1>
            <p className="text-sm text-gray-500 mt-0.5">Ürün bilgilerini güncelleyin</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <MaterialIcon icon="visibility" className="text-lg" />
            Önizle
          </button>
          <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <MaterialIcon icon="save" className="text-lg" />
            Kaydet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Temel Bilgiler
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ürün Adı</label>
                <input
                  type="text"
                  defaultValue="Endüstriyel Rulman 6205-2RS"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                  <input
                    type="text"
                    defaultValue="endustriyel-rulman-6205-2rs"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU</label>
                  <input
                    type="text"
                    defaultValue="RLM-6205"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
                <textarea
                  rows={5}
                  defaultValue="Yüksek kaliteli endüstriyel rulman. Çift taraflı kauçuk conta ile korumalı. Yüksek hız ve düşük gürültü performansı sunar."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Fiyatlandırma
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Satış Fiyatı (₺)</label>
                <input
                  type="text"
                  defaultValue="245,00"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">İndirimli Fiyat (₺)</label>
                <input
                  type="text"
                  placeholder="Opsiyonel"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">KDV Oranı (%)</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option>20</option>
                  <option>10</option>
                  <option>1</option>
                  <option>0</option>
                </select>
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800">
                Özellikler
              </h2>
              <button
                onClick={addAttribute}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <MaterialIcon icon="add_circle" className="text-lg" />
                Özellik Ekle
              </button>
            </div>
            <div className="space-y-3">
              {attributes.map((attr, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={attr.key}
                    onChange={(e) => {
                      const updated = [...attributes];
                      updated[index].key = e.target.value;
                      setAttributes(updated);
                    }}
                    placeholder="Özellik adı"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => {
                      const updated = [...attributes];
                      updated[index].value = e.target.value;
                      setAttributes(updated);
                    }}
                    placeholder="Değer"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    onClick={() => removeAttribute(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <MaterialIcon icon="close" className="text-lg" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Durum
            </h2>
            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option>Aktif</option>
              <option>Pasif</option>
              <option>Taslak</option>
            </select>
          </div>

          {/* Category & Brand */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Kategori & Marka
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option>Rulmanlar</option>
                  <option>Kayışlar ve Kasnaklar</option>
                  <option>Lineer Hareket</option>
                  <option>Pnömatik</option>
                  <option>Hidrolik</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Marka</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option>SKF</option>
                  <option>NSK</option>
                  <option>FAG</option>
                  <option>HIWIN</option>
                  <option>Festo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Görseller
            </h2>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-primary">
                <MaterialIcon icon="image" className="text-gray-400 text-2xl" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <MaterialIcon icon="image" className="text-gray-400 text-2xl" />
              </div>
              <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                <MaterialIcon icon="add" className="text-gray-400 text-2xl" />
              </div>
            </div>
            <button className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary/30 hover:text-primary transition-colors flex items-center justify-center gap-2">
              <MaterialIcon icon="cloud_upload" className="text-lg" />
              Görsel Yükle
            </button>
          </div>

          {/* Stock */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gray-800 mb-4">
              Stok Bilgisi
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stok Miktarı</label>
                <input
                  type="number"
                  defaultValue={150}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Min. Stok Uyarısı</label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
