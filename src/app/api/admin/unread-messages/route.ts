import { NextResponse } from "next/server";
import { getUnreadMessageCount } from "@/lib/actions/contact";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getUnreadMessageCount();
  return NextResponse.json({ count });
}
