import { NextRequest, NextResponse } from 'next/server'

const SPORTMONKS_API_TOKEN = process.env.NEXT_PUBLIC_SPORTMONKS_API_TOKEN

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
      `https://cricket.sportmonks.com/api/v2.0/leagues/${id}?api_token=${SPORTMONKS_API_TOKEN}&include=country,season,seasons`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching league details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch league details' },
      { status: 500 }
    )
  }
}
