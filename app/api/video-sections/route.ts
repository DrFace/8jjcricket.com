import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://72.60.107.98:8001/api";

// helper with timeout reused from /api/live
async function fetchWithTimeout(input: RequestInfo, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// simple in-memory cache so pages can fall back when the backend hiccups
let videoCache: { timestamp: number; data: any } | null = null;

export async function GET() {
  const now = Date.now();
  if (videoCache && now - videoCache.timestamp < 60_000) {
    return NextResponse.json(videoCache.data);
  }

  try {
    const res = await fetchWithTimeout(
      `${BACKEND_URL.replace(/\/+$/, "")}/video-sections`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn("video-sections backend returned", res.status);
      if (videoCache) {
        return NextResponse.json(videoCache.data);
      }
      return NextResponse.json(
        { error: "Failed to fetch from backend" },
        { status: res.status },
      );
    }

    const data = await res.json();
    videoCache = { timestamp: now, data };
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    if (videoCache) {
      return NextResponse.json(videoCache.data);
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
