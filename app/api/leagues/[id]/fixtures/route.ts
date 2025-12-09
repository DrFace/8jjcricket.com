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
    
    // First get the league to find its seasons
    const leagueJson = await smFetch(`/leagues/${leagueId}?include=seasons`)
    const seasons = leagueJson?.data?.seasons || []
    
    if (seasons.length === 0) {
      return NextResponse.json({ 
        data: [],
        success: true,
        message: 'No seasons found for this league'
      })
    }
    
    // Get the current or latest season
    const currentSeason = seasons.find((s: any) => s.is_current) || seasons[0]
    
    // Fetch all fixtures with complete includes
    const fixturesJson = await smFetch(`/fixtures?include=tosswon,manofmatch,manofseries,secondumpire,firstumpire,scoreboards,batting,bowling,runs,balls,visitorteam,localteam`)
    
    // Filter fixtures by season_id
    const allFixtures = fixturesJson?.data ?? []
    const seasonFixtures = allFixtures.filter((f: any) => f.season_id === currentSeason.id)
    
    return NextResponse.json({ 
      data: seasonFixtures,
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
