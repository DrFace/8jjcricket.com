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
    
    // Fetch all leagues and find the specific one
    const json = await smFetch('/leagues?include=country')
    const leagues = json?.data ?? []
    const league = leagues.find((l: any) => l.id === leagueId)
    
    if (!league) {
      return NextResponse.json(
        { error: 'League not found' },
        { status: 404 }
      )
    }
    
    // Try to fetch seasons for this league
    try {
      const seasonsJson = await smFetch(`/seasons?league_id=${leagueId}`)
      league.seasons = seasonsJson?.data ?? []
      
      // Find current season
      const currentSeason = league.seasons.find((s: any) => s.is_current === true)
      if (currentSeason) {
        league.currentseason = currentSeason
      }
    } catch (seasonErr) {
      // If seasons endpoint fails, continue without seasons data
      console.error('Failed to fetch seasons:', seasonErr)
      league.seasons = []
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
