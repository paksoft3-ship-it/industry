import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ items: [], count: 0 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return NextResponse.json({ items, count });
}
