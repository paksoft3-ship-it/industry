import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function DELETE(request: Request) {
    const session = await auth();
    const isAdmin = session?.user && (["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role));

    if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    if (!url.startsWith("https://") || !url.includes(".public.blob.vercel-storage.com/")) {
        return NextResponse.json({ error: "Invalid blob URL" }, { status: 400 });
    }

    try {
        await del(url);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
