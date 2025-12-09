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

  // Helper function to get latest season
  const getLatestSeason = (seasons: any[]) => {
    if (!seasons?.length) return null
    const sorted = [...seasons].sort((a, b) => {
      const getYear = (name: string) => {
        const years = name.match(/\d{4}/g)
        return years ? Math.max(...years.map(y => parseInt(y))) : 0
      }
      return getYear(b.name) - getYear(a.name)
    })
    return sorted[0]
  }

  // Sort leagues: currently active leagues first, then by start date
  const sortedLeagues = [...currentAndFutureLeagues].sort((a, b) => {
    const aCurrentSeason = a.seasons?.find((s: any) => s.is_current) || getLatestSeason(a.seasons)
    const bCurrentSeason = b.seasons?.find((s: any) => s.is_current) || getLatestSeason(b.seasons)
    
    // Active leagues come first
    if (aCurrentSeason?.is_current && !bCurrentSeason?.is_current) return -1
    if (!aCurrentSeason?.is_current && bCurrentSeason?.is_current) return 1
    
    // If both or neither are active, sort by start date or season year
    const aDate = aCurrentSeason?.starting_at
    const bDate = bCurrentSeason?.starting_at
    
    if (!aDate && !bDate) {
      // Sort by season year if no dates
      const aYear = aCurrentSeason?.name.match(/\d{4}/g)?.[0] || '0'
      const bYear = bCurrentSeason?.name.match(/\d{4}/g)?.[0] || '0'
      return parseInt(bYear) - parseInt(aYear)
    }
    if (!aDate) return 1
    if (!bDate) return -1
    
    return new Date(aDate).getTime() - new Date(bDate).getTime()
  })

  // Group series by month based on current season dates
  const seriesByMonth: SeriesByMonth = {}
  
  sortedLeagues.forEach((league) => {
    const currentSeason = league.seasons?.find((s: any) => s.is_current) || getLatestSeason(league.seasons)
    
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

        {/* Current Matches Tab */}
        {activeTab === 'current' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Live Matches</h3>
            <p className="text-gray-600">Check the home page for live cricket matches</p>
            <Link href="/" className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              View Live Matches
            </Link>
          </div>
        )}

        {/* Matches By Day Tab */}
        {activeTab === 'byDay' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Matches Schedule</h3>
            <p className="text-gray-600 mb-4">View matches organized by date on the Recent and Upcoming pages</p>
            <div className="flex gap-3 justify-center">
              <Link href="/recent" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Recent Matches
              </Link>
              <Link href="/upcoming" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Upcoming Matches
              </Link>
            </div>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cricket Teams</h3>
            <p className="text-gray-600 mb-4">Browse all international and domestic cricket teams</p>
            <Link href="/teams" className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              View All Teams
            </Link>
          </div>
        )}

        {/* Archive Tab */}
        {activeTab === 'archive' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Series Archive</h3>
            <p className="text-gray-600 mb-4">Browse past cricket series and tournaments</p>
            <Link href="/archive" className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              View Archive
            </Link>
          </div>
        )}
      </div>
    </>
  )
}