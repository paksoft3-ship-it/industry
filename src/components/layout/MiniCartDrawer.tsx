"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "@/components/ui/MaterialIcon";

interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
}

interface MiniCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCartDrawer({ isOpen, onClose }: MiniCartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold font-[family-name:var(--font-display)]">
            Sepetim
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <MaterialIcon icon="close" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MaterialIcon icon="shopping_cart" className="text-6xl mb-4" />
              <p className="text-lg font-medium">Sepetiniz boş</p>
              <p className="text-sm mt-1">Ürün ekleyerek başlayın.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 pb-4 border-b border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                    <Image src={item.image} alt={item.name} width={60} height={60} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/urun/${item.slug}`} className="font-medium text-sm hover:text-primary line-clamp-2">
                      {item.name}
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border rounded">
                        <button className="px-2 py-1 text-gray-400 hover:text-gray-600">
                          <MaterialIcon icon="remove" className="text-[16px]" />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button className="px-2 py-1 text-gray-400 hover:text-gray-600">
                          <MaterialIcon icon="add" className="text-[16px]" />
                        </button>
                      </div>
                      <p className="font-bold text-primary text-sm">
                        {(item.price * item.quantity).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-300 hover:text-red-500 self-start">
                    <MaterialIcon icon="delete_outline" className="text-[20px]" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Ara Toplam</span>
              <span className="text-xl font-bold text-gray-900">
                {subtotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
              </span>
            </div>
            <div className="flex gap-3">
              <Link
                href="/sepet"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-lg text-center font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Sepete Git
              </Link>
              <Link
                href="/odeme"
                onClick={onClose}
                className="flex-1 py-3 bg-primary text-white rounded-lg text-center font-bold text-sm hover:bg-primary-dark transition-colors"
              >
                Ödemeye Geç
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
