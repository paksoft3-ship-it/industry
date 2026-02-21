"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getBrands({
  search,
  includeInactive = false,
}: { search?: string; includeInactive?: boolean } = {}) {
  const where: Record<string, unknown> = {};
  if (!includeInactive) where.isActive = true;
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  return prisma.brand.findMany({
    where: where as never,
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getBrandBySlug(slug: string) {
  return prisma.brand.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  });
}

export async function createBrand(data: {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const brand = await prisma.brand.create({ data });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "CREATE",
      entity: "Brand",
      entityId: brand.id,
      details: `Marka oluşturuldu: ${brand.name}`,
    },
  });

  revalidatePath("/admin/markalar");
  return brand;
}

export async function updateBrand(id: string, data: {
  name?: string;
  slug?: string;
  logo?: string;
  description?: string;
  website?: string;
  isActive?: boolean;
  sortOrder?: number;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const brand = await prisma.brand.update({ where: { id }, data });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "Brand",
      entityId: brand.id,
      details: `Marka güncellendi: ${brand.name}`,
    },
  });

  revalidatePath("/admin/markalar");
  return brand;
}

export async function deleteBrand(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const brand = await prisma.brand.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!brand) throw new Error("Brand not found");
  if (brand._count.products > 0) {
    throw new Error(`Bu markaya ait ${brand._count.products} ürün bulunuyor. Önce ürünleri silin veya başka markaya taşıyın.`);
  }

  await prisma.brand.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "DELETE",
      entity: "Brand",
      entityId: id,
      details: `Marka silindi: ${brand.name}`,
    },
  });

  revalidatePath("/admin/markalar");
}
