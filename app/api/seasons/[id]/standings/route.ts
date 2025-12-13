import { NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/seasons/[id]/standings
// Fetches standings/points table for a specific season
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
    
    // Use the correct Sportmonks endpoint with proper includes
    const json = await smFetch(`/standings/season/${seasonId}?include=season,league,stage,team`)
    
    return NextResponse.json({ 
      data: json?.data ?? [],
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
    // Return empty data if standings not available instead of error
    return NextResponse.json(
      { data: [], success: true, message: 'No standings available' },
      { status: 200 }
    )
  }
}
