// app/api/portrait-pages/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_BACKEND = "http://72.60.107.98:8001"; // backend host (no /api)

export async function GET() {
  const backend = (process.env.NEXT_PUBLIC_BACKEND_ORIGIN || DEFAULT_BACKEND).replace(/\/+$/, "");
  const url = `${backend}/api/portrait-pages`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    // forward backend response
    return new NextResponse(text, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") || "application/json" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Proxy error" }, { status: 500 });
  }
}
