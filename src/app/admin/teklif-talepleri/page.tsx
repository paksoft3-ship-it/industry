import { getQuoteRequests } from "@/lib/actions/quoteRequests";
import AdminTeklifTalepleriClient from "./AdminTeklifTalepleriClient";

export const dynamic = "force-dynamic";

export default async function AdminTeklifTalepleriPage() {
  const requests = await getQuoteRequests();
  return (
    <AdminTeklifTalepleriClient
      requests={requests.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }))}
    />
  );
}
