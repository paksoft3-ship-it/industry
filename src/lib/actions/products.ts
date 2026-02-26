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
  attributes,
}: {
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  inStockOnly?: boolean;
  attributes?: Record<string, string[]>;
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

  if (attributes && Object.keys(attributes).length > 0) {
    const attributeFilters = Object.entries(attributes).map(([key, values]) => ({
      attributeValues: {
        some: {
          attribute: { key },
          valueString: { in: values }
        }
      }
    }));
    where.AND = [...(where.AND as any[] || []), ...attributeFilters];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: where as never,
      include: {
        images: { orderBy: { order: "asc" }, take: 2 },
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
        images: { orderBy: { order: "asc" }, take: 1 },
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
      images: { orderBy: { order: "asc" } },
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
      images: { orderBy: { order: "asc" } },
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
      images: { orderBy: { order: "asc" }, take: 1 },
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
  images?: { url: string; alt?: string }[];
  downloads?: { title: string; fileUrl: string; fileType: string; fileSize?: string }[];
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Oturumunuz sona ermiş olabilir. Lütfen tekrar giriş yapın.");
  }

  // Verify user still exists in DB (Stale session check)
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!dbUser) {
    throw new Error("Kullanıcı kaydı bulunamadı. Lütfen çıkış yapıp tekrar giriş yapın.");
  }

  const userRole = (session.user as { role: string }).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
    throw new Error("Bu işlem için yetkiniz yok.");
  }

  const { categoryIds, attributes, images, downloads, ...productData } = data;

  // Slug check
  const existingSlug = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existingSlug) {
    throw new Error(`"${data.slug}" slugına sahip bir ürün zaten var. Lütfen farklı bir slug veya isim girin.`);
  }

  // SKU check
  const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (existingSku) {
    throw new Error(`"${data.sku}" SKU koduna sahip bir ürün zaten var.`);
  }

  const product = await prisma.product.create({
    data: {
      ...productData,
      categories: categoryIds?.length
        ? { create: categoryIds.map((id) => ({ categoryId: id })) }
        : undefined,
      attributes: attributes?.length
        ? { create: attributes }
        : undefined,
      images: images?.length
        ? { create: images.map((img, i) => ({ url: img.url, alt: img.alt || data.name, order: i })) }
        : undefined,
      downloads: downloads?.length
        ? { create: downloads }
        : undefined,
    },
  });

  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Product",
        entityId: product.id,
        details: `Ürün oluşturuldu: ${product.name}`,
      },
    });
  } catch (logError) {
    console.error("Audit log error:", logError);
  }

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
    images?: { url: string; alt?: string }[];
    downloads?: { title: string; fileUrl: string; fileType: string; fileSize?: string }[];
  }
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Oturumunuz sona ermiş olabilir. Lütfen tekrar giriş yapın.");
  }

  // Verify user still exists in DB (Stale session check)
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!dbUser) {
    throw new Error("Kullanıcı kaydı bulunamadı. Lütfen çıkış yapıp tekrar giriş yapın.");
  }

  const userRole = (session.user as { role: string }).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
    throw new Error("Bu işlem için yetkiniz yok.");
  }

  // Slug conflict check if slug is being updated
  if (data.slug) {
    const existing = await prisma.product.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (existing) {
      throw new Error(`"${data.slug}" slugına sahip başka bir ürün zaten var.`);
    }
  }

  // SKU conflict check if SKU is being updated
  if (data.sku) {
    const existing = await prisma.product.findFirst({
      where: { sku: data.sku, id: { not: id } },
    });
    if (existing) {
      throw new Error(`"${data.sku}" SKU koduna sahip başka bir ürün zaten var.`);
    }
  }

  const { categoryIds, attributes, images, downloads, ...productData } = data;

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
  if (images !== undefined) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    if (images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((img: any, i: number) => ({
          productId: id,
          url: img.url,
          alt: img.alt || (productData.name ?? "Ürün görseli"),
          order: i
        })),
      });
    }
  }

  // Update downloads if provided
  if (downloads !== undefined) {
    await prisma.productDownload.deleteMany({ where: { productId: id } });
    if (downloads.length > 0) {
      await prisma.productDownload.createMany({
        data: downloads.map((d: any) => ({
          productId: id,
          ...d
        })),
      });
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: productData as never,
  });

  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Product",
        entityId: product.id,
        details: `Ürün güncellendi: ${product.name}`,
      },
    });
  } catch (logError) {
    console.error("Audit log error:", logError);
  }

  revalidatePath("/admin/urunler");
  revalidatePath(`/urun/${product.slug}`);
  return product;
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Oturumunuz sona ermiş olabilir. Lütfen tekrar giriş yapın.");
  }

  // Verify user still exists in DB (Stale session check)
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!dbUser) {
    throw new Error("Kullanıcı kaydı bulunamadı. Lütfen çıkış yapıp tekrar giriş yapın.");
  }

  const userRole = (session.user as { role: string }).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
    throw new Error("Bu işlem için yetkiniz yok.");
  }

  const product = await prisma.product.findUnique({ where: { id }, select: { name: true } });
  await prisma.product.delete({ where: { id } });

  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Product",
        entityId: id,
        details: `Ürün silindi: ${product?.name}`,
      },
    });
  } catch (logError) {
    console.error("Audit log error:", logError);
  }

  revalidatePath("/admin/urunler");
}
