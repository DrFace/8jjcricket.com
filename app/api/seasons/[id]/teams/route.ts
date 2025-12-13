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
    
    // Get season details to check league type
    const seasonJson = await smFetch(`/seasons/${seasonId}?include=league`)
    const season = seasonJson?.data
    const leagueCode = season?.league?.code || ''
    const leagueName = season?.league?.name || ''
    
    // Define full team lists for major international formats
    const internationalTeamNames = {
      ODI: ['India', 'Australia', 'England', 'Pakistan', 'South Africa', 'New Zealand', 
            'Sri Lanka', 'Bangladesh', 'West Indies', 'Afghanistan', 'Zimbabwe', 'Ireland', 
            'Netherlands', 'Scotland', 'Oman', 'United Arab Emirates', 'Namibia', 'Nepal'],
      T20I: ['India', 'Australia', 'England', 'Pakistan', 'South Africa', 'New Zealand', 
             'Sri Lanka', 'Bangladesh', 'West Indies', 'Afghanistan', 'Zimbabwe', 'Ireland',
             'Netherlands', 'Scotland', 'Oman', 'United Arab Emirates', 'Namibia', 'Nepal', 
             'Papua New Guinea', 'Uganda', 'Canada', 'United States'],
      TEST: ['India', 'Australia', 'England', 'Pakistan', 'South Africa', 'New Zealand', 
             'Sri Lanka', 'Bangladesh', 'West Indies', 'Zimbabwe', 'Afghanistan', 'Ireland']
    }
    
    // Check if this is a major international format
    const isODI = leagueCode.includes('ODI') || leagueName.toLowerCase().includes('one day')
    const isT20I = leagueCode.includes('T20I') || leagueName.toLowerCase().includes('twenty20 international')
    const isTest = leagueCode.includes('TEST') || leagueName.toLowerCase().includes('test')
    
    let seasonTeams: any[] = []
    
    // For major international formats, return all international teams
    if (isODI || isT20I || isTest) {
      const allTeamsJson = await smFetch('/teams?include=country')
      const allTeams = allTeamsJson?.data ?? []
      
      let formatTeams: string[] = []
      if (isODI) formatTeams = internationalTeamNames.ODI
      else if (isT20I) formatTeams = internationalTeamNames.T20I
      else if (isTest) formatTeams = internationalTeamNames.TEST
      
      // Filter teams by name and ensure they're national teams
      seasonTeams = allTeams.filter((team: any) => 
        team.national_team && formatTeams.includes(team.name)
      )
    } else {
      // For other leagues/tournaments, fetch from fixtures
      const fixturesJson = await smFetch(
        `/fixtures?filter[season_id]=${seasonId}&include=localteam,visitorteam`
      )
      const fixtures = fixturesJson?.data ?? []
      
      // Extract unique team IDs
      const teamIds = new Set<number>()
      fixtures.forEach((fixture: any) => {
        if (fixture.localteam_id) teamIds.add(fixture.localteam_id)
        if (fixture.visitorteam_id) teamIds.add(fixture.visitorteam_id)
      })
      
      if (teamIds.size > 0) {
        const allTeamsJson = await smFetch('/teams?include=country')
        const allTeams = allTeamsJson?.data ?? []
        seasonTeams = allTeams.filter((team: any) => teamIds.has(team.id))
      }
    }
    
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
