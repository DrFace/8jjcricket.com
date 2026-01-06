import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const BACKEND_BASE = (
  process.env.NEXT_PUBLIC_BACKEND_BASE ?? "https://8jjcricket.com"
).replace(/\/+$/, "");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") ?? "1";
  const perPage = searchParams.get("per_page") ?? "20";
  const countryId = searchParams.get("country_id") ?? "";
  const ids = searchParams.get("ids") ?? "";
  const q = (searchParams.get("q") ?? "").trim();

  const backendUrl = new URL(`${BACKEND_BASE}/api/catalog`);
  backendUrl.searchParams.set("page", page);
  backendUrl.searchParams.set("per_page", perPage);

  if (countryId) backendUrl.searchParams.set("country_id", countryId);
  if (ids) backendUrl.searchParams.set("ids", ids);

  if (q) {
    backendUrl.searchParams.set("q", q);
    backendUrl.searchParams.set("search", q); // harmless
  }

  try {
    const res = await fetch(backendUrl.toString(), { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Backend /api/catalog error:", res.status, text);
      return NextResponse.json(
        { error: "Failed to fetch catalog", status: res.status },
        { status: 502 }
      );
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err: any) {
    console.error("❌ Exception:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
