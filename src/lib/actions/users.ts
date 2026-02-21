"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { hashSync } from "bcryptjs";

export async function getUsers({ page = 1, limit = 20, search }: { page?: number; limit?: number; search?: string } = {}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role))
    throw new Error("Unauthorized");

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: where as never,
      select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true, phone: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where: where as never }),
  ]);

  return { users, total, totalPages: Math.ceil(total / limit), page };
}

export async function createUser(data: {
  firstName: string; lastName: string; email: string;
  password: string; role?: string; phone?: string;
}) {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "SUPER_ADMIN")
    throw new Error("Unauthorized — only SUPER_ADMIN can create users");

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("Bu e-posta adresi zaten kayıtlı");

  const { password, ...rest } = data;
  const user = await prisma.user.create({
    data: { ...rest, role: (data.role || "CUSTOMER") as never, passwordHash: hashSync(password, 12) },
  });

  await prisma.auditLog.create({ data: { userId: session.user.id, action: "CREATE", entity: "User", entityId: user.id, details: `Kullanıcı oluşturuldu: ${user.email} (${user.role})` } });
  revalidatePath("/admin/kullanicilar");
  return user;
}

export async function updateUserRole(id: string, role: string) {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "SUPER_ADMIN")
    throw new Error("Unauthorized — only SUPER_ADMIN can change roles");

  const user = await prisma.user.update({ where: { id }, data: { role: role as never } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "UPDATE", entity: "User", entityId: user.id, details: `Kullanıcı rolü güncellendi: ${user.email} → ${role}` } });
  revalidatePath("/admin/kullanicilar");
  return user;
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== "SUPER_ADMIN")
    throw new Error("Unauthorized — only SUPER_ADMIN can delete users");

  if (id === session.user.id) throw new Error("Kendi hesabınızı silemezsiniz");

  const user = await prisma.user.findUnique({ where: { id }, select: { email: true, _count: { select: { orders: true } } } });
  if (!user) throw new Error("Kullanıcı bulunamadı");
  if (user._count.orders > 0) throw new Error(`Bu kullanıcının ${user._count.orders} siparişi var. Silinemez.`);

  await prisma.user.delete({ where: { id } });
  await prisma.auditLog.create({ data: { userId: session.user.id, action: "DELETE", entity: "User", entityId: id, details: `Kullanıcı silindi: ${user.email}` } });
  revalidatePath("/admin/kullanicilar");
}
