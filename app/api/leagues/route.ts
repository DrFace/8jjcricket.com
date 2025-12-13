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
    // Prioritize leagues that have actual recent activity (not just future years)
    const filteredLeagues = allLeagues.filter((league: any) => {
      if (!league.seasons || league.seasons.length === 0) {
        return false // Exclude leagues without seasons
      }
      
      // Get the latest year from all seasons
      const getLatestSeasonYear = (seasons: any[]) => {
        let latestYear = 0
        let hasRecentActivity = false
        
        seasons.forEach((season: any) => {
          // Check if currently active
          if (season.is_current === true) {
            latestYear = 2026 // Force include current seasons
            hasRecentActivity = true
            return
          }
          
          // Extract year from season name
          const seasonName = season.name || ''
          const yearMatches = seasonName.match(/\d{4}/g)
          if (yearMatches && yearMatches.length > 0) {
            const maxYear = Math.max(...yearMatches.map((y: string) => parseInt(y)))
            if (maxYear > latestYear) latestYear = maxYear
            
            // Consider 2024-2025 as recent activity
            if (maxYear >= 2024 && maxYear <= 2025) {
              hasRecentActivity = true
            }
          }
          
          // Check starting date - if it has actual dates, it's more reliable
          if (season.starting_at) {
            const startDate = new Date(season.starting_at)
            const startYear = startDate.getFullYear()
            if (startYear > latestYear) latestYear = startYear
            
            // If starting_at is in 2024 or 2025, it's active
            if (startYear >= 2024 && startYear <= 2025) {
              hasRecentActivity = true
            }
          }
        })
        
        return { latestYear, hasRecentActivity }
      }
      
      const { latestYear, hasRecentActivity } = getLatestSeasonYear(league.seasons)
      
      // Prioritize: 
      // 1. Leagues with recent activity (2024-2025 with dates)
      // 2. Include 2025-2026 seasons
      // 3. Exclude pure 2026 without any recent data
      if (hasRecentActivity) return true
      if (latestYear === 2025) return true
      if (latestYear === 2026) {
        // Only include 2026 if it's part of 2025/2026
        return league.seasons.some((s: any) => 
          s.name.includes('2025') || s.name.includes('2024')
        )
      }
      
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