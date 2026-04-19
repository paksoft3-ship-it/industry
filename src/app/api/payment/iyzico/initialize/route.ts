import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { initializeCheckoutForm } from "@/lib/iyzico";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId gerekli" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        address: true,
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sivtechmakina.com";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "85.34.78.112";

    const buyerName = order.user?.firstName || order.address?.firstName || "Müşteri";
    const buyerSurname = order.user?.lastName || order.address?.lastName || "Müşteri";
    const buyerEmail = order.user?.email || order.guestEmail || "musteri@example.com";
    const buyerPhone = order.user?.phone || order.address?.phone || "+905001234567";
    const buyerAddress = order.address
      ? `${order.address.address}, ${order.address.district}, ${order.address.city}`
      : "Türkiye";
    const buyerCity = order.address?.city || "Istanbul";

    const basketItems = order.items.map((item) => ({
      id: item.productId,
      name: item.name.slice(0, 100),
      category1: "Endüstriyel Ürün",
      itemType: "PHYSICAL",
      price: Number(item.total).toFixed(2),
    }));

    const totalStr = Number(order.total).toFixed(2);

    const result = await initializeCheckoutForm({
      conversationId: order.id,
      price: totalStr,
      paidPrice: totalStr,
      currency: "TRY",
      basketId: order.orderNumber,
      paymentGroup: "PRODUCT",
      callbackUrl: `${baseUrl}/api/payment/iyzico/callback`,
      buyer: {
        id: order.userId || order.id,
        name: buyerName,
        surname: buyerSurname,
        identityNumber: "11111111111", // required by iyzico; user can provide real TC via profile
        email: buyerEmail,
        gsmNumber: buyerPhone.replace(/\s/g, "").replace(/^0/, "+90"),
        registrationAddress: buyerAddress,
        city: buyerCity,
        country: "Turkey",
        ip,
      },
      shippingAddress: {
        contactName: `${buyerName} ${buyerSurname}`,
        city: buyerCity,
        country: "Turkey",
        address: buyerAddress,
        zipCode: order.address?.postalCode || "34000",
      },
      billingAddress: {
        contactName: `${buyerName} ${buyerSurname}`,
        city: buyerCity,
        country: "Turkey",
        address: buyerAddress,
        zipCode: order.address?.postalCode || "34000",
      },
      basketItems,
    });

    if (result.status !== "success") {
      console.error("[iyzico/initialize] error:", result);
      return NextResponse.json(
        { error: result.errorMessage || "iyzico bağlantı hatası" },
        { status: 400 }
      );
    }

    // Store iyzico token on the order
    await prisma.order.update({
      where: { id: order.id },
      data: { iyzicoToken: result.token },
    });

    return NextResponse.json({
      checkoutFormContent: result.checkoutFormContent,
      token: result.token,
    });
  } catch (err) {
    console.error("[iyzico/initialize]", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
