import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function GET() {
  try {
    console.log("================== Calling Recent ==================");

    const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/fixtures/recent`, {
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
