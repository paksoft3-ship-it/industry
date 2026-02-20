"use client";
import { useState, useRef, useEffect } from "react";

const currencies = [
  { code: "TRY", symbol: "₺", flag: "🇹🇷" },
  { code: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", flag: "🇪🇺" },
  { code: "AZN", symbol: "₼", flag: "🇦🇿" },
];

export default function CurrencySwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(currencies[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("currency");
    if (saved) {
      const found = currencies.find((c) => c.code === saved);
      if (found) setSelected(found);
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (currency: typeof currencies[0]) => {
    setSelected(currency);
    localStorage.setItem("currency", currency.code);
    setIsOpen(false);
    // TODO: Trigger price recalculation across app
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors"
      >
        <span>{selected.flag}</span>
        <span>{selected.code}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleSelect(currency)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                selected.code === currency.code ? "bg-primary/5 text-primary font-medium" : "text-gray-600"
              }`}
            >
              <span>{currency.flag}</span>
              <span>{currency.code}</span>
              <span className="text-gray-400">({currency.symbol})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
