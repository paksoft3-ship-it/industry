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
            orderBy: { order: "asc" },
          },
          _count: { select: { products: true } },
        },
        orderBy: { order: "asc" },
      },
      _count: { select: { products: true } },
    },
    orderBy: { order: "asc" },
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
        orderBy: { order: "asc" },
        include: { _count: { select: { products: true } } },
      },
      categoryFilters: {
        where: { isVisible: true },
        include: {
          attribute: {
            include: {
              options: { orderBy: { order: "asc" } }
            }
          }
        },
        orderBy: { order: "asc" }
      },
      _count: { select: { products: true } },
    },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
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
  const existingSlug = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existingSlug) {
    throw new Error(`"${data.slug}" slugına sahip bir kategori zaten var.`);
  }

  // SEO Slug check
  if (data.seoSlug) {
    const existingSeoSlug = await prisma.category.findUnique({ where: { seoSlug: data.seoSlug } });
    if (existingSeoSlug) {
      throw new Error(`"${data.seoSlug}" SEO slugına sahip bir kategori zaten var.`);
    }
  }

  const category = await prisma.category.create({ data });

  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Category",
        entityId: category.id,
        details: `Kategori oluşturuldu: ${category.name}`,
      },
    });
  } catch (logError) {
    console.error("Audit log error:", logError);
  }

  revalidatePath("/admin/kategoriler");
  revalidatePath("/", "layout");
  return category;
}

export async function updateCategory(id: string, data: {
  name?: string;
  slug?: string;
  icon?: string;
  image?: string | null;
  description?: string;
  parentId?: string | null;
  seoSlug?: string | null;
  seoTitle?: string | null;
  seoDesc?: string | null;
  order?: number;
  isActive?: boolean;
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
    const existing = await prisma.category.findFirst({
      where: { slug: data.slug, id: { not: id } },
    });
    if (existing) {
      throw new Error(`"${data.slug}" slugına sahip başka bir kategori zaten var.`);
    }
  }

  // SEO Slug check
  if (data.seoSlug) {
    const existingSeo = await prisma.category.findFirst({
      where: { seoSlug: data.seoSlug, id: { not: id } },
    });
    if (existingSeo) {
      throw new Error(`"${data.seoSlug}" SEO slugına sahip başka bir kategori zaten var.`);
    }
  }

  const category = await prisma.category.update({ where: { id }, data: data as never });

  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entity: "Category",
        entityId: category.id,
        details: `Kategori güncellendi: ${category.name}`,
      },
    });
  } catch (logError) {
    console.error("Audit log error:", logError);
  }

  revalidatePath("/admin/kategoriler");
  revalidatePath("/", "layout");
  return category;
}

export async function deleteCategory(id: string) {
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

  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entity: "Category",
        entityId: id,
        details: `Kategori silindi: ${category.name}`,
      },
    });
  } catch (logError) {
    console.error("Audit log error:", logError);
  }

  revalidatePath("/admin/kategoriler");
  revalidatePath("/", "layout");
}
