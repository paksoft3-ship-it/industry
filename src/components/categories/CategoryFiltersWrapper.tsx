
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import CategoryFilters from "./CategoryFilters";

export default function CategoryFiltersWrapper({
    category,
    selectedFilters
}: {
    category: any;
    selectedFilters: Record<string, string[]>;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleFilterChange = (id: string, values: string[]) => {
        const params = new URLSearchParams(searchParams.toString());

        // Remove current filter values
        params.delete(id);

        // Add new ones
        values.forEach(v => params.append(id, v));

        // Reset page on filter change
        params.delete("page");

        router.push(`${pathname}?${params.toString()}`);
    };

    const formattedFilters = (category.categoryFilters || []).map((f: any) => ({
        id: f.builtinKey || f.attribute?.key || f.id,
        label: f.attribute?.label || (f.builtinKey === "price" ? "Fiyat" : f.builtinKey === "brand" ? "Marka" : "Özellik"),
        type: f.uiType,
        options: f.attribute?.options?.map((o: any) => ({
            value: o.value,
            label: o.value,
        })) || [],
        isSearchable: f.isSearchable,
    }));

    return (
        <CategoryFilters
            filters={formattedFilters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
        />
    );
}
