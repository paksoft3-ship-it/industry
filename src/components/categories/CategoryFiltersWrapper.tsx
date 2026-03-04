
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import CategoryFilters from "./CategoryFilters";

export default function CategoryFiltersWrapper({
    category,
    selectedFilters,
    categoryBrands = [],
}: {
    category: any;
    selectedFilters: Record<string, string[]>;
    categoryBrands?: { name: string; slug: string }[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleFilterChange = (id: string, values: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(id);
        values.forEach(v => params.append(id, v));
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePriceChange = (min: string, max: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("minPrice");
        params.delete("maxPrice");
        if (min) params.set("minPrice", min);
        if (max) params.set("maxPrice", max);
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    };

    const formattedFilters = (category.categoryFilters || []).map((f: any) => {
        // Brand filter: populate options from real category brands
        if (f.builtinKey === "brand") {
            return {
                id: "brand",
                label: "Marka",
                type: f.uiType,
                options: categoryBrands.map(b => ({ value: b.slug, label: b.name })),
                isSearchable: f.isSearchable,
            };
        }

        // Price filter: no options needed, handled as RANGE
        if (f.builtinKey === "price") {
            return {
                id: "price",
                label: "Fiyat (TRY)",
                type: f.uiType,
                options: [],
                isSearchable: false,
            };
        }

        // Custom attribute filter
        return {
            id: f.attribute?.key || f.id,
            label: f.attribute?.label || "Özellik",
            type: f.uiType,
            options: f.attribute?.options?.map((o: any) => ({
                value: o.value,
                label: o.value,
            })) || [],
            isSearchable: f.isSearchable,
        };
    // Only show filters that have options (or are price range)
    }).filter((f: any) => f.options.length > 0 || f.id === "price");

    return (
        <CategoryFilters
            filters={formattedFilters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onPriceChange={handlePriceChange}
        />
    );
}
