import { NextResponse } from 'next/server'
import { smFetch, mapTeam } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/recent
// Returns a list of completed fixtures (archive). This mirrors the behaviour
// of the upstream 8jjcricket implementation, fetching fixtures with
// status=Finished and sorting by start date descending.
export async function GET() {
  try {
    const json = await smFetch('/fixtures?filter[status]=Finished&sort=-starting_at&include=localteam,visitorteam')
    const fixtures = (json?.data ?? []).map((f: any) => ({
      id: f.id,
      round: f.round,
      status: f.status,
      starting_at: f.starting_at,
      note: f.note,
      localteam_id: f.localteam_id ?? f.localteam?.id,
      visitorteam_id: f.visitorteam_id ?? f.visitorteam?.id,
      localteam: mapTeam(f.localteam),
      visitorteam: mapTeam(f.visitorteam),
      live: f.live ?? false,
    }))
    return NextResponse.json({ data: fixtures })
  } catch (err: any) {
    const msg = String(err?.message ?? '')
    if (msg === 'SPORTMONKS_RATE_LIMIT') {
      return NextResponse.json(
        { error: 'SportMonks rate limit reached. Please try again soon.' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: msg || 'Failed to load recent fixtures', data: [] },
      { status: 500 }
    )
  }
}