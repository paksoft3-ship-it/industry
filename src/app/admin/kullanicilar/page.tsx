import { getUsers } from "@/lib/actions/users";
import AdminKullanicilarClient from "./AdminKullanicilarClient";

export default async function AdminKullanicilarPage(props: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await props.searchParams;
  const page = parseInt(sp.page || "1");
  const search = sp.search || "";
  const result = await getUsers({ page, search: search || undefined });
  const data = JSON.parse(JSON.stringify(result));

  return (
    <AdminKullanicilarClient
      users={data.users}
      total={data.total}
      totalPages={data.totalPages}
      page={data.page}
      search={search}
    />
  );
}
