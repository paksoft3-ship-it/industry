import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Admin auth pages are accessible without a session
const ADMIN_AUTH_PAGES = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role as string | undefined;
  const isAdmin = isLoggedIn && ADMIN_ROLES.includes(role ?? "");

  // ── Admin auth pages (login / forgot-password / reset-password) ──────────
  if (ADMIN_AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    // Already logged-in admins go straight to the dashboard
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  // ── Protected admin dashboard routes ─────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
    }
    if (!isAdmin) {
      // Authenticated but not an admin → send to home
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  // ── Protected customer routes ─────────────────────────────────────────────
  const customerProtected = ["/hesap", "/favoriler"];
  if (customerProtected.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/uye-girisi-sayfasi", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/hesap/:path*", "/favoriler/:path*"],
};
