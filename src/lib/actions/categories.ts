"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCategoryTree(includeInactive = false) {
  const activeFilter = includeInactive ? {} : { isActive: true };
  const categories = await prisma.category.findMany({
    where: { parentId: null, ...activeFilter },
    include: {
      children: {
        where: activeFilter,
        include: {
          children: {
            where: activeFilter,
            include: { _count: { select: { products: true } } },
            orderBy: { sortOrder: "asc" },
          },
          _count: { select: { products: true } },
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
  image?: string;
  description?: string;
  parentId?: string;
  seoSlug?: string;
  seoTitle?: string;
  seoDesc?: string;
  sortOrder?: number;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const category = await prisma.category.create({ data });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE",
      entity: "Category",
      entityId: category.id,
      details: `Kategori oluşturuldu: ${category.name}`,
    },
  });

  revalidatePath("/admin/kategoriler");
  return category;
}

export async function updateCategory(id: string, data: {
  name?: string;
  slug?: string;
  icon?: string;
  image?: string;
  description?: string;
  parentId?: string | null;
  seoSlug?: string | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const category = await prisma.category.update({ where: { id }, data: data as never });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "Category",
      entityId: category.id,
      details: `Kategori güncellendi: ${category.name}`,
    },
  });

  revalidatePath("/admin/kategoriler");
  return category;
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true, children: true } },
    },
  });

  if (!category) throw new Error("Kategori bulunamadı");
  if (category._count.products > 0) {
    throw new Error(`Bu kategoride ${category._count.products} ürün bulunuyor. Önce ürünleri taşıyın.`);
  }
  if (category._count.children > 0) {
    throw new Error(`Bu kategorinin ${category._count.children} alt kategorisi var. Önce onları silin.`);
  }

  await prisma.category.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE",
      entity: "Category",
      entityId: id,
      details: `Kategori silindi: ${category.name}`,
    },
  });

  revalidatePath("/admin/kategoriler");
}
