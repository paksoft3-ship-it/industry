import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const protectedPaths = ["/admin", "/hesap", "/favoriler"];
const adminPaths = ["/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    const loginUrl = new URL("/uye-girisi-sayfasi", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminRoute = adminPaths.some((p) => pathname.startsWith(p));
  if (isAdminRoute) {
    const role = req.auth?.user?.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/hesap/:path*", "/favoriler/:path*"],
};
