import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

const GUEST_CART_COOKIE = "guest_cart";

interface GuestCartItem {
  productId: string;
  quantity: number;
}

export async function GET() {
  const session = await auth();

  if (session?.user) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: { images: { take: 1, orderBy: { order: "asc" } } },
        },
      },
    });

    const items = cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      quantity: item.quantity,
      image: item.product.images[0]?.url ?? "/images/placeholder.png",
    }));

    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return NextResponse.json({ items, count });
  }

  // Guest cart — read from httpOnly cookie server-side
  const cookieStore = await cookies();
  const raw = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (!raw) return NextResponse.json({ items: [], count: 0 });

  let guestItems: GuestCartItem[] = [];
  try {
    guestItems = JSON.parse(raw);
  } catch {
    return NextResponse.json({ items: [], count: 0 });
  }

  if (guestItems.length === 0) return NextResponse.json({ items: [], count: 0 });

  const productIds = guestItems.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { images: { take: 1, orderBy: { order: "asc" } } },
  });

  const items = guestItems.flatMap((gItem) => {
    const product = products.find((p) => p.id === gItem.productId);
    if (!product) return [];
    return [
      {
        id: `guest-${gItem.productId}`,
        productId: gItem.productId,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        quantity: gItem.quantity,
        image: product.images[0]?.url ?? "/images/placeholder.png",
      },
    ];
  });

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return NextResponse.json({ items, count });
}
