import { NextResponse } from 'next/server'

// A proxy route to fetch the latest news articles from the backend CMS.
// This avoids performing an uncached fetch during build time.  It reads
// NEXT_PUBLIC_API_BASE_URL from the environment when available and falls
// back to the default 8jj backend.  The news API is expected to return
// a JSON object with a `data` array containing the articles.

const DEFAULT_API_BASE = 'http://72.60.107.98:8001/api'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE
  const url = `${base.replace(/\/+$/, '')}/news`
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return NextResponse.json(
        { error: `Failed to fetch news: ${res.status} ${text}` },
        { status: res.status }
      )
    }
    const json = await res.json()
    return NextResponse.json(json)
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Unknown error fetching news' },
      { status: 500 }
    )
  }
}