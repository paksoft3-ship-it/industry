"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function createAuditLog(data: {
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
}) {
  const session = await auth();
  return prisma.auditLog.create({
    data: {
      userId: session?.user?.id,
      ...data,
    },
  });
}

export async function getAuditLogs({
  page = 1,
  limit = 50,
  entity,
  action,
  userId,
}: {
  page?: number;
  limit?: number;
  entity?: string;
  action?: string;
  userId?: string;
} = {}) {
  const where: Record<string, unknown> = {};
  if (entity) where.entity = entity;
  if (action) where.action = action;
  if (userId) where.userId = userId;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: where as never,
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where: where as never }),
  ]);

  return { logs, total, totalPages: Math.ceil(total / limit), page };
}
