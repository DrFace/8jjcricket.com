import { NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Cache for 1 minute

// GET /api/player/[id]
// Fetches detailed player information
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = parseInt(params.id)
    
    if (isNaN(playerId)) {
      return NextResponse.json(
        { error: 'Player ID must be an integer' },
        { status: 400 }
      )
    }
    
    // Get player details with includes
    const json = await smFetch(`/players/${playerId}?include=country,career`)
    
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
      { error: msg || 'Failed to load player details', success: false },
      { status: 500 }
    )
  }
}
