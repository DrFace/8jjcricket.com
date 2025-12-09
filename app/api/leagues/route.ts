import { NextResponse } from 'next/server'
import { smFetch } from '@/lib/sportmonks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/leagues
// Fetches a list of leagues and tournaments. Each league includes its
// associated country information and seasons. This endpoint powers the Series page.
export async function GET() {
  try {
    // Include seasons to filter current/future leagues
    const json = await smFetch('/leagues?include=country,seasons')
    const allLeagues = json?.data ?? []
    
    // Filter to show only leagues with seasons from 2024 onwards or currently active
    const filteredLeagues = allLeagues.filter((league: any) => {
      if (!league.seasons || league.seasons.length === 0) {
        return false // Exclude leagues without seasons
      }
      
      // Get the latest year from all seasons
      const getLatestSeasonYear = (seasons: any[]) => {
        let latestYear = 0
        
        seasons.forEach((season: any) => {
          // Check if currently active
          if (season.is_current === true) {
            latestYear = 2026 // Force include current seasons
            return
          }
          
          // Extract year from season name
          const seasonName = season.name || ''
          const yearMatches = seasonName.match(/\d{4}/g)
          if (yearMatches && yearMatches.length > 0) {
            const maxYear = Math.max(...yearMatches.map((y: string) => parseInt(y)))
            if (maxYear > latestYear) latestYear = maxYear
          }
          
          // Check starting date
          if (season.starting_at) {
            const startYear = new Date(season.starting_at).getFullYear()
            if (startYear > latestYear) latestYear = startYear
          }
        })
        
        return latestYear
      }
      
      const latestYear = getLatestSeasonYear(league.seasons)
      
      // Include leagues with seasons from 2024 onwards (includes 2024/2025, 2025/2026)
      return latestYear >= 2024
    })
    
    return NextResponse.json({ data: filteredLeagues })
  } catch (err: any) {
    const msg = String(err?.message ?? '')
    if (msg === 'SPORTMONKS_RATE_LIMIT') {
      return NextResponse.json(
        { error: 'SportMonks rate limit reached. Please try again soon.' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: msg || 'Failed to load leagues' },
      { status: 500 }
    )
  }
}