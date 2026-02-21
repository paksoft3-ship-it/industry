"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function generateOrderNumber() {
  const prefix = "CNC";
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}${date}${random}`;
}

export async function createOrder(data: {
  addressId: string;
  items: { productId: string; quantity: number }[];
  couponCode?: string;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  // Fetch product prices
  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  let subtotal = 0;
  const orderItems = data.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);
    const total = Number(product.price) * item.quantity;
    subtotal += total;
    return {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: item.quantity,
      total,
    };
  });

  // Apply coupon if provided
  let discount = 0;
  if (data.couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: data.couponCode,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
      },
    });
    if (coupon) {
      if (coupon.discountType === "percentage") {
        discount = subtotal * (Number(coupon.discountValue) / 100);
      } else {
        discount = Number(coupon.discountValue);
      }
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }
  }

  const shippingCost = subtotal >= 2000 ? 0 : 49.90;
  const total = subtotal - discount + shippingCost;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session.user.id,
      addressId: data.addressId,
      subtotal,
      shippingCost,
      discount,
      total,
      couponCode: data.couponCode,
      notes: data.notes,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  // Decrease stock
  for (const item of data.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stockCount: { decrement: item.quantity } },
    });
  }

  revalidatePath("/hesap/siparisler");
  return order;
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: { include: { product: { include: { images: { take: 1 } } } } },
      address: true,
      user: { select: { firstName: true, lastName: true, email: true } },
    },
  });
}

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as never },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "Order",
      entityId: order.id,
      details: `Sipariş durumu güncellendi: ${status}`,
    },
  });

  revalidatePath("/admin/siparisler");
  revalidatePath(`/admin/siparisler/${orderId}`);
  return order;
}

export async function getAdminOrders({
  search,
  status,
  page = 1,
  limit = 20,
}: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
} = {}) {
  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { user: { firstName: { contains: search, mode: "insensitive" } } },
      { user: { lastName: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [orders, total, statusCounts] = await Promise.all([
    prisma.order.findMany({
      where: where as never,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where: where as never }),
    prisma.$queryRaw<{ status: string; count: bigint }[]>`
      SELECT status, COUNT(*)::bigint as count FROM "Order" GROUP BY status
    `,
  ]);

  const counts: Record<string, number> = {};
  for (const row of statusCounts) {
    counts[row.status] = Number(row.count);
  }

  return { orders, total, totalPages: Math.ceil(total / limit), page, statusCounts: counts };
}

export async function getOrderDetail(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } },
        },
      },
      address: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          _count: { select: { orders: true } },
        },
      },
    },
  });
}

export async function updateOrderTracking(orderId: string, data: {
  trackingNumber?: string;
  trackingUrl?: string;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data,
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entity: "Order",
      entityId: order.id,
      details: `Kargo takip bilgisi güncellendi`,
    },
  });

  revalidatePath(`/admin/siparisler/${orderId}`);
  return order;
}

export async function addOrderNote(orderId: string, note: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { notes: true } });
  const existingNotes = order?.notes || "";
  const timestamp = new Date().toLocaleString("tr-TR");
  const newNotes = existingNotes
    ? `${existingNotes}\n\n[${timestamp}] ${note}`
    : `[${timestamp}] ${note}`;

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { notes: newNotes },
  });

  revalidatePath(`/admin/siparisler/${orderId}`);
  return updated;
}
