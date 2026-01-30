import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_API_BASE = "https://8jjcricket.com/api";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;
  const url = base.replace(/\/+$/, "") + "/news/categories";

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Failed to fetch categories: ${res.status} ${text}` },
        { status: res.status },
      );
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error fetching categories" },
      { status: 500 },
    );
  }
}
