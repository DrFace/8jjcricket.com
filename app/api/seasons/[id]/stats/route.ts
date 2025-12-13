import { NextRequest, NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

/**
 * GET /api/seasons/[id]/stats
 * Fetches statistics for a specific season including top performers
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const seasonId = params.id

    // Fetch batting and bowling stats separately
    const [battingData, bowlingData] = await Promise.all([
      smFetch(`/seasons/${seasonId}/batting`).catch(() => ({ data: [] })),
      smFetch(`/seasons/${seasonId}/bowling`).catch(() => ({ data: [] }))
    ])

    return NextResponse.json({ 
      data: {
        batting: battingData.data || [],
        bowling: bowlingData.data || []
      }
    })
  } catch (error: any) {
    if (error.message === 'SPORTMONKS_RATE_LIMIT') {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
