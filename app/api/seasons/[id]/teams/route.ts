import { NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/seasons/[id]/teams
// Fetches all teams participating in a specific season
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
    
    // Get all teams with proper includes
    const json = await smFetch(`/teams?include=squad,country`)
    const allTeams = json?.data ?? []
    
    // Get fixtures for this season to find which teams are playing
    const fixturesJson = await smFetch(`/fixtures?include=localteam,visitorteam`)
    const fixtures = fixturesJson?.data ?? []
    
    // Filter fixtures by season and extract unique team IDs
    const seasonFixtures = fixtures.filter((f: any) => f.season_id === parseInt(seasonId))
    const teamIds = new Set()
    
    seasonFixtures.forEach((fixture: any) => {
      if (fixture.localteam_id) teamIds.add(fixture.localteam_id)
      if (fixture.visitorteam_id) teamIds.add(fixture.visitorteam_id)
    })
    
    // Filter teams that are in this season
    const seasonTeams = allTeams.filter((team: any) => teamIds.has(team.id))
    
    return NextResponse.json({ 
      data: seasonTeams,
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
      { data: [], success: true, message: 'No teams data available' },
      { status: 200 }
    )
  }
}
