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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") ?? "200";
    const base = getBackendBase();

    const res = await fetch(
      `${base}/api/fixtures/upcoming?limit=${encodeURIComponent(limit)}`,
      { cache: "no-store", headers: { Accept: "application/json" } }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          error: `Backend /api/fixtures/upcoming returned ${res.status}`,
          details: text.slice(0, 2000),
          data: [],
        },
        { status: 502 }
      );
    }

    const json = await res.json();
    return NextResponse.json({ data: json?.data ?? [] });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to load upcoming matches", data: [] },
      { status: 500 }
    );
  }
}
