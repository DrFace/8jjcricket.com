// src/app/api/live/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getBackendBase(): string {
  return (
    process.env.BACKEND_BASE ||
    process.env.NEXT_PUBLIC_BACKEND_BASE ||
    "https://8jjcricket.com"
  ).replace(/\/$/, "");
}

// Optional: keep a short cache like you had
let liveCache: { timestamp: number; json: any } | null = null;

// wrapper around global fetch to give us a shorter timeout and a
// consistent error when the remote is unreachable. in production the
// default undici timeout of 10s is a bit long and will still cause the
// page rendering to stall; we want to fail fast and – when possible –
// fall back to cached data.
async function fetchWithTimeout(input: RequestInfo, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const now = Date.now();
  // serve cached result if recent
  if (liveCache && now - liveCache.timestamp < 30_000) {
    return NextResponse.json(liveCache.json);
  }

  try {
    const base = getBackendBase();
    const res = await fetchWithTimeout(`${base}/api/fixtures/live`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const errorObj = {
        error: `Backend /api/fixtures/live returned ${res.status}`,
        details: text.slice(0, 2000),
      };
      // if we have stale cache, return it with a warning instead of error
      if (liveCache) {
        console.warn("Backend returned error, using stale liveCache");
        return NextResponse.json(
          { ...liveCache.json, warning: errorObj.error },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { ...errorObj, data: { live: [], upcoming: [], recent: [] } },
        { status: 502 },
      );
    }

    const json = await res.json().catch(() => ({}));
    const live = json?.data ?? [];
    const responseJson = { data: { live, upcoming: [], recent: [] } };

    liveCache = { timestamp: now, json: responseJson };
    return NextResponse.json(responseJson);
  } catch (err: any) {
    console.error("Error in /api/live:", err);
    if (liveCache) {
      // return stale data instead of erroring the whole app
      return NextResponse.json(
        { ...liveCache.json, warning: "using stale data (fetch failed)" },
        { status: 200 },
      );
    }
    return NextResponse.json(
      {
        error: err?.message ?? "Internal server error in /api/live",
        data: { live: [], upcoming: [], recent: [] },
      },
      { status: 500 },
    );
  }
}
