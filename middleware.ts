import { NextRequest, NextResponse } from "next/server";

// Helper to detect mobile devices
function isMobileUserAgent(ua: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

// SEO-safe bot detection - NEVER redirect these
function isBotUserAgent(ua: string): boolean {
  return /Googlebot|Googlebot-Mobile|Googlebot-Image|Googlebot-News|Googlebot-Video|Googlebot-Smartphone|AdsBot-Google|AdsBot-Google-Mobile|Mediapartners-Google|APIs-Google|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|facebookexternalhit|ia_archiver|Twitterbot|LinkedInBot|Pinterest|Slackbot|Discordbot|WhatsApp|TelegramBot|Applebot|bot|crawler|spider|robot|crawling/i.test(ua);
}

// Paths to skip entirely (no header injection, no redirect)
function shouldSkip(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/sitemap-0.xml" ||
    pathname.startsWith("/api") ||
    /\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot|json|xml|txt|mp4|webm|mp3|pdf)$/i.test(pathname)
  );
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Skip static assets and internals
  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  // Compute origin from forwarded headers or fallback
  const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
  const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host") || "www.8jjcricket.com";
  const origin = `${forwardedProto}://${forwardedHost}`;

  // Create new request headers with SEO info
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-origin", origin);

  const ua = req.headers.get("user-agent") || "";

  // If already on /mobile, just pass through with headers (prevent loop)
  if (pathname === "/mobile" || pathname.startsWith("/mobile/")) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Allow desktop override via ?view=desktop (prevent redirect)
  if (searchParams.get("view") === "desktop") {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // NEVER redirect bots - critical for SEO
  if (isBotUserAgent(ua)) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Redirect mobile users to /mobile{path} using 302 (temporary)
  if (isMobileUserAgent(ua)) {
    const url = req.nextUrl.clone();
    url.pathname = `/mobile${pathname === "/" ? "" : pathname}`;
    // 302 = temporary redirect, SEO-safe for device-based routing
    return NextResponse.redirect(url, 302);
  }

  // Desktop: pass through with headers
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = { matcher: ["/:path*"] };