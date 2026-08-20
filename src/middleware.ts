import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/src/lib/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";
  const isApiAdminRoute = pathname.startsWith("/api/admin");
  const isPublicAdminApi =
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout";

  if (!isAdminRoute && !isApiAdminRoute) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!session && isApiAdminRoute && !isPublicAdminApi) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!session && isAdminRoute && !isLoginRoute) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
