import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// GET /api/leagues
// Fetches a list of leagues and tournaments. Each league includes its
// associated country and seasons information. This endpoint powers the Series page and Teams page dropdown.
export async function GET() {
  const upstream = `${NEXT_PUBLIC_API_BASE_URL}/leagues`;

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
}
