import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const BACKEND_BASE = (
  process.env.NEXT_PUBLIC_BACKEND_BASE ?? "https://8jjcricket.com"
).replace(/\/+$/, "");

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { searchParams } = new URL(req.url);
  const id = params.id;

  // const local_url = "http://127.0.0.1:8000";

  const backendUrl = new URL(`${BACKEND_BASE}/api/catalog/${id}`);
  for (const [k, v] of searchParams.entries())
    backendUrl.searchParams.set(k, v);

  try {
    const res = await fetch(backendUrl.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Backend /api/players/:id error:", res.status, text);
      return NextResponse.json(
        { error: "Failed to fetch player", status: res.status },
        { status: 502 },
      );
    }

    const json = await res.json();
    return NextResponse.json(json, {
      headers: {
        "x-debug-api": "catalog-route-ts",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("❌ Exception:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
