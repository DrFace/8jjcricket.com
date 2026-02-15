import { NextRequest, NextResponse } from "next/server";

// 1. Helper to detect mobile devices
function isMobileUserAgent(ua: string) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    ua
  );
}

// 2. NEW Helper to detect Bots (Google, Bing, etc.)
function isBotUserAgent(ua: string) {
  return /bot|googlebot|crawler|spider|robot|crawling/i.test(ua);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // avoid loops + ignore next internals/assets
  if (
    pathname.startsWith("/mobile") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const ua = req.headers.get("user-agent") || "";

  // 3. THE FIX: Only redirect if it is Mobile AND NOT A BOT
  // This allows Googlebot to index your deep links (like /news/article-1)
  // while still sending human mobile users to your mobile page.
  if (isMobileUserAgent(ua) && !isBotUserAgent(ua)) {
    const url = req.nextUrl.clone();
    // Preserve the path (e.g., /download -> /mobile/download)
    url.pathname = `/mobile${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };