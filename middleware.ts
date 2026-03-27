import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token");
  const role = request.cookies.get("auth_role")?.value;

  const pathname = request.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isPortalPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/akademik") ||
    pathname.startsWith("/pembayaran") ||
    pathname.startsWith("/kkn") ||
    pathname.startsWith("/plp") ||
    pathname.startsWith("/pengumuman") ||
    pathname.startsWith("/profil") ||
    pathname.startsWith("/bantuan") ||
    pathname.startsWith("/notifikasi");

  const isAdminPage =
    pathname.startsWith("/admin");

  if (!token && (isPortalPage || isAdminPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthPage) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdminPage && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/akademik/:path*",
    "/pembayaran/:path*",
    "/kkn/:path*",
    "/plp/:path*",
    "/pengumuman/:path*",
    "/profil/:path*",
    "/bantuan/:path*",
    "/notifikasi/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};