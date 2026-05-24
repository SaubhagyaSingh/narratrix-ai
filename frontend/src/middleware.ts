import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/login",
    "/signup",
    "/verify"
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname.startsWith(route)
  );

  // Protect everything except public routes
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Prevent logged-in users from seeing auth pages
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};