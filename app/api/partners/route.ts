/**
 * Partners API Route
 * 
 * Proxy endpoint for fetching partners data from backend.
 * Re-committed on: Feb 19, 2026 for homeVi branch as requested by tech lead.
 * 
 * Endpoint: GET /api/partners
 * Backend: /api/home-partners
 */

import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://8jjcricket.com";

export async function GET() {
  const upstream = `${BACKEND_URL}/api/home-partners`;

  try {
    const res = await fetch(upstream, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}