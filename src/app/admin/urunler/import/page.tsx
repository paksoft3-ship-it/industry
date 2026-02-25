"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function AdminBulkImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        success?: boolean;
        message?: string;
        created?: number;
        skipped?: number;
        errors?: string[];
        error?: string;
    } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/products/import", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            setResult(data);
        } catch {
            setResult({ error: "Sunucu hatası oluştu." });
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    const csvTemplate = `SKU,Name,Price,CompareAtPrice,StockCount,Brand,Categories,Images,Description,Attributes,Currency,IsFeatured
CNC-1001,Sigma Profil 40x40,250.00,,1500,Mepa,"Sigma Profil,Bağlantı Parçaları",https://example.com/img1.jpg,"Yüksek kalite alüminyum profil","Malzeme:Alüminyum|Uzunluk:1000mm",TRY,false`;

    const xmlTemplate = `<Products>
  <Product>
    <SKU>CNC-1001</SKU>
    <Name>Sigma Profil 40x40</Name>
    <Price>250.00</Price>
    <StockCount>1500</StockCount>
    <Brand>Mepa</Brand>
    <Categories>
      <Category>Sigma Profil</Category>
    </Categories>
    <Images>
      <Image>https://example.com/img1.jpg</Image>
    </Images>
    <Description>Yüksek kalite profil</Description>
    <Attributes>
      <Attribute name="Malzeme">Alüminyum</Attribute>
    </Attributes>
    <Currency>TRY</Currency>
  </Product>
</Products>`;

    const downloadTemplate = (content: string, filename: string) => {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Link href="/admin/urunler" className="text-gray-400 hover:text-primary transition-colors">
                            <MaterialIcon icon="arrow_back" className="text-xl" />
                        </Link>
                        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">
                            Toplu Ürün Yükleme
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 ml-9">
                        CSV, XML veya JSON dosyası ile binlerce ürünü tek seferde ekleyin.
                    </p>
                </div>
            </div>

            {/* Template Downloads */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MaterialIcon icon="download" className="text-primary text-xl" />
                    Şablon Dosyaları
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    Doğru formatta veri hazırlamak için aşağıdaki şablonları indirebilirsiniz.
                </p>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => downloadTemplate(csvTemplate, "urun_sablonu.csv")}
                        className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                    >
                        <MaterialIcon icon="table_view" className="text-lg" />
                        CSV Şablonu İndir
                    </button>
                    <button
                        onClick={() => downloadTemplate(xmlTemplate, "urun_sablonu.xml")}
                        className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
                    >
                        <MaterialIcon icon="code" className="text-lg" />
                        XML Şablonu İndir
                    </button>
                </div>
            </div>

            {/* Required Fields Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MaterialIcon icon="info" className="text-blue-500 text-xl" />
                    Alan Açıklamaları
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="flex gap-2">
                        <span className="font-mono text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">SKU</span>
                        <span className="text-gray-600">Ürün kodu — Zorunlu, benzersiz</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-mono text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">Name</span>
                        <span className="text-gray-600">Ürün adı — Zorunlu</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-mono text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">Price</span>
                        <span className="text-gray-600">Satış fiyatı — Zorunlu</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">CompareAtPrice</span>
                        <span className="text-gray-600">İndirim öncesi fiyat</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">StockCount</span>
                        <span className="text-gray-600">Stok adedi</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Brand</span>
                        <span className="text-gray-600">Marka adı (yoksa oluşturulur)</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Categories</span>
                        <span className="text-gray-600">Kategori adları (virgülle ayrılmış)</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Images</span>
                        <span className="text-gray-600">Görsel URL&apos;leri (virgülle ayrılmış)</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Description</span>
                        <span className="text-gray-600">Ürün açıklaması</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Attributes</span>
                        <span className="text-gray-600">Teknik özellikler (Key:Value|Key:Value)</span>
                    </div>
                </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MaterialIcon icon="upload_file" className="text-primary text-xl" />
                    Dosya Yükle
                </h2>
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${dragOver
                            ? "border-primary bg-primary/5"
                            : file
                                ? "border-green-400 bg-green-50"
                                : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
                        }`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".csv,.tsv,.txt,.xml,.json"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    {file ? (
                        <div className="flex flex-col items-center gap-2">
                            <MaterialIcon icon="check_circle" className="text-5xl text-green-500" />
                            <p className="font-semibold text-green-700">{file.name}</p>
                            <p className="text-sm text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB — Değiştirmek için tıklayın
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <MaterialIcon icon="cloud_upload" className="text-5xl text-gray-300" />
                            <p className="font-semibold text-gray-600">Dosyayı sürükleyin veya tıklayın</p>
                            <p className="text-sm text-gray-400">CSV, XML veya JSON formatları desteklenir</p>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <MaterialIcon icon="hourglass_empty" className="text-lg animate-spin" />
                                Yükleniyor...
                            </>
                        ) : (
                            <>
                                <MaterialIcon icon="upload" className="text-lg" />
                                Ürünleri İçe Aktar
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className={`rounded-xl border p-6 ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <h3 className={`font-semibold mb-2 flex items-center gap-2 ${result.success ? "text-green-800" : "text-red-800"}`}>
                        <MaterialIcon icon={result.success ? "check_circle" : "error"} className="text-xl" />
                        {result.success ? "İçe Aktarma Tamamlandı" : "Hata"}
                    </h3>
                    <p className={`text-sm mb-3 ${result.success ? "text-green-700" : "text-red-700"}`}>
                        {result.message || result.error}
                    </p>
                    {result.success && (
                        <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-1.5">
                                <div className="size-3 rounded-full bg-green-500" />
                                <span className="text-green-700 font-medium">{result.created} oluşturuldu</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="size-3 rounded-full bg-yellow-400" />
                                <span className="text-yellow-700 font-medium">{result.skipped} atlandı (mevcut SKU)</span>
                            </div>
                            {result.errors && result.errors.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                    <div className="size-3 rounded-full bg-red-500" />
                                    <span className="text-red-700 font-medium">{result.errors.length} hata</span>
                                </div>
                            )}
                        </div>
                    )}
                    {result.errors && result.errors.length > 0 && (
                        <details className="mt-4">
                            <summary className="text-sm text-red-600 cursor-pointer hover:underline font-medium">
                                Hata Detayları ({result.errors.length})
                            </summary>
                            <ul className="mt-2 space-y-1 text-xs text-red-600 max-h-48 overflow-y-auto">
                                {result.errors.map((err, i) => (
                                    <li key={i} className="flex gap-1">
                                        <span>•</span>
                                        <span>{err}</span>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    )}
                    {result.success && (
                        <div className="mt-4">
                            <Link
                                href="/admin/urunler"
                                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                <MaterialIcon icon="inventory_2" className="text-lg" />
                                Ürünleri Görüntüle
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
