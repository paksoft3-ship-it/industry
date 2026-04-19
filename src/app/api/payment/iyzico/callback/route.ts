import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { retrieveCheckoutForm } from "@/lib/iyzico";
import { OrderStatus, PaymentStatus } from "@prisma/client";

// iyzico POSTs form data to this endpoint after payment
export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const token = body.get("token")?.toString();

    if (!token) {
      return NextResponse.redirect(new URL("/odeme/basarisiz?reason=no_token", req.url));
    }

    // Find order by token
    const order = await prisma.order.findUnique({
      where: { iyzicoToken: token },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.redirect(new URL("/odeme/basarisiz?reason=order_not_found", req.url));
    }

    // Retrieve payment result from iyzico
    const result = await retrieveCheckoutForm(order.id, token);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sivtechmakina.com";

    if (result.status === "success" && result.paymentStatus === "SUCCESS") {
      // Payment successful — confirm order, decrement stock, clear cart
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
        },
      });

      // Decrement stock
      await Promise.all(
        order.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stockCount: { decrement: item.quantity } },
          })
        )
      );

      // Clear cart if user is logged in
      if (order.userId) {
        await prisma.cartItem.deleteMany({ where: { userId: order.userId } });
      }

      return NextResponse.redirect(
        `${baseUrl}/siparis/tesekkurler?no=${order.orderNumber}&total=${Number(order.total)}&method=iyzico`
      );
    } else {
      // Payment failed — mark order cancelled
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.FAILED,
        },
      });

      const errorCode = result.errorCode || "unknown";
      return NextResponse.redirect(
        `${baseUrl}/odeme/basarisiz?reason=${errorCode}&no=${order.orderNumber}`
      );
    }
  } catch (err) {
    console.error("[iyzico/callback]", err);
    return NextResponse.redirect(new URL("/odeme/basarisiz?reason=server_error", req.url));
  }
}

// iyzico also does a GET callback in some flows
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL("/", req.url));
}
