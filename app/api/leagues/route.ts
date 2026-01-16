import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function GET(req: Request) {

  const url = new URL(req.url);
  const qs = url.searchParams.toString(); // ✅ read ?page, ?per_page, ?country_id, etc.

  const upstream = `${API_BASE}/leagues${qs ? `?${qs}` : ""}`; // ✅ forward query string

  const res = await fetch(upstream, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const json = await res.json(); // ✅ keep structure (data/meta/links)

  return NextResponse.json(json, {
    status: res.status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
