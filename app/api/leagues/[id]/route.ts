import { NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/leagues/[id]
// Fetches detailed information about a specific league/series
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const leagueId = parseInt(params.id)
    
    // Validate that ID is an integer
    if (isNaN(leagueId)) {
      return NextResponse.json(
        { error: 'League ID must be an integer' },
        { status: 400 }
      )
    }
    
    // Use GET League By ID endpoint with correct includes
    const json = await smFetch(`/leagues/${leagueId}?include=country,season,seasons`)
    const league = json?.data
    
    if (!league) {
      return NextResponse.json(
        { error: 'League not found' },
        { status: 404 }
      )
    }
    
    // Find current season
    if (league.seasons && league.seasons.length > 0) {
      const currentSeason = league.seasons.find((s: any) => s.is_current === true)
      if (currentSeason) {
        league.currentseason = currentSeason
      } else {
        // If no current season, use the most recent one
        league.currentseason = league.seasons[0]
      }
    }
    
    return NextResponse.json({ data: league })
  } catch (err: any) {
    const msg = String(err?.message ?? '')
    if (msg === 'SPORTMONKS_RATE_LIMIT') {
      return NextResponse.json(
        { error: 'SportMonks rate limit reached. Please try again soon.' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: msg || 'Failed to load league details' },
      { status: 500 }
    )
  }
}
