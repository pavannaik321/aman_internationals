import { NextResponse } from "next/server";

export function middleware(req) {
  const adminAuth = req.cookies.get("adminAuth") || req.headers.get("adminAuth");

  // If not found in cookies, also check localStorage token (via custom header)
  const url = req.nextUrl.clone();

  if (!adminAuth && url.pathname.startsWith("/") && !url.pathname.includes("/login")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Protect all admin routes
};
