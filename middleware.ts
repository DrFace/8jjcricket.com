import { NextRequest, NextResponse } from "next/server";

function isMobileUserAgent(ua: string) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // avoid loops + ignore next internals/assets
  if (
    pathname.startsWith("/moblie") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const ua = req.headers.get("user-agent") || "";
  if (isMobileUserAgent(ua)) {
    const url = req.nextUrl.clone();
    url.pathname = "/moblie";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };
