"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Guest cart stored in a cookie as JSON array of { productId, quantity }
interface GuestCartItem {
  productId: string;
  quantity: number;
}

const GUEST_CART_COOKIE = "guest_cart";

async function getGuestCart(): Promise<GuestCartItem[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as GuestCartItem[];
  } catch {
    return [];
  }
}

async function setGuestCart(items: GuestCartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getCart() {
  const session = await auth();

  if (session?.user) {
    return prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Guest cart: resolve product details
  const guestItems = await getGuestCart();
  if (guestItems.length === 0) return [];

  const productIds = guestItems.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
  });

  return guestItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        id: `guest-${item.productId}`,
        userId: null,
        productId: item.productId,
        quantity: item.quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
        product,
      };
    })
    .filter(Boolean);
}

export async function addToCart(productId: string, quantity = 1) {
  const session = await auth();

  if (session?.user) {
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: session.user.id, productId } },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { userId: session.user.id, productId, quantity },
      });
    }
  } else {
    // Guest cart
    const items = await getGuestCart();
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }
    await setGuestCart(items);
  }

  revalidatePath("/sepet");
}

export async function updateCartQuantity(productId: string, quantity: number) {
  const session = await auth();

  if (session?.user) {
    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { userId_productId: { userId: session.user.id, productId } },
      });
    } else {
      await prisma.cartItem.update({
        where: { userId_productId: { userId: session.user.id, productId } },
        data: { quantity },
      });
    }
  } else {
    const items = await getGuestCart();
    if (quantity <= 0) {
      await setGuestCart(items.filter((i) => i.productId !== productId));
    } else {
      const existing = items.find((i) => i.productId === productId);
      if (existing) existing.quantity = quantity;
      await setGuestCart(items);
    }
  }

  revalidatePath("/sepet");
}

export async function removeFromCart(productId: string) {
  const session = await auth();

  if (session?.user) {
    await prisma.cartItem.delete({
      where: { userId_productId: { userId: session.user.id, productId } },
    });
  } else {
    const items = await getGuestCart();
    await setGuestCart(items.filter((i) => i.productId !== productId));
  }

  revalidatePath("/sepet");
}

export async function clearCart() {
  const session = await auth();

  if (session?.user) {
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
  } else {
    await setGuestCart([]);
  }

  revalidatePath("/sepet");
}

/** Merge guest cart into user cart after login */
export async function mergeGuestCart() {
  const session = await auth();
  if (!session?.user) return;

  const guestItems = await getGuestCart();
  if (guestItems.length === 0) return;

  for (const item of guestItems) {
    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: session.user.id, productId: item.productId } },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { userId: session.user.id, productId: item.productId, quantity: item.quantity },
      });
    }
  }

  // Clear guest cart after merge
  await setGuestCart([]);
  revalidatePath("/sepet");
}
