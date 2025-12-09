"use client"

import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'

interface League {
  seasons: any[]
  id: number
  name: string
  code: string
  image_path: string
  type: string
  dateRange?: string
}

interface SeriesByMonth {
  [key: string]: League[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const tabs = [
  { id: 'current', label: 'Current Matches' },
  { id: 'series', label: 'Current & Future Series' },
  { id: 'byDay', label: 'Matches By Day' },
  { id: 'teams', label: 'Teams' },
  { id: 'archive', label: 'Series Archive' },
]

const filters = ['All', 'International', 'League', 'Domestic', 'Women']

/**
 * SeriesPage displays cricket series similar to Cricbuzz format
 * with tabs and series grouped by month
 */
export default function SeriesPage() {
  const [activeTab, setActiveTab] = useState('series')
  const [activeFilter, setActiveFilter] = useState('All')
  const { data, error, isLoading } = useSWR('/api/leagues', fetcher)
  
  const title = 'Cricket Schedule - Series | 8jjcricket'
  const description = 'View current and upcoming cricket series, matches, and tournaments.'

  if (error) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">Failed to load series.</div>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </>
    )
  }

  const leagues: League[] = data?.data ?? []
  
  // Filter leagues based on active filter
  let filteredLeagues = leagues
  if (activeFilter === 'International') {
    filteredLeagues = leagues.filter((l) => 
      l.code.match(/T20I|ODI|TEST|WC|AC|ASH|WA|WODI|WT20/i) || 
      l.name.toLowerCase().includes('world cup') ||
      l.name.toLowerCase().includes('ashes') ||
      l.name.toLowerCase().includes('champions trophy')
    )
  } else if (activeFilter === 'League') {
    filteredLeagues = leagues.filter((l) => 
      l.code.match(/IPL|BBL|PSL|BPL|CPL|ILT20|SA20|MLC|LPL|MSL/i) ||
      l.name.toLowerCase().includes('premier league') ||
      l.name.toLowerCase().includes('super league')
    )
  } else if (activeFilter === 'Domestic') {
    filteredLeagues = leagues.filter((l) => l.type === 'domestic' || l.code.match(/DOMESTIC/i))
  } else if (activeFilter === 'Women') {
    filteredLeagues = leagues.filter((l) => l.code.match(/WOMEN|WOM/i) || l.name.toLowerCase().includes('women'))
  }

  // Filter only current and future series (2024 onwards)
  const currentYear = 2025
  const currentAndFutureLeagues = filteredLeagues.filter((league) => {
    // If league has seasons, check if any season is from 2024 onwards
    if (league.seasons && Array.isArray(league.seasons) && league.seasons.length > 0) {
      return league.seasons.some((season: any) => {
        const seasonName = season.name || ''
        // Extract year from season name (e.g., "2024/2025", "2025", "2024-25")
        const yearMatch = seasonName.match(/\d{4}/)
        if (yearMatch) {
          const year = parseInt(yearMatch[0])
          return year >= 2024
        }
        return false
      })
    }
    return true // Include leagues without season info
  })

  // Sort leagues: currently active leagues first, then by start date
  const sortedLeagues = [...currentAndFutureLeagues].sort((a, b) => {
    const aCurrentSeason = a.seasons?.find((s: any) => s.is_current)
    const bCurrentSeason = b.seasons?.find((s: any) => s.is_current)
    
    // Active leagues come first
    if (aCurrentSeason && !bCurrentSeason) return -1
    if (!aCurrentSeason && bCurrentSeason) return 1
    
    // If both or neither are active, sort by start date
    const aDate = aCurrentSeason?.starting_at || a.seasons?.[0]?.starting_at
    const bDate = bCurrentSeason?.starting_at || b.seasons?.[0]?.starting_at
    
    if (!aDate && !bDate) return 0
    if (!aDate) return 1
    if (!bDate) return -1
    
    return new Date(aDate).getTime() - new Date(bDate).getTime()
  })

  // Group series by month based on current season dates
  const seriesByMonth: SeriesByMonth = {}
  
  sortedLeagues.forEach((league) => {
    const currentSeason = league.seasons?.find((s: any) => s.is_current) || league.seasons?.[0]
    
    if (currentSeason?.starting_at) {
      const startDate = new Date(currentSeason.starting_at)
      const monthYear = startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      
      if (!seriesByMonth[monthYear]) {
        seriesByMonth[monthYear] = []
      }
      seriesByMonth[monthYear].push({
        ...league,
        dateRange: formatDateRange(currentSeason.starting_at, currentSeason.ending_at)
      })
    } else {
      // For leagues without dates, put them in current month
      const monthYear = 'December 2025'
      if (!seriesByMonth[monthYear]) {
        seriesByMonth[monthYear] = []
      }
      seriesByMonth[monthYear].push(league)
    }
  })

  // Sort months chronologically
  const sortedMonths = Object.keys(seriesByMonth).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })

  // Helper function to format date range
  function formatDateRange(start: string, end: string) {
    if (!start || !end) return ''
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      <div className="space-y-6">
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Show Series content only when series tab is active */}
        {activeTab === 'series' && (
          <>
            {/* Page Title & Description */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Series & Leagues</h1>
              <p className="text-gray-600">Explore major cricket leagues and tournaments.</p>
            </div>

            {/* Series Grid - Card Layout like screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sortedLeagues.length === 0 ? (
                <div className="col-span-full bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-600">No current or upcoming series found.</p>
                </div>
              ) : (
                sortedLeagues.map((league) => {
                  const isActive = league.seasons?.some((s: any) => s.is_current)
                  return (
                  <Link
                    key={league.id}
                    href={`/series/${league.id}`}
                    className={`bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center group relative ${
                      isActive ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-200'
                    }`}
                  >
                    {/* Active Badge */}
                    {isActive && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                        LIVE
                      </span>
                    )}
                    
                    {/* League Logo */}
                    <div className="w-16 h-16 mb-3 flex items-center justify-center">
                      {league.image_path ? (
                        <img 
                          src={league.image_path} 
                          alt={league.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                          {league.code.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    {/* League Name */}
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-green-600 transition-colors mb-1">
                      {league.name}
                    </h3>
                    
                    {/* League Code */}
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      {league.code}
                    </p>
                  </Link>
                )})
              )}
            </div>
          </>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'series' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">
              {activeTab === 'current' && 'Current matches will be displayed here'}
              {activeTab === 'byDay' && 'Matches by day will be displayed here'}
              {activeTab === 'teams' && 'Teams will be displayed here'}
              {activeTab === 'archive' && 'Series archive will be displayed here'}
            </p>
          </div>
        )}
      </div>
    </>
  )
}