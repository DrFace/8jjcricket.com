import { NextRequest, NextResponse } from 'next/server'

const SPORTMONKS_API_TOKEN = process.env.SPORTMONKS_API_TOKEN || ''

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'League ID is required' },
        { status: 400 }
      )
    }

    // First, get the league to find its current/latest season
    const leagueResponse = await fetch(
      `https://cricket.sportmonks.com/api/v2.0/leagues/${id}?api_token=${SPORTMONKS_API_TOKEN}&include=seasons`,
      {
        next: { revalidate: 300 },
      }
    )

    if (!leagueResponse.ok) {
      throw new Error(`League API responded with status: ${leagueResponse.status}`)
    }

    const leagueData = await leagueResponse.json()
    const seasons = leagueData?.data?.seasons?.data || []
    
    if (seasons.length === 0) {
      return NextResponse.json({ data: [] })
    }

    // Get the latest season (sort by name/year)
    const latestSeason = seasons.sort((a: any, b: any) => {
      const getYear = (name: string) => {
        const years = name.match(/\d{4}/g)
        return years ? Math.max(...years.map(y => parseInt(y))) : 0
      }
      return getYear(b.name) - getYear(a.name)
    })[0]

    // Fetch fixtures using the fixtures endpoint filtered by season
    const fixturesResponse = await fetch(
      `https://cricket.sportmonks.com/api/v2.0/fixtures/season/${latestSeason.id}?api_token=${SPORTMONKS_API_TOKEN}&include=localteam,visitorteam,venue,runs`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute (fixtures update frequently)
      }
    )

    if (!fixturesResponse.ok) {
      throw new Error(`Fixtures API responded with status: ${fixturesResponse.status}`)
    }

    const fixturesData = await fixturesResponse.json()
    const fixtures = fixturesData?.data || []

    return NextResponse.json(
      { data: fixtures },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching league fixtures:', error)
    return NextResponse.json(
      { error: 'Failed to fetch league fixtures' },
      { status: 500 }
    )
  }
}
