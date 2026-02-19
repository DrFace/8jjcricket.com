import { NextResponse } from "next/server";

export async function GET() {
  const upstream = "https://8jjcricket.com/api/home-partners";

  const res = await fetch(upstream, {
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
