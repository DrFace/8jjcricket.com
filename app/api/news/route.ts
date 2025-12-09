import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Backend base URL via domain (no trailing slash)
const DEFAULT_API_BASE = "https://8jjcricket.com/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  // Allow override in dev if you want
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE

  // Build backend URL, keep query params (e.g. ?category=xxx)
  const url = new URL(base.replace(/\/+$/, "") + "/news")
  if (category) {
    url.searchParams.set("category", category)
  }

  try {
    const res = await fetch(url.toString(), { cache: "no-store" })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return NextResponse.json(
        { error: `Failed to fetch news: ${res.status} ${text}` },
        { status: res.status }
      )
    }

    const json = await res.json()
    return NextResponse.json(json)
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error fetching news" },
      { status: 500 }
    )
  }
}
