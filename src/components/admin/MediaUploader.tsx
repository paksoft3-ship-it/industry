"use client";

import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import MaterialIcon from "@/components/ui/MaterialIcon";
import toast from "react-hot-toast";

interface UploadedFile {
    url: string;
    pathname: string;
    contentType?: string;
    size?: number;
}

interface MediaUploaderProps {
    folderPrefix: string;
    multiple?: boolean;
    accept?: string;
    maxFiles?: number;
    onUploaded: (items: UploadedFile[]) => void;
}

export default function MediaUploader({
    folderPrefix,
    multiple = false,
    accept = "image/*",
    maxFiles = 10,
    onUploaded,
}: MediaUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (!multiple && files.length > 1) {
            toast.error("Yalnızca bir dosya yükleyebilirsiniz.");
            return;
        }

        if (files.length > maxFiles) {
            toast.error(`Aynı anda en fazla ${maxFiles} dosya yükleyebilirsiniz.`);
            return;
        }

        setIsUploading(true);
        setProgress(0);

        const uploadedItems: UploadedFile[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Basic size validation
                const isPdf = file.type === "application/pdf";
                const maxSize = isPdf ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

                if (file.size > maxSize) {
                    toast.error(`${file.name} dosyası çok büyük (Max: ${isPdf ? '50MB' : '10MB'})`);
                    continue;
                }

                const randomStr = Math.random().toString(36).slice(2, 8);
                const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
                const pathname = `${folderPrefix}/${Date.now()}-${randomStr}-${safeName}`;

                const blob = await upload(pathname, file, {
                    access: "public",
                    handleUploadUrl: "/api/blob/upload",
                    onUploadProgress: (item) => {
                        // If multiple files, this progress is per file. 
                        // For simplicity, we show current file index + its percentage
                        const totalProgress = ((i / files.length) * 100) + (item.percentage / files.length);
                        setProgress(Math.round(totalProgress));
                    },
                });

                uploadedItems.push({
                    url: blob.url,
                    pathname: blob.pathname,
                    contentType: blob.contentType,
                    size: file.size,
                });
            }

            if (uploadedItems.length > 0) {
                onUploaded(uploadedItems);
                toast.success(`${uploadedItems.length} dosya yüklendi.`);
            }
        } catch (error) {
            console.error("Vercel Blob Upload detailed error:", error);
            const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu";
            toast.error(`Yükleme hatası: ${errorMessage}`);

            if (errorMessage.includes("Only admins can upload media")) {
                toast.error("Oturumunuz sona ermiş olabilir. Lütfen tekrar giriş yapın.");
            }
        } finally {
            setIsUploading(false);
            setProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full">
            <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
          flex flex-col items-center justify-center gap-3
          ${isUploading ? "bg-gray-50 border-gray-200 cursor-not-allowed" : "bg-white border-gray-300 hover:border-primary hover:bg-primary/5 shadow-sm"}
        `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    multiple={multiple}
                    className="hidden"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <MaterialIcon icon="cloud_upload" className="text-3xl animate-bounce" />
                        </div>
                        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm font-bold text-gray-700">Yükleniyor... %{progress}</p>
                    </div>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <MaterialIcon icon="add_photo_alternate" className="text-3xl" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-gray-800">
                                {multiple ? "Dosyaları sürükleyin veya seçin" : "Dosya seçmek için tıklayın"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, WEBP veya PDF (Max 10MB)
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
