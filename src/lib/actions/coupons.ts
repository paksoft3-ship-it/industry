"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCoupon(data: {
  code: string; description?: string; discountType?: string;
  discountValue: number; minOrderAmount?: number;
  maxUses?: number; isActive?: boolean;
  startsAt?: string; expiresAt?: string;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const coupon = await prisma.coupon.create({
    data: {
      ...data,
      startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    },
  });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "CREATE", entity: "Coupon", entityId: coupon.id, details: `Kupon oluşturuldu: ${coupon.code}` } });
  revalidatePath("/admin/kampanyalar");
  return coupon;
}

export async function updateCoupon(id: string, data: {
  code?: string; description?: string; discountType?: string;
  discountValue?: number; minOrderAmount?: number;
  maxUses?: number; isActive?: boolean;
  startsAt?: string | null; expiresAt?: string | null;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const updateData: Record<string, unknown> = { ...data };
  if (data.startsAt !== undefined) updateData.startsAt = data.startsAt ? new Date(data.startsAt) : null;
  if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
  const coupon = await prisma.coupon.update({ where: { id }, data: updateData as never });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "UPDATE", entity: "Coupon", entityId: coupon.id, details: `Kupon güncellendi: ${coupon.code}` } });
  revalidatePath("/admin/kampanyalar");
  return coupon;
}

export async function deleteCoupon(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");
  const coupon = await prisma.coupon.findUnique({ where: { id }, select: { code: true } });
  await prisma.coupon.delete({ where: { id } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "DELETE", entity: "Coupon", entityId: id, details: `Kupon silindi: ${coupon?.code}` } });
  revalidatePath("/admin/kampanyalar");
}
