import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function GET() {
  // need to remove local_base
  const local_base = "http://127.0.0.1:8000/api";

  try {
    const res = await fetch(`${local_base}/fixtures/recent`, {
      // helps prevent caching issues
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Laravel API failed: ${res.status}`, data: [] },
        { status: 502 }
      );
    }

    const json = await res.json();

    // json is already: { data: [...] }
    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load recent fixtures", data: [] },
      { status: 500 }
    );
  }
}
