
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { AttributeType } from "@prisma/client";

export async function getAttributes() {
    return prisma.attributeDefinition.findMany({
        include: {
            options: {
                orderBy: { order: "asc" },
            },
            _count: { select: { productValues: true } },
        },
        orderBy: { label: "asc" },
    });
}

export async function createAttribute(data: {
    key: string;
    label: string;
    type: AttributeType;
    unit?: string;
    options?: string[];
}) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
        throw new Error("Unauthorized");
    }

    const attr = await prisma.attributeDefinition.create({
        data: {
            key: data.key,
            label: data.label,
            type: data.type,
            unit: data.unit,
            options: data.options ? {
                create: data.options.map((val, idx) => ({
                    value: val,
                    order: idx,
                })),
            } : undefined,
        },
    });

    revalidatePath("/admin/urunler/ozellikler");
    return attr;
}

export async function updateAttribute(id: string, data: {
    label?: string;
    unit?: string;
    options?: { id?: string; value: string; order: number }[];
}) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
        throw new Error("Unauthorized");
    }

    const attr = await prisma.attributeDefinition.update({
        where: { id },
        data: {
            label: data.label,
            unit: data.unit,
        },
    });

    if (data.options) {
        // Basic sync: delete missing, update existing, create new
        // For simplicity in MVP, we can just replace if label/type didn't change
        // but better to be surgical
        const existingOptions = await prisma.attributeOption.findMany({ where: { attributeId: id } });
        const incomingIds = data.options.map(o => o.id).filter(Boolean);

        // Delete
        await prisma.attributeOption.deleteMany({
            where: {
                attributeId: id,
                id: { notIn: incomingIds as string[] },
            },
        });

        // Update/Create
        for (const opt of data.options) {
            if (opt.id) {
                await prisma.attributeOption.update({
                    where: { id: opt.id },
                    data: { value: opt.value, order: opt.order },
                });
            } else {
                await prisma.attributeOption.create({
                    data: { attributeId: id, value: opt.value, order: opt.order },
                });
            }
        }
    }

    revalidatePath("/admin/urunler/ozellikler");
    return attr;
}

export async function deleteAttribute(id: string) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
        throw new Error("Unauthorized");
    }

    await prisma.attributeDefinition.delete({ where: { id } });
    revalidatePath("/admin/urunler/ozellikler");
}
