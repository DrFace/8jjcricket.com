import { NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/match/[id]/scorecard
// Fetches detailed scorecard for a match
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = parseInt(params.id)
    
    if (isNaN(matchId)) {
      return NextResponse.json(
        { error: 'Match ID must be an integer' },
        { status: 400 }
      )
    }
    
    // Get fixture with complete scorecard data
    const json = await smFetch(`/fixtures/${matchId}?include=localteam,visitorteam,batting,bowling,scoreboards,runs,venue,league,stage`)
    
    return NextResponse.json({ 
      data: json?.data ?? null,
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
      { error: msg || 'Failed to load scorecard', success: false },
      { status: 500 }
    )
  }
}
