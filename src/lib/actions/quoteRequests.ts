"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitQuoteRequest(data: {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  products: string;
  quantity?: string;
  notes?: string;
}) {
  if (!data.name?.trim()) throw new Error("Ad Soyad zorunludur.");
  if (!data.email?.trim()) throw new Error("E-posta zorunludur.");
  if (!data.products?.trim()) throw new Error("Talep edilen ürün/hizmet zorunludur.");

  await prisma.quoteRequest.create({
    data: {
      name: data.name.trim(),
      company: data.company?.trim() || null,
      email: data.email.trim(),
      phone: data.phone?.trim() || null,
      products: data.products.trim(),
      quantity: data.quantity?.trim() || null,
      notes: data.notes?.trim() || null,
    },
  });

  revalidatePath("/admin/teklif-talepleri");
}

export async function getQuoteRequests() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");

  return prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });
}

export async function markQuoteRequestRead(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");

  await prisma.quoteRequest.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/admin/teklif-talepleri");
}

export async function updateQuoteRequestStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");

  await prisma.quoteRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/teklif-talepleri");
}

export async function deleteQuoteRequest(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");

  await prisma.quoteRequest.delete({ where: { id } });
  revalidatePath("/admin/teklif-talepleri");
}

export async function getUnreadQuoteRequestCount() {
  return prisma.quoteRequest.count({ where: { isRead: false } });
}
