import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_API_BASE = "https://8jjcricket.com/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const page = searchParams.get("page") || "1";
  const per_page = searchParams.get("per_page") || "20";

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;

  const url = new URL(base.replace(/\/+$/, "") + "/news");
  if (category) url.searchParams.set("category", category);
  url.searchParams.set("page", page);
  url.searchParams.set("per_page", per_page);

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Failed to fetch news: ${res.status} ${text}` },
        { status: res.status },
      );
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error fetching news" },
      { status: 500 },
    );
  }
}
