import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (
                pathname,
                /* clientPayload */
            ) => {
                // --- 1. Security Guard: ADMIN ONLY ---
                const session = await auth();
                const isAdmin = session?.user && (["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role));

                if (!isAdmin) {
                    throw new Error("Only admins can upload media.");
                }

                // --- 2. Pathname Validation ---
                const allowedPrefixes = [
                    "products/",
                    "brands/",
                    "categories/",
                    "bundles/",
                    "posts/",
                    "files/",
                    "settings/",
                    "avatars/",
                    "editor/",
                ];

                const isAllowed = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
                if (!isAllowed) {
                    throw new Error(`Pathname must start with one of: ${allowedPrefixes.join(", ")}`);
                }

                return {
                    allowedContentTypes: [
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                        "image/svg+xml",
                        "application/pdf",
                        "application/zip",
                        "application/x-zip-compressed",
                        "application/octet-stream",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/vnd.ms-excel",
                        "application/msword",
                    ],
                    tokenPayload: JSON.stringify({
                        userId: session.user.id,
                        role: (session.user as any).role,
                    }),
                };
            },
            onUploadCompleted: async () => {
                // Upload complete — no action needed.
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 } // The client will also get this error
        );
    }
}
