import { NextResponse } from "next/server";

const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE || "https://8jjcricket.com"}/api/home-popups`;

export async function GET() {
  const res = await fetch(backendUrl, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}
