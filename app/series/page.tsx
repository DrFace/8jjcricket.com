"use client"

import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'

interface League {
  id: number
  name: string
  code: string
  image_path: string
  type: string
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
    filteredLeagues = leagues.filter((l) => l.code.match(/T20I|ODI|TEST|WC|AC/i))
  } else if (activeFilter === 'League') {
    filteredLeagues = leagues.filter((l) => l.type === 'league' && l.code.match(/IPL|BBL|PSL|BPL|CPL/i))
  } else if (activeFilter === 'Domestic') {
    filteredLeagues = leagues.filter((l) => l.type === 'domestic' || l.code.match(/DOMESTIC/i))
  } else if (activeFilter === 'Women') {
    filteredLeagues = leagues.filter((l) => l.code.match(/WOMEN|WOM/i) || l.name.toLowerCase().includes('women'))
  }

  // Filter only current and future series (2024 onwards)
  const currentYear = 2025
  const currentAndFutureLeagues = filteredLeagues.filter((league) => {
    // If league has seasons, check if any season is from 2024 onwards
    if (league.seasons && league.seasons.length > 0) {
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

  // Group series by month based on current season dates
  const seriesByMonth: SeriesByMonth = {}
  
  currentAndFutureLeagues.forEach((league) => {
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
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cricket Schedule</h1>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Series grouped by month */}
            <div className="space-y-6">
              {sortedMonths.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-600">No current or upcoming series found for this filter.</p>
                </div>
              ) : (
                sortedMonths.map((month) => (
                  <div key={month} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Month Header */}
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <h2 className="font-semibold text-gray-900">{month}</h2>
                    </div>

                    {/* Series List Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Month
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Series Name
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {seriesByMonth[month].map((league: any) => (
                            <tr key={league.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-48">
                                {month}
                              </td>
                              <td className="px-6 py-4">
                                <Link
                                  href={`/series/${league.id}`}
                                  className="block hover:text-green-600 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h3 className="font-medium text-gray-900">{league.name}</h3>
                                      {league.dateRange && (
                                        <p className="text-xs text-gray-500 mt-1">{league.dateRange}</p>
                                      )}
                                    </div>
                                    <svg 
                                      className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M9 5l7 7-7 7" 
                                      />
                                    </svg>
                                  </div>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
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