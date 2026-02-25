
"use client";

import { useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { FilterUiType } from "@prisma/client";

interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface FilterGroup {
    id: string;
    label: string;
    type: FilterUiType;
    builtinKey?: string | null;
    attributeId?: string | null;
    attributeKey?: string | null;
    options: FilterOption[];
    isSearchable: boolean;
}

interface CategoryFiltersProps {
    filters: FilterGroup[];
    selectedFilters: Record<string, string[]>;
    onFilterChange: (id: string, values: string[]) => void;
}

export default function CategoryFilters({
    filters,
    selectedFilters,
    onFilterChange,
}: CategoryFiltersProps) {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
        Object.fromEntries(filters.map(f => [f.id, true]))
    );

    const toggleGroup = (id: string) => {
        setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (!filters || filters.length === 0) return null;

    return (
        <div className="space-y-6">
            {filters.map((group) => {
                const isExpanded = expandedGroups[group.id];
                const selected = selectedFilters[group.id] || [];

                return (
                    <div key={group.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <button
                            onClick={() => toggleGroup(group.id)}
                            className="flex items-center justify-between w-full mb-4 text-left group"
                        >
                            <span className="font-bold text-gray-800 font-[family-name:var(--font-display)] group-hover:text-primary transition-colors">
                                {group.label}
                            </span>
                            <MaterialIcon
                                icon={isExpanded ? "expand_less" : "expand_more"}
                                className="text-gray-400 group-hover:text-primary transition-colors"
                            />
                        </button>

                        {isExpanded && (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {group.options.map((option) => {
                                    const isChecked = selected.includes(option.value);

                                    return (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-3 cursor-pointer group/item"
                                        >
                                            <div className="relative flex items-center">
                                                <input
                                                    type={group.type === FilterUiType.RADIO ? "radio" : "checkbox"}
                                                    name={group.id}
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        if (group.type === FilterUiType.RADIO) {
                                                            onFilterChange(group.id, [option.value]);
                                                        } else {
                                                            const next = isChecked
                                                                ? selected.filter(v => v !== option.value)
                                                                : [...selected, option.value];
                                                            onFilterChange(group.id, next);
                                                        }
                                                    }}
                                                    className={`appearance-none size-5 border-2 border-gray-200 ${group.type === FilterUiType.RADIO ? "rounded-full" : "rounded"
                                                        } checked:border-primary checked:bg-primary transition-all cursor-pointer`}
                                                />
                                                {isChecked && group.type !== FilterUiType.RADIO && (
                                                    <MaterialIcon
                                                        icon="check"
                                                        className="absolute inset-0 text-white text-[16px] pointer-events-none"
                                                    />
                                                )}
                                                {isChecked && group.type === FilterUiType.RADIO && (
                                                    <div className="absolute inset-1.5 bg-white rounded-full pointer-events-none" />
                                                )}
                                            </div>
                                            <span className={`text-sm ${isChecked ? "text-gray-900 font-medium" : "text-gray-600 group-hover/item:text-gray-800"}`}>
                                                {option.label}
                                            </span>
                                            {option.count !== undefined && (
                                                <span className="ml-auto text-xs text-gray-400">({option.count})</span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
