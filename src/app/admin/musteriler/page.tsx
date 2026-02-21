import { getCustomers } from "@/lib/actions/customers";
import AdminCustomersClient from "./AdminCustomersClient";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") || "desc";

  const data = await getCustomers({ search, page, limit: 20, sortBy, sortOrder });

  return (
    <AdminCustomersClient
      customers={JSON.parse(JSON.stringify(data.customers))}
      total={data.total}
      totalPages={data.totalPages}
      currentPage={page}
      filters={{ search, sortBy, sortOrder }}
    />
  );
}
