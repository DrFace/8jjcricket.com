import { NextRequest, NextResponse } from 'next/server'

const SPORTMONKS_API_TOKEN = process.env.SPORTMONKS_API_TOKEN || ''

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id || id === 'null' || id === 'undefined') {
      return NextResponse.json(
        { error: 'Valid season ID is required' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `http://72.60.107.98:8001/api/seasons/${id}?api_token=${SPORTMONKS_API_TOKEN}&include=venues`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour (venues don't change often)
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Extract venues from the season data
    const venues = data?.data?.venues?.data || []

    return NextResponse.json(
      { data: venues },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching season venues:', error)
    return NextResponse.json(
      { error: 'Failed to fetch season venues' },
      { status: 500 }
    )
  }
}
