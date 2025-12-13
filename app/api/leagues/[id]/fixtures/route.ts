import { NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/leagues/[id]/fixtures
// Fetches all fixtures/matches for a specific league
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
    
    // First get the league with seasons to find the current/latest season
    const leagueJson = await smFetch(`/leagues/${leagueId}?include=seasons`)
    const seasons = leagueJson?.data?.seasons || []
    
    if (seasons.length === 0) {
      return NextResponse.json({ 
        data: [],
        success: true,
        message: 'No seasons found for this league'
      })
    }
    
    // Get the current or latest season (not oldest)
    const sortedSeasons = [...seasons].sort((a: any, b: any) => {
      const getLatestYear = (name: string) => {
        const years = name.match(/\d{4}/g)
        return years ? Math.max(...years.map(y => parseInt(y))) : 0
      }
      return getLatestYear(b.name) - getLatestYear(a.name)
    })
    const currentSeason = seasons.find((s: any) => s.is_current) || sortedSeasons[0]
    
    // Now fetch fixtures for this season with all necessary includes
    // Include teams, runs, venue, stage, and other match details
    const fixturesJson = await smFetch(
      `/fixtures?filter[season_id]=${currentSeason.id}&include=localteam,visitorteam,runs,venue,league,stage,tosswon,manofmatch`
    )
    
    return NextResponse.json({ 
      data: fixturesJson?.data ?? [],
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
      { data: [], success: true, message: 'No fixtures available' },
      { status: 200 }
    )
  }
}
