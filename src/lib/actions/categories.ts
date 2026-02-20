"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCategoryTree() {
  const categories = await prisma.category.findMany({
    where: { parentId: null, isActive: true },
    include: {
      children: {
        where: { isActive: true },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return categories;
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      parent: { select: { name: true, slug: true } },
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      },
      _count: { select: { products: true } },
    },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { name: true, slug: true } },
      _count: { select: { products: true } },
    },
  });
}

export async function createCategory(data: {
  name: string;
  slug: string;
  icon?: string;
  parentId?: string;
  seoSlug?: string;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const category = await prisma.category.create({ data });
  revalidatePath("/admin/kategoriler");
  return category;
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const category = await prisma.category.update({ where: { id }, data: data as never });
  revalidatePath("/admin/kategoriler");
  return category;
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategoriler");
}
