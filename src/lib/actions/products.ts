"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getProducts({
  categorySlug,
  brandSlug,
  search,
  page = 1,
  limit = 20,
  sortBy = "createdAt",
  sortOrder = "desc",
  inStockOnly = false,
}: {
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  inStockOnly?: boolean;
} = {}) {
  const where: Record<string, unknown> = { isActive: true };

  if (categorySlug) {
    where.categories = {
      some: { category: { slug: categorySlug } },
    };
  }

  if (brandSlug) {
    where.brand = { slug: brandSlug };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (inStockOnly) {
    where.inStock = true;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: where as never,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        brand: { select: { name: true, slug: true } },
        categories: { include: { category: { select: { name: true, slug: true } } } },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where: where as never }),
  ]);

  return { products, total, totalPages: Math.ceil(total / limit), page };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      brand: true,
      categories: { include: { category: true } },
      attributes: true,
      downloads: true,
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
      },
      questions: {
        where: { isPublic: true },
        include: {
          user: { select: { firstName: true, lastName: true } },
          answers: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (product) {
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return product;
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      brand: { select: { name: true } },
      categories: { include: { category: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function createProduct(data: {
  name: string;
  slug: string;
  sku: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  brandId?: string;
  inStock?: boolean;
  stockCount?: number;
  categoryIds?: string[];
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const { categoryIds, ...productData } = data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      categories: categoryIds
        ? { create: categoryIds.map((id) => ({ categoryId: id })) }
        : undefined,
    },
  });

  revalidatePath("/admin/urunler");
  return product;
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const product = await prisma.product.update({
    where: { id },
    data: data as never,
  });

  revalidatePath("/admin/urunler");
  revalidatePath(`/urun/${product.slug}`);
  return product;
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/urunler");
}
