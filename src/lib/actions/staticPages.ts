"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getStaticPages() {
  return prisma.staticPage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getStaticPageBySlug(slug: string) {
  return prisma.staticPage.findUnique({ where: { slug } });
}

export async function createStaticPage(data: {
  title: string; slug: string; content?: string;
  seoTitle?: string; seoDesc?: string; isActive?: boolean;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const page = await prisma.staticPage.create({ data });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "CREATE", entity: "StaticPage", entityId: page.id, details: `Sayfa oluşturuldu: ${page.title}` } });
  revalidatePath("/admin/sayfalar");
  return page;
}

export async function updateStaticPage(id: string, data: {
  title?: string; slug?: string; content?: string;
  seoTitle?: string; seoDesc?: string; isActive?: boolean;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const page = await prisma.staticPage.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "UPDATE", entity: "StaticPage", entityId: page.id, details: `Sayfa güncellendi: ${page.title}` } });
  revalidatePath("/admin/sayfalar");
  revalidatePath(`/sayfa/${page.slug}`);
  return page;
}

export async function deleteStaticPage(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const page = await prisma.staticPage.findUnique({ where: { id }, select: { title: true } });
  await prisma.staticPage.delete({ where: { id } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "DELETE", entity: "StaticPage", entityId: id, details: `Sayfa silindi: ${page?.title}` } });
  revalidatePath("/admin/sayfalar");
}
