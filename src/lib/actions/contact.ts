"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  if (!data.name?.trim()) throw new Error("Ad zorunludur.");
  if (!data.email?.trim()) throw new Error("E-posta zorunludur.");
  if (!data.subject?.trim()) throw new Error("Konu zorunludur.");
  if (!data.message?.trim()) throw new Error("Mesaj zorunludur.");

  await prisma.contactMessage.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || null,
      subject: data.subject.trim(),
      message: data.message.trim(),
    },
  });

  revalidatePath("/admin/mesajlar");
}

export async function getContactMessages() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");

  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function markMessageRead(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");

  await prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/admin/mesajlar");
}

export async function deleteContactMessage(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");

  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/mesajlar");
}

export async function getUnreadMessageCount() {
  return prisma.contactMessage.count({ where: { isRead: false } });
}
