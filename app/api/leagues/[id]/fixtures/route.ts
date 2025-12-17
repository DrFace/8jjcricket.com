import { NextRequest, NextResponse } from 'next/server'

const SPORTMONKS_API_TOKEN = process.env.SPORTMONKS_API_TOKEN || ''

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log('🏏 Fetching fixtures for league ID:', id)

    if (!id) {
      return NextResponse.json(
        { error: 'League ID is required' },
        { status: 400 }
      )
    }

    // First, get the league to find its current/latest season
    const leagueUrl = `https://cricket.sportmonks.com/api/v2.0/leagues/${id}?api_token=${SPORTMONKS_API_TOKEN}&include=seasons`
    console.log('📡 Fetching league from:', leagueUrl.replace(SPORTMONKS_API_TOKEN, 'TOKEN'))
    
    const leagueResponse = await fetch(leagueUrl, {
      next: { revalidate: 300 },
    })

    if (!leagueResponse.ok) {
      console.error('❌ League API error:', leagueResponse.status)
      throw new Error(`League API responded with status: ${leagueResponse.status}`)
    }

    const leagueData = await leagueResponse.json()
    // Handle both array and nested data structure
    const seasons = leagueData?.data?.seasons?.data || leagueData?.data?.seasons || []
    
    console.log('📊 Found seasons:', seasons.length, seasons.slice(0, 3).map((s: any) => ({ id: s.id, name: s.name })))
    
    if (seasons.length === 0) {
      console.log('⚠️ No seasons found for league')
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

    console.log('🎯 Latest season found:', latestSeason.id, latestSeason.name)

    // Try to fetch fixtures for the latest season first
    const seasonFixturesUrl = `https://cricket.sportmonks.com/api/v2.0/seasons/${latestSeason.id}?api_token=${SPORTMONKS_API_TOKEN}&include=fixtures.localteam,fixtures.visitorteam,fixtures.venue,fixtures.runs`
    console.log('📡 Trying season fixtures endpoint:', seasonFixturesUrl.replace(SPORTMONKS_API_TOKEN, 'TOKEN'))
    
    let fixturesResponse = await fetch(seasonFixturesUrl, {
      cache: 'no-store',
    })

    let fixtures = []

    if (fixturesResponse.ok) {
      const seasonData = await fixturesResponse.json()
      fixtures = seasonData?.data?.fixtures?.data || seasonData?.data?.fixtures || []
      console.log(`✅ Found ${fixtures.length} fixtures from season endpoint`)
    }
    
    // If season endpoint didn't return fixtures or failed, try date range
    if (fixtures.length === 0) {
      console.log('⚠️ No fixtures from season endpoint, trying date range filter...')
      
      // Fetch matches from past 12 months and next 12 months
      const now = new Date()
      const oneYearAgo = new Date(now)
      oneYearAgo.setFullYear(now.getFullYear() - 1)
      const oneYearAhead = new Date(now)
      oneYearAhead.setFullYear(now.getFullYear() + 1)

      const startDate = oneYearAgo.toISOString().split('T')[0]
      const endDate = oneYearAhead.toISOString().split('T')[0]

      console.log('📅 Fetching fixtures from', startDate, 'to', endDate)

      // Fetch fixtures with date range filter
      const fixturesUrl = `https://cricket.sportmonks.com/api/v2.0/fixtures?api_token=${SPORTMONKS_API_TOKEN}&include=localteam,visitorteam,venue,runs&filter[league_id]=${id}&filter[starts_between]=${startDate},${endDate}`
      console.log('📡 Fetching fixtures from general endpoint:', fixturesUrl.replace(SPORTMONKS_API_TOKEN, 'TOKEN'))
      
      fixturesResponse = await fetch(fixturesUrl, {
        cache: 'no-store',
      })

      if (!fixturesResponse.ok) {
        console.error('❌ Fixtures API error:', fixturesResponse.status)
        const errorText = await fixturesResponse.text()
        console.error('❌ Error response:', errorText)
        throw new Error(`Fixtures API responded with status: ${fixturesResponse.status}`)
      }

      const fixturesData = await fixturesResponse.json()
      fixtures = fixturesData?.data || []
    }

    console.log(`✅ Found ${fixtures.length} fixtures for league ${id}`)
    if (fixtures.length > 0) {
      console.log('📋 Sample fixture:', JSON.stringify(fixtures[0], null, 2))
    }

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
