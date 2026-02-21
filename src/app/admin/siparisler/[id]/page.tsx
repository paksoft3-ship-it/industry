import { notFound } from "next/navigation";
import { getOrderDetail } from "@/lib/actions/orders";
import OrderDetailClient from "./OrderDetailClient";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderDetail(id);

  if (!order) notFound();

  return <OrderDetailClient order={JSON.parse(JSON.stringify(order))} />;
}
