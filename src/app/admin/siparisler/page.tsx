import { getAdminOrders } from "@/lib/actions/orders";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const page = parseInt(params.page || "1", 10);

  const data = await getAdminOrders({ search, status, page, limit: 20 });

  return (
    <AdminOrdersClient
      orders={JSON.parse(JSON.stringify(data.orders))}
      total={data.total}
      totalPages={data.totalPages}
      currentPage={page}
      statusCounts={data.statusCounts}
      filters={{ search, status }}
    />
  );
}
