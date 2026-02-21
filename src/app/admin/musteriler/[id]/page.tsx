import { notFound } from "next/navigation";
import { getCustomerDetail } from "@/lib/actions/customers";
import CustomerDetailClient from "./CustomerDetailClient";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerDetail(id);

  if (!customer) notFound();

  return <CustomerDetailClient customer={JSON.parse(JSON.stringify(customer))} />;
}
