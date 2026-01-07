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

export async function GET() {
  try {
    const now = Date.now();
    if (liveCache && now - liveCache.timestamp < 30_000) {
      return NextResponse.json(liveCache.json);
    }

    const base = getBackendBase();

    const res = await fetch(`${base}/api/fixtures/live`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          error: `Backend /api/fixtures/live returned ${res.status}`,
          details: text.slice(0, 2000),
          data: { live: [], upcoming: [], recent: [] },
        },
        { status: 502 }
      );
    }

    const json = await res.json();
    const live = json?.data ?? [];

    // IMPORTANT: your UI expects: { data: { live, upcoming, recent } }
    const responseJson = { data: { live, upcoming: [], recent: [] } };

    liveCache = { timestamp: now, json: responseJson };
    return NextResponse.json(responseJson);
  } catch (err: any) {
    console.error("Error in /api/live:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error in /api/live" },
      { status: 500 }
    );
  }
}
