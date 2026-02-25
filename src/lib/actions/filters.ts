
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { FilterUiType } from "@prisma/client";

export async function getCategoryFilters(categoryId: string, includeInherited = true): Promise<any[]> {
    if (!includeInherited) {
        return prisma.categoryFilter.findMany({
            where: { categoryId },
            include: { attribute: true },
            orderBy: { order: "asc" },
        });
    }

    // Get current category filters
    const filters = await prisma.categoryFilter.findMany({
        where: { categoryId },
        include: { attribute: true },
        orderBy: { order: "asc" },
    });

    // Get parent category filters if any
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { parentId: true },
    });

    if (category?.parentId) {
        const parentFilters = await getCategoryFilters(category.parentId, true);
        // Filter parent filters that are marked as isInherited and not overridden locally
        const inherited = parentFilters.filter(pf =>
            pf.isInherited &&
            !filters.some(f => (f.attributeId && f.attributeId === pf.attributeId) || (f.builtinKey && f.builtinKey === pf.builtinKey))
        );
        return [...inherited, ...filters].sort((a, b) => a.order - b.order);
    }

    return filters;
}

export async function addCategoryFilter(data: {
    categoryId: string;
    attributeId?: string;
    builtinKey?: string;
    uiType: FilterUiType;
    order?: number;
    isInherited?: boolean;
}) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
        throw new Error("Unauthorized");
    }

    const filter = await prisma.categoryFilter.create({
        data: {
            categoryId: data.categoryId,
            attributeId: data.attributeId,
            builtinKey: data.builtinKey,
            uiType: data.uiType,
            order: data.order ?? 0,
            isInherited: data.isInherited ?? true,
        },
    });

    revalidatePath("/admin/kategoriler");
    return filter;
}

export async function deleteCategoryFilter(id: string) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
        throw new Error("Unauthorized");
    }

    await prisma.categoryFilter.delete({ where: { id } });
    revalidatePath("/admin/kategoriler");
}
