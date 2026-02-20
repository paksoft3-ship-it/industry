"use client";
import { useState, useEffect } from "react";

const currencyRates: Record<string, { symbol: string; rate: number }> = {
  TRY: { symbol: "₺", rate: 1 },
  USD: { symbol: "$", rate: 0.031 },
  EUR: { symbol: "€", rate: 0.028 },
  AZN: { symbol: "₼", rate: 0.053 },
};

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
}

export default function PriceDisplay({ price, compareAtPrice, size = "md" }: PriceDisplayProps) {
  const [currency, setCurrency] = useState("TRY");

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved && currencyRates[saved]) setCurrency(saved);

    const handler = () => {
      const updated = localStorage.getItem("currency");
      if (updated && currencyRates[updated]) setCurrency(updated);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const { symbol, rate } = currencyRates[currency] || currencyRates.TRY;
  const convertedPrice = price * rate;
  const convertedCompare = compareAtPrice ? compareAtPrice * rate : null;

  const discountPercent = convertedCompare
    ? Math.round(((convertedCompare - convertedPrice) / convertedCompare) * 100)
    : null;

  const sizeClasses = {
    sm: { price: "text-lg", old: "text-xs" },
    md: { price: "text-xl", old: "text-sm" },
    lg: { price: "text-3xl", old: "text-sm" },
  };

  const locale = currency === "TRY" ? "tr-TR" : "en-US";

  return (
    <div>
      {convertedCompare && (
        <p className={`${sizeClasses[size].old} text-gray-400 line-through`}>
          {convertedCompare.toLocaleString(locale, { minimumFractionDigits: 2 })} {symbol}
        </p>
      )}
      <div className="flex items-center gap-2">
        <p className={`${sizeClasses[size].price} font-black text-primary`}>
          {convertedPrice.toLocaleString(locale, { minimumFractionDigits: 2 })} {symbol}
        </p>
        {discountPercent && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            -{discountPercent}%
          </span>
        )}
      </div>
    </div>
  );
}
