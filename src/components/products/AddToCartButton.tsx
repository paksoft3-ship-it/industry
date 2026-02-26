"use client";

import { useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  productId: string;
  inStock: boolean;
}

export default function AddToCartButton({ productId, inStock }: AddToCartButtonProps) {
  const { addItem, loading } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock || loading) return;
    await addItem(productId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!inStock || loading}
      title={inStock ? "Sepete Ekle" : "Stokta Yok"}
      className="h-10 w-10 rounded-lg bg-gray-100 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MaterialIcon icon={added ? "check" : "add_shopping_cart"} />
    </button>
  );
}
