import { NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/team-rankings
// Fetches ICC team rankings from SportMonks. This endpoint aggregates the
// Test, ODI and T20 rankings and returns them verbatim. Errors and rate
// limit conditions are surfaced as simple JSON objects with an `error`
// field so the client can show appropriate messaging.
export async function GET() {
  try {
    const json = await smFetch('/team-rankings')
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
      { error: msg || 'Failed to load team rankings' },
      { status: 500 }
    )
  }
}