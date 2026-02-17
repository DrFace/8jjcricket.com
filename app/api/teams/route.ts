import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://8jjcricket.com/api";
// const local_base = "http://127.0.0.1:8000/api";
// GET /api/teams
// Returns a list of all teams with basic metadata. Clients can filter
// national and domestic teams based on the `national_team` boolean.
export async function GET() {
  const upstream = `${NEXT_PUBLIC_API_BASE_URL}/teams`;

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
