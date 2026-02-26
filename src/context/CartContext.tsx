"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { addToCart, removeFromCart, updateCartQuantity } from "@/lib/actions/cart";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  loading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  loading: false,
  addItem: async () => {},
  removeItem: async () => {},
  updateItem: async () => {},
  refresh: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (productId: string, quantity = 1) => {
    setLoading(true);
    try {
      await addToCart(productId, quantity);
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    setLoading(true);
    try {
      await removeFromCart(productId);
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (productId: string, quantity: number) => {
    setLoading(true);
    try {
      await updateCartQuantity(productId, quantity);
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, loading, addItem, removeItem, updateItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
