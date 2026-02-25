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
    orderBy: [{ order: "asc" }, { name: "asc" }],
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

  // Slug check
  const existing = await prisma.brand.findUnique({ where: { slug: data.slug } });
  if (existing) {
    throw new Error(`"${data.slug}" slugına sahip bir marka zaten var.`);
  }

  const brand = await prisma.brand.create({ data });

  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Brand",
        entityId: brand.id,
        details: `Marka oluşturuldu: ${brand.name}`,
      },
    });
  } catch (logError) {
    console.error("Audit log error:", logError);
  }

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
  order?: number;
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

  // Slug check
  if (data.slug) {
    const existing = await prisma.brand.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (existing) {
      throw new Error(`"${data.slug}" slugına sahip başka bir marka zaten var.`);
    }
  }

  const brand = await prisma.brand.update({ where: { id }, data });

  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Brand",
        entityId: brand.id,
        details: `Marka güncellendi: ${brand.name}`,
      },
    });
  } catch (logError) {
    console.error("Audit log error:", logError);
  }

  revalidatePath("/admin/markalar");
  return brand;
}

export async function deleteBrand(id: string) {
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

  const brand = await prisma.brand.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!brand) throw new Error("Brand not found");
  if (brand._count.products > 0) {
    throw new Error(`Bu markaya ait ${brand._count.products} ürün bulunuyor. Önce ürünleri silin veya başka markaya taşıyın.`);
  }

  await prisma.brand.delete({ where: { id } });

  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Brand",
        entityId: id,
        details: `Marka silindi: ${brand.name}`,
      },
    });
  } catch (logError) {
    console.error("Audit log error:", logError);
  }

  revalidatePath("/admin/markalar");
}
