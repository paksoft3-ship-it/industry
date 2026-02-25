import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Admin auth pages are accessible without a session
const ADMIN_AUTH_PAGES = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

/**
 * Derive the true request origin from Host header so redirects work correctly
 * in both local dev (localhost:3000) and production — regardless of what
 * AUTH_URL / NEXTAUTH_URL env vars are set to.
 */
function getOrigin(req: Parameters<Parameters<typeof auth>[0]>[0]): string {
  const host = req.headers.get("host");
  if (host) {
    const isLocal = host.startsWith("localhost") || host.startsWith("127.");
    const proto = isLocal
      ? "http"
      : req.headers.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  }
  return req.nextUrl.origin;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role as string | undefined;
  const isAdmin = isLoggedIn && ADMIN_ROLES.includes(role ?? "");
  const origin = getOrigin(req);

  // ── Admin auth pages (login / forgot-password / reset-password) ──────────
  if (ADMIN_AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    // Already logged-in admins go straight to the dashboard
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", origin));
    }
    return NextResponse.next();
  }

  // ── Protected admin dashboard routes ─────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", origin));
    }
    if (!isAdmin) {
      // Authenticated but not an admin → send to home
      return NextResponse.redirect(new URL("/", origin));
    }
    return NextResponse.next();
  }

  // ── Protected customer routes ─────────────────────────────────────────────
  const customerProtected = ["/hesap", "/favoriler"];
  if (customerProtected.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/uye-girisi-sayfasi", origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/hesap/:path*", "/favoriler/:path*"],
};
