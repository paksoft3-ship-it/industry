import { getAuditLogs } from "@/lib/actions/audit";
import AdminAuditLogClient from "./AdminAuditLogClient";

export default async function AdminAuditLogPage(props: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await props.searchParams;
  const page = parseInt(sp.page || "1");
  const entity = sp.entity || "";
  const action = sp.action || "";

  const result = await getAuditLogs({
    page,
    entity: entity || undefined,
    action: action || undefined,
  });

  const data = JSON.parse(JSON.stringify(result));

  return (
    <AdminAuditLogClient
      logs={data.logs}
      total={data.total}
      totalPages={data.totalPages}
      page={data.page}
      entityFilter={entity}
      actionFilter={action}
    />
  );
}
