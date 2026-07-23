import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/cart", "/profile", "/favourites"];
const AUTH_PATHS = ["/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("wearloop_token")?.value;

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  
  const isAuthPage = AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (isProtected && !token) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/profile/:path*", "/favourites/:path*", "/auth/:path*"],
};
