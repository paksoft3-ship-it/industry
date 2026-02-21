"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCustomers({
  search,
  page = 1,
  limit = 20,
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
} = {}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const where: Record<string, unknown> = { role: "CUSTOMER" };

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderByMap: Record<string, Record<string, string>> = {
    createdAt: { createdAt: sortOrder },
    name: { firstName: sortOrder },
  };

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where: where as never,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          select: { total: true },
          where: { status: { not: "CANCELLED" } },
        },
      },
      orderBy: orderByMap[sortBy] || { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }) as never,
    prisma.user.count({ where: where as never }),
  ]);

  // Compute totalSpent per customer
  const customersWithSpent = (customers as {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    createdAt: Date;
    _count: { orders: number };
    orders: { total: { toNumber?: () => number } }[];
  }[]).map((c) => ({
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    createdAt: c.createdAt,
    orderCount: c._count.orders,
    totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
  }));

  return { customers: customersWithSpent, total, totalPages: Math.ceil(total / limit), page };
}

export async function getCustomerDetail(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const customer = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      addresses: true,
      orders: {
        include: {
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { orders: true, reviews: true, wishlist: true } },
    },
  });

  if (!customer) return null;

  const totalSpent = customer.orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const lastOrder = customer.orders[0] || null;

  return {
    ...customer,
    totalSpent,
    avgOrderValue: customer._count.orders > 0 ? totalSpent / customer._count.orders : 0,
    lastOrderDate: lastOrder?.createdAt || null,
  };
}

export async function updateCustomer(id: string, data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const customer = await prisma.user.update({ where: { id }, data });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "Customer",
      entityId: customer.id,
      details: `Müşteri güncellendi: ${customer.firstName} ${customer.lastName}`,
    },
  });

  revalidatePath(`/admin/musteriler/${id}`);
  revalidatePath("/admin/musteriler");
  return customer;
}
