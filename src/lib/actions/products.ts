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

export async function getAdminProducts({
  search,
  categoryId,
  brandId,
  status,
  page = 1,
  limit = 20,
}: {
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  page?: number;
  limit?: number;
} = {}) {
  const where: Record<string, unknown> = {};

  if (status === "active") where.isActive = true;
  else if (status === "inactive") where.isActive = false;
  else if (status === "outofstock") {
    where.isActive = true;
    where.inStock = false;
  }

  if (categoryId) {
    where.categories = { some: { categoryId } };
  }
  if (brandId) {
    where.brandId = brandId;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: where as never,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        brand: { select: { id: true, name: true } },
        categories: { include: { category: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where: where as never }),
  ]);

  return { products, total, totalPages: Math.ceil(total / limit), page };
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      brand: true,
      categories: { include: { category: true } },
      attributes: true,
      downloads: true,
    },
  });
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
  shortDesc?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  brandId?: string;
  inStock?: boolean;
  stockCount?: number;
  lowStockThreshold?: number;
  weight?: number;
  badge?: string;
  badgeColor?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  seoTitle?: string;
  seoDesc?: string;
  categoryIds?: string[];
  attributes?: { key: string; value: string }[];
  imageUrls?: string[];
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const { categoryIds, attributes, imageUrls, ...productData } = data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      categories: categoryIds?.length
        ? { create: categoryIds.map((id) => ({ categoryId: id })) }
        : undefined,
      attributes: attributes?.length
        ? { create: attributes }
        : undefined,
      images: imageUrls?.length
        ? { create: imageUrls.map((url, i) => ({ url, sortOrder: i })) }
        : undefined,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE",
      entity: "Product",
      entityId: product.id,
      details: `Ürün oluşturuldu: ${product.name}`,
    },
  });

  revalidatePath("/admin/urunler");
  return product;
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    slug?: string;
    sku?: string;
    description?: string;
    shortDesc?: string;
    price?: number;
    compareAtPrice?: number | null;
    costPrice?: number | null;
    brandId?: string | null;
    inStock?: boolean;
    stockCount?: number;
    lowStockThreshold?: number;
    weight?: number | null;
    badge?: string | null;
    badgeColor?: string | null;
    isActive?: boolean;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    seoTitle?: string | null;
    seoDesc?: string | null;
    categoryIds?: string[];
    attributes?: { key: string; value: string }[];
    imageUrls?: string[];
  }
) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const { categoryIds, attributes, imageUrls, ...productData } = data;

  // Update categories if provided
  if (categoryIds !== undefined) {
    await prisma.productCategory.deleteMany({ where: { productId: id } });
    if (categoryIds.length > 0) {
      await prisma.productCategory.createMany({
        data: categoryIds.map((categoryId) => ({ productId: id, categoryId })),
      });
    }
  }

  // Update attributes if provided
  if (attributes !== undefined) {
    await prisma.productAttribute.deleteMany({ where: { productId: id } });
    if (attributes.length > 0) {
      await prisma.productAttribute.createMany({
        data: attributes.map((a) => ({ productId: id, ...a })),
      });
    }
  }

  // Update images if provided
  if (imageUrls !== undefined) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    if (imageUrls.length > 0) {
      await prisma.productImage.createMany({
        data: imageUrls.map((url, i) => ({ productId: id, url, sortOrder: i })),
      });
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: productData as never,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "Product",
      entityId: product.id,
      details: `Ürün güncellendi: ${product.name}`,
    },
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

  const product = await prisma.product.findUnique({ where: { id }, select: { name: true } });
  await prisma.product.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE",
      entity: "Product",
      entityId: id,
      details: `Ürün silindi: ${product?.name}`,
    },
  });

  revalidatePath("/admin/urunler");
}
