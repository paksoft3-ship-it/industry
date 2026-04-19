import { NextResponse } from "next/server";
import { getUnreadQuoteRequestCount } from "@/lib/actions/quoteRequests";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getUnreadQuoteRequestCount();
  return NextResponse.json({ count });
}
