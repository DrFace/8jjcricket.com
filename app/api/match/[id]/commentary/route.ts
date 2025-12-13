import { NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/match/[id]/commentary
// Fetches ball-by-ball commentary for a match
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
    
    // Get fixture with balls for commentary
    const json = await smFetch(`/fixtures/${matchId}?include=balls,scoreboards,localteam,visitorteam,venue,league`)
    
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
      { error: msg || 'Failed to load commentary', success: false },
      { status: 500 }
    )
  }
}
