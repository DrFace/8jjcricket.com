import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const BACKEND_BASE = (
  process.env.NEXT_PUBLIC_BACKEND_BASE ?? "https://8jjcricket.com"
).replace(/\/+$/, "");

// GET /api/team-rankings
// Now proxies to Laravel backend instead of calling SportMonks directly.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Forward optional query params if you ever use them:
  // /api/team-rankings?type=ODI&gender=men etc.
  const backendUrl = new URL(`${BACKEND_BASE}/api/team-rankings`);
  for (const [k, v] of searchParams.entries()) {
    backendUrl.searchParams.set(k, v);
  }

  try {
    const res = await fetch(backendUrl.toString(), { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Backend /api/team-rankings error:", res.status, text);
      return NextResponse.json(
        { error: "Failed to fetch team rankings", status: res.status },
        { status: 502 }
      );
    }

    const json = await res.json();
    return NextResponse.json(json); // expects { data: [...] }
  } catch (err: any) {
    console.error("❌ Exception:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
