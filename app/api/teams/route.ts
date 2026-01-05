import { NextResponse } from "next/server";
import { smFetch } from "@/lib/sportmonks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// GET /api/teams
// Returns a list of all teams with basic metadata. Clients can filter
// national and domestic teams based on the `national_team` boolean.
export async function GET() {
  const upstream = `${NEXT_PUBLIC_API_BASE_URL}/teams/countries`;

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
