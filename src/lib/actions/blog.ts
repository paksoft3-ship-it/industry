"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Blog Categories
export async function getBlogCategories() {
  return prisma.blogCategory.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createBlogCategory(data: { name: string; slug: string; sortOrder?: number }) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const cat = await prisma.blogCategory.create({ data });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "CREATE", entity: "BlogCategory", entityId: cat.id, details: `Blog kategorisi: ${cat.name}` } });
  revalidatePath("/admin/egitim");
  return cat;
}

export async function updateBlogCategory(id: string, data: { name?: string; slug?: string; sortOrder?: number }) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const cat = await prisma.blogCategory.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "UPDATE", entity: "BlogCategory", entityId: cat.id, details: `Blog kategorisi güncellendi: ${cat.name}` } });
  revalidatePath("/admin/egitim");
  return cat;
}

export async function deleteBlogCategory(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const cat = await prisma.blogCategory.findUnique({ where: { id }, include: { _count: { select: { posts: true } } } });
  if (!cat) throw new Error("Kategori bulunamadı");
  if (cat._count.posts > 0) throw new Error(`Bu kategoride ${cat._count.posts} yazı var. Önce yazıları silin.`);
  await prisma.blogCategory.delete({ where: { id } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "DELETE", entity: "BlogCategory", entityId: id, details: `Blog kategorisi silindi: ${cat.name}` } });
  revalidatePath("/admin/egitim");
}

// Blog Posts
export async function getBlogPosts({ page = 1, limit = 20 } = {}) {
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count(),
  ]);
  return { posts, total, totalPages: Math.ceil(total / limit), page };
}

export async function createBlogPost(data: {
  title: string; slug: string; excerpt?: string; content?: string;
  image?: string; categoryId: string; authorName?: string;
  isPublished?: boolean; seoTitle?: string; seoDesc?: string;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const post = await prisma.blogPost.create({
    data: { ...data, publishedAt: data.isPublished ? new Date() : undefined },
  });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "CREATE", entity: "BlogPost", entityId: post.id, details: `Blog yazısı: ${post.title}` } });
  revalidatePath("/admin/egitim");
  return post;
}

export async function updateBlogPost(id: string, data: {
  title?: string; slug?: string; excerpt?: string; content?: string;
  image?: string; categoryId?: string; authorName?: string;
  isPublished?: boolean; seoTitle?: string; seoDesc?: string;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const updateData: Record<string, unknown> = { ...data };
  if (data.isPublished !== undefined) {
    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } });
    if (data.isPublished && !existing?.publishedAt) updateData.publishedAt = new Date();
  }
  const post = await prisma.blogPost.update({ where: { id }, data: updateData as never });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "UPDATE", entity: "BlogPost", entityId: post.id, details: `Blog yazısı güncellendi: ${post.title}` } });
  revalidatePath("/admin/egitim");
  return post;
}

export async function deleteBlogPost(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { title: true } });
  await prisma.blogPost.delete({ where: { id } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "DELETE", entity: "BlogPost", entityId: id, details: `Blog yazısı silindi: ${post?.title}` } });
  revalidatePath("/admin/egitim");
}
