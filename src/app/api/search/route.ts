import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query || query.length < 2) {
    return NextResponse.json({ products: [], categories: [], brands: [] });
  }

  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        categories: { include: { category: { select: { name: true } } }, take: 1 },
      },
      take: 8,
    }),
    prisma.category.findMany({
      where: {
        isActive: true,
        name: { contains: query, mode: "insensitive" },
      },
      take: 5,
    }),
    prisma.brand.findMany({
      where: {
        isActive: true,
        name: { contains: query, mode: "insensitive" },
      },
      take: 5,
    }),
  ]);

  return NextResponse.json({ products, categories, brands });
}
