import { NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/leagues
// Fetches a list of leagues and tournaments. Each league includes its
// associated country and seasons information. This endpoint powers the Series page and Teams page dropdown.
export async function GET() {
  try {
    const json = await smFetch('/leagues?include=country,seasons')
    return NextResponse.json({ data: json?.data ?? [] })
  } catch (err: any) {
    const msg = String(err?.message ?? '')
    if (msg === 'SPORTMONKS_RATE_LIMIT') {
      return NextResponse.json(
        { error: 'SportMonks rate limit reached. Please try again soon.' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: msg || 'Failed to load leagues' },
      { status: 500 }
    )
  }
}