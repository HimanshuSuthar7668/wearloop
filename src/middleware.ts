import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/cart", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("wearloop_token")?.value;
  if (token) return NextResponse.next();

  const redirectUrl = new URL("/auth", request.url);
  redirectUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/cart/:path*", "/profile/:path*"],
};
