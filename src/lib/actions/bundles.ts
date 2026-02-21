"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getBundles() {
  return prisma.bundle.findMany({
    include: {
      items: { include: { product: { select: { name: true, price: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createBundle(data: {
  name: string; slug: string; description?: string; image?: string;
  discount?: number; isActive?: boolean;
  items?: { productId: string; quantity: number }[];
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const { items, ...bundleData } = data;
  const bundle = await prisma.bundle.create({
    data: {
      ...bundleData,
      items: items?.length ? { create: items } : undefined,
    },
  });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "CREATE", entity: "Bundle", entityId: bundle.id, details: `Kombin oluşturuldu: ${bundle.name}` } });
  revalidatePath("/admin/kombinler");
  return bundle;
}

export async function updateBundle(id: string, data: {
  name?: string; slug?: string; description?: string; image?: string;
  discount?: number; isActive?: boolean;
  items?: { productId: string; quantity: number }[];
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const { items, ...bundleData } = data;
  if (items !== undefined) {
    await prisma.bundleItem.deleteMany({ where: { bundleId: id } });
    if (items.length > 0) {
      await prisma.bundleItem.createMany({ data: items.map((i) => ({ bundleId: id, ...i })) });
    }
  }
  const bundle = await prisma.bundle.update({ where: { id }, data: bundleData as never });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "UPDATE", entity: "Bundle", entityId: bundle.id, details: `Kombin güncellendi: ${bundle.name}` } });
  revalidatePath("/admin/kombinler");
  return bundle;
}

export async function deleteBundle(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const bundle = await prisma.bundle.findUnique({ where: { id }, select: { name: true } });
  await prisma.bundle.delete({ where: { id } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "DELETE", entity: "Bundle", entityId: id, details: `Kombin silindi: ${bundle?.name}` } });
  revalidatePath("/admin/kombinler");
}
