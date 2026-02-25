"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getFileLibraryItems() {
  return prisma.fileLibrary.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
}

export async function createFileLibraryItem(data: {
  title: string; category: string; fileUrl: string; fileType: string;
  fileSize?: string; icon?: string; order?: number;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const item = await prisma.fileLibrary.create({ data });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "CREATE", entity: "FileLibrary", entityId: item.id, details: `Dosya eklendi: ${item.title}` } });
  revalidatePath("/admin/dosya-merkezi");
  return item;
}

export async function updateFileLibraryItem(id: string, data: {
  title?: string; category?: string; fileUrl?: string; fileType?: string;
  fileSize?: string; icon?: string; order?: number; isActive?: boolean;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const item = await prisma.fileLibrary.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "UPDATE", entity: "FileLibrary", entityId: item.id, details: `Dosya güncellendi: ${item.title}` } });
  revalidatePath("/admin/dosya-merkezi");
  return item;
}

export async function deleteFileLibraryItem(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const item = await prisma.fileLibrary.findUnique({ where: { id }, select: { title: true } });
  await prisma.fileLibrary.delete({ where: { id } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "DELETE", entity: "FileLibrary", entityId: id, details: `Dosya silindi: ${item?.title}` } });
  revalidatePath("/admin/dosya-merkezi");
}
