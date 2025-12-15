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

    const response = await fetch(
      `https://cricket.sportmonks.com/api/v2.0/leagues/${id}?api_token=${SPORTMONKS_API_TOKEN}&include=fixtures.localteam,fixtures.visitorteam,fixtures.venue,fixtures.runs`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute (fixtures update frequently)
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Extract fixtures from the league data
    const fixtures = data?.data?.fixtures?.data || []

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
