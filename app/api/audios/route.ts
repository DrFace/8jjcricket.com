import { NextResponse } from "next/server";
import { BACKEND_URL_API } from "../backendurl";

const backendUrl = `${BACKEND_URL_API}/audios`;

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
