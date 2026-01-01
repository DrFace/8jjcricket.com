import { NextRequest, NextResponse } from 'next/server'

const SPORTMONKS_API_TOKEN = process.env.SPORTMONKS_API_TOKEN || ''
const BASE_URL = 'https://cricket.sportmonks.com/api/v2.0'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const seasonId = params.id

  // Validate season ID
  if (!seasonId || seasonId === 'null' || seasonId === 'undefined') {
    console.error('Invalid season ID:', seasonId)
    return NextResponse.json(
      { error: 'Invalid season ID', data: [] },
      { status: 422 }
    )
  }

  try {
    const url = `${BASE_URL}/seasons/${seasonId}?api_token=${SPORTMONKS_API_TOKEN}&include=teams`
    console.log('Fetching teams for season:', seasonId, 'URL:', url.replace(SPORTMONKS_API_TOKEN, 'TOKEN'))
    
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!res.ok) {
      console.error('API responded with status:', res.status, 'for season:', seasonId)
      return NextResponse.json(
        { error: 'Failed to fetch season teams', data: [] },
        { status: res.status }
      )
    }

    const json = await res.json()
    
    // Extract teams from the season data
    const teams = json.data?.teams?.data || []
    
    console.log('Found', teams.length, 'teams for season:', seasonId)
    
    return NextResponse.json({
      data: teams,
      meta: {
        season_id: seasonId,
        count: teams.length
      }
    })
  } catch (error) {
    console.error('Error fetching season teams:', error)
    return NextResponse.json(
      { error: 'Internal server error', data: [] },
      { status: 500 }
    )
  }
}
