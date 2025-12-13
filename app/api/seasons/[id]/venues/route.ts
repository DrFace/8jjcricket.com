import { NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/seasons/[id]/venues
// Fetches all venues for a specific season
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const seasonId = parseInt(params.id)
    
    // Validate that ID is an integer
    if (isNaN(seasonId)) {
      return NextResponse.json(
        { error: 'Season ID must be an integer' },
        { status: 400 }
      )
    }
    
    // Get all fixtures with venue information
    const fixturesJson = await smFetch(`/fixtures?include=venue`)
    
    // Filter fixtures by season and extract unique venues
    const fixtures = fixturesJson?.data ?? []
    const seasonFixtures = fixtures.filter((f: any) => f.season_id === seasonId)
    const venuesMap = new Map()
    
    seasonFixtures.forEach((fixture: any) => {
      if (fixture.venue && fixture.venue.id) {
        venuesMap.set(fixture.venue.id, fixture.venue)
      }
    })
    
    const venues = Array.from(venuesMap.values())
    
    return NextResponse.json({ 
      data: venues,
      success: true 
    })
  } catch (err: any) {
    const msg = String(err?.message ?? '')
    if (msg === 'SPORTMONKS_RATE_LIMIT') {
      return NextResponse.json(
        { error: 'SportMonks rate limit reached. Please try again soon.', success: false },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { data: [], success: true, message: 'No venues data available' },
      { status: 200 }
    )
  }
}
