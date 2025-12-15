"use client"

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'

interface Season {
  is_current: boolean
  id: number
  name: string
  league_id: number
  starting_at?: string
  ending_at?: string
}

interface League {
  id: number
  name: string
  code: string
  image_path: string
  type: string
  country?: {
    id: number
    name: string
    image_path: string
  }
  seasons?: Season[]
  currentseason?: Season
}

interface Match {
  id: number
  name: string
  status: string
  starting_at: string
  teams?: any[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const seriesTabs = [
  { id: 'matches', label: 'Matches' },
  { id: 'points', label: 'Points Table' },
]

/**
 * SeriesDetailPage displays comprehensive information about a specific
 * cricket series/league similar to Cricbuzz format with multiple tabs
 */
export default function SeriesDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('matches')
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null)
  const { data, error, isLoading } = useSWR(`/api/leagues/${params.id}`, fetcher)
  
  // Extract league data from response
  const leagueData: League = data?.data
  
  // Reset selected season when switching tabs or league changes
  useEffect(() => {
    if (activeTab !== 'points') {
      // Keep the selected season even when switching away from points tab
      // This prevents unnecessary resets
    }
  }, [activeTab])
  
  // Get latest season ID (not first/oldest)
  const getLatestSeasonId = () => {
    if (!leagueData?.seasons?.length) return undefined
    const sorted = [...leagueData.seasons].sort((a: any, b: any) => {
      const getYear = (name: string) => {
        const years = name.match(/\d{4}/g)
        return years ? Math.max(...years.map(y => parseInt(y))) : 0
      }
      return getYear(b.name) - getYear(a.name)
    })
    return sorted[0]?.id
  }
  
  const seasonId = selectedSeasonId || leagueData?.currentseason?.id || getLatestSeasonId()
  
  const { data: fixturesData } = useSWR(
    activeTab === 'matches' && params.id ? `/api/leagues/${params.id}/fixtures` : null,
    fetcher
  )
  
  // Fetch standings for the selected season with revalidation
  const { data: standingsData, mutate: mutateStandings } = useSWR(
    activeTab === 'points' && seasonId ? `/api/seasons/${seasonId}/standings` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 0 }
  )
  
  // Refetch standings when selected season changes
  useEffect(() => {
    if (activeTab === 'points' && seasonId) {
      mutateStandings()
    }
  }, [seasonId, activeTab, mutateStandings])
  
  // Auto-select the most recent season with standings data when Points Table tab is opened
  const { data: allSeasonsStandings } = useSWR(
    activeTab === 'points' && leagueData?.seasons?.length && !selectedSeasonId
      ? `/api/leagues/${params.id}/all-standings`
      : null,
    async () => {
      // Fetch standings for all seasons to find the most recent one with data
      const seasons = leagueData?.seasons || []
      const now = new Date()
      const currentYear = now.getFullYear()
      
      // Sort by year, but prioritize completed seasons
      const sortedSeasons = [...seasons].sort((a, b) => {
        const getYear = (name: string) => {
          const years = name.match(/\d{4}/g)
          return years ? Math.max(...years.map(y => parseInt(y))) : 0
        }
        const aYear = getYear(a.name)
        const bYear = getYear(b.name)
        
        // Prioritize current year and past years over future
        const aIsFuture = aYear > currentYear
        const bIsFuture = bYear > currentYear
        
        if (aIsFuture && !bIsFuture) return 1
        if (!aIsFuture && bIsFuture) return -1
        
        return bYear - aYear
      })
      
      // Try to find the first season with standings data
      for (const season of sortedSeasons) {
        try {
          const response = await fetch(`/api/seasons/${season.id}/standings`)
          const data = await response.json()
          if (data?.data && data.data.length > 0) {
            setSelectedSeasonId(season.id)
            return data
          }
        } catch (e) {
          continue
        }
      }
      // If no season has standings, use the most recent non-future season
      const nonFutureSeasons = sortedSeasons.filter(s => {
        const year = s.name.match(/\d{4}/g)
        return year && Math.max(...year.map(y => parseInt(y))) <= currentYear
      })
      if (nonFutureSeasons[0]) {
        setSelectedSeasonId(nonFutureSeasons[0].id)
      } else if (sortedSeasons[0]) {
        setSelectedSeasonId(sortedSeasons[0].id)
      }
      return null
    }
  )
  
  const { data: teamsData } = useSWR(
    activeTab === 'squads' && seasonId ? `/api/seasons/${seasonId}/teams` : null,
    fetcher
  )
  
  const { data: venuesData } = useSWR(
    activeTab === 'venues' && seasonId ? `/api/seasons/${seasonId}/venues` : null,
    fetcher
  )

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/series" className="text-amber-400 hover:text-amber-300 text-sm font-medium">
          ← Back to Series
        </Link>
        <div className="rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-xl p-6 shadow-2xl">
          <p className="text-red-300 font-medium">Failed to load series details. Please try again later.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-900/80 border border-white/20 rounded w-32 mb-6 backdrop-blur-xl"></div>
          <div className="h-24 bg-slate-900/80 border border-white/20 rounded-3xl mb-4 backdrop-blur-xl"></div>
          <div className="h-12 bg-slate-900/80 border border-white/20 rounded-2xl mb-6 backdrop-blur-xl"></div>
          <div className="h-64 bg-slate-900/80 border border-white/20 rounded-2xl backdrop-blur-xl"></div>
        </div>
      </div>
    )
  }

  if (!leagueData) {
    return (
      <div className="space-y-4">
        <Link href="/series" className="text-amber-400 hover:text-amber-300 text-sm font-medium">
          ← Back to Series
        </Link>
        <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl p-6 shadow-2xl">
          Series not found.
        </div>
      </div>
    )
  }

  const seasons = leagueData.seasons || []
  
  // Sort seasons by year to get the latest one
  const sortedSeasons = [...seasons].sort((a, b) => {
    // Extract years from season names (e.g., "2025/2026", "2023", "2021/2022")
    const getLatestYear = (name: string) => {
      const years = name.match(/\d{4}/g)
      return years ? Math.max(...years.map(y => parseInt(y))) : 0
    }
    return getLatestYear(b.name) - getLatestYear(a.name)
  })
  
  // Get current season: prefer completed recent season over future seasons
  const currentSeason = (() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    
    // First try to find a season that has started
    const startedSeasons = sortedSeasons.filter(s => {
      if (s.starting_at) {
        return new Date(s.starting_at) <= now
      }
      // If no date, check year from name
      const years = s.name.match(/\d{4}/g)
      if (years) {
        const maxYear = Math.max(...years.map(y => parseInt(y)))
        return maxYear <= currentYear
      }
      return false
    })
    
    // Return the most recent started season, or current season, or latest season
    return leagueData.currentseason ||
      seasons.find(s => s.is_current === true) ||
      startedSeasons[0] ||
      sortedSeasons[0]
  })()
    
  const title = `${leagueData.name} | 8jjcricket`
  const description = `View matches, news, stats and information about ${leagueData.name}`

  // Format dates if available
  const dateRange = currentSeason?.starting_at && currentSeason?.ending_at
    ? `${new Date(currentSeason.starting_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(currentSeason.ending_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    : 'Check schedule for dates'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      <div className="space-y-6">
        {/* Series Header */}
        <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center w-10 h-10 bg-black/40 hover:bg-amber-950/60 border border-amber-400/30 rounded-full transition-all duration-300 hover:scale-110 group shadow-lg backdrop-blur-sm flex-shrink-0"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 text-amber-300 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {leagueData.image_path && (
              <Image
                src={leagueData.image_path}
                alt={leagueData.name}
                width={60}
                height={60}
                className="object-contain"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {leagueData.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-sky-100/80">
                {currentSeason && (
                  <>
                    <span>{currentSeason.name}</span>
                    <span>•</span>
                  </>
                )}
                <span>{dateRange}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-white/20 -mx-6 px-6 mt-4">
            <div className="flex overflow-x-auto -mx-6 px-6">
              {seriesTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-400 text-amber-300 bg-amber-950/30'
                      : 'border-transparent text-sky-100/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Home Tab */}
          {activeTab === 'home' && (
            <div className="p-6 space-y-8">
              {/* Series Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900">{seasons.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Editions</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900 uppercase">{leagueData.code}</p>
                  <p className="text-sm text-gray-600 mt-1">Series Code</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900 capitalize">{leagueData.type}</p>
                  <p className="text-sm text-gray-600 mt-1">Format</p>
                </div>
              </div>

              {/* Current Season Info */}
              {currentSeason && (
                <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 font-medium mb-1">CURRENT SEASON</p>
                      <p className="text-xl font-bold text-gray-900">{currentSeason.name}</p>
                      {dateRange && (
                        <p className="text-sm text-gray-600 mt-1">📅 {dateRange}</p>
                      )}
                    </div>
                    <Link 
                      href={`#`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Matches
                    </Link>
                  </div>
                </div>
              )}

              {/* News Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Latest News</h2>
                  <Link href="/news" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All →
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* News items would come from your news API */}
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                          {leagueData.name} updates and latest news will appear here
                        </h3>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                          Team announcements and squad updates
                        </h3>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-4 text-center">
                  News integration coming soon. Connect your news API to show real articles.
                </p>
              </div>

              {/* Recent Seasons */}
              {seasons.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Seasons</h2>
                  <div className="space-y-2">
                    {seasons.slice(0, 5).map((season) => (
                      <div
                        key={season.id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-gray-900">{season.name}</p>
                          {season.id === currentSeason?.id && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              Current
                            </span>
                          )}
                        </div>
                        {season.starting_at && (
                          <p className="text-sm text-gray-600">
                            {new Date(season.starting_at).getFullYear()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Matches Tab */}
          {activeTab === 'matches' && (
            <div className="p-6">
              {!fixturesData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading matches...</p>
                </div>
              ) : fixturesData.data?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 font-medium">No matches available for this series</p>
                  <p className="text-sm text-gray-500 mt-2">Matches will appear here once the schedule is announced</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const now = new Date()
                    
                    // Separate matches into live, recent, and upcoming
                    const liveMatches: any[] = []
                    const recentMatches: any[] = []
                    const upcomingMatches: any[] = []
                    
                    fixturesData.data?.forEach((match: any) => {
                      if (match.starting_at) {
                        const matchDate = new Date(match.starting_at)
                        const matchEndEstimate = new Date(matchDate.getTime() + (8 * 60 * 60 * 1000)) // Assume 8 hours max
                        
                        // Check if match is currently live
                        if (match.status === 'NS' && matchDate <= now && now <= matchEndEstimate) {
                          liveMatches.push(match)
                        } else if (matchDate < now) {
                          recentMatches.push(match)
                        } else {
                          upcomingMatches.push(match)
                        }
                      }
                    })
                    
                    // Sort recent matches (newest first), upcoming (soonest first)
                    recentMatches.sort((a, b) => new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime())
                    upcomingMatches.sort((a, b) => new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime())
                    
                    // Combine: live first, then recent, then upcoming
                    const sortedMatches = [...liveMatches, ...recentMatches, ...upcomingMatches]
                    
                    // Group matches by date for display
                    const groupedMatches: { [key: string]: any[] } = {}
                    sortedMatches.forEach((match: any) => {
                      if (match.starting_at) {
                        const date = new Date(match.starting_at)
                        const dateKey = date.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })
                        if (!groupedMatches[dateKey]) {
                          groupedMatches[dateKey] = []
                        }
                        groupedMatches[dateKey].push(match)
                      }
                    })

                    return Object.entries(groupedMatches).map(([date, matches]) => (
                      <div key={date}>
                        {/* Date Header */}
                        <div className="bg-blue-50 px-4 py-2 mb-3 rounded flex items-center justify-between">
                          <p className="text-sm font-semibold text-blue-800 uppercase">{date}</p>
                          {liveMatches.some(m => matches.includes(m)) && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded animate-pulse">
                              ● LIVE
                            </span>
                          )}
                        </div>
                        
                        {/* Matches for this date */}
                        <div className="space-y-3">
                          {matches.map((match: any) => {
                            const isLive = liveMatches.includes(match)
                            return (
                            <Link
                              key={match.id}
                              href={`/match/${match.id}`}
                              className={`block border rounded-lg p-4 hover:shadow-md transition-all ${
                                isLive ? 'border-red-500 bg-red-50 hover:border-red-600' : 'border-gray-200 hover:border-blue-500'
                              }`}
                            >
                              {/* Match Type & Venue */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <span className="font-medium">{match.type || 'Match'}</span>
                                  <span>•</span>
                                  <span>{match.venue?.name || 'Venue TBD'}</span>
                                </div>
                                {match.starting_at && (
                                  <span className="text-xs text-gray-500">
                                    {new Date(match.starting_at).toLocaleTimeString('en-US', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                )}
                              </div>
                              
                              {/* Teams & Scores */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-gray-900">
                                    {match.localteam?.name || 'Team 1'}
                                  </span>
                                  {match.runs?.[0] && (
                                    <span className="font-medium text-gray-900">
                                      {match.runs[0].score}/{match.runs[0].wickets || 0}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-gray-900">
                                    {match.visitorteam?.name || 'Team 2'}
                                  </span>
                                  {match.runs?.[1] && (
                                    <span className="font-medium text-gray-900">
                                      {match.runs[1].score}/{match.runs[1].wickets || 0}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Match Status/Result */}
                              {isLive && (
                                <div className="flex items-center gap-2 mt-3">
                                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                    ● LIVE NOW
                                  </span>
                                  <p className="text-sm text-red-600 font-medium">
                                    {match.note || 'Match in progress'}
                                  </p>
                                </div>
                              )}
                              {!isLive && match.note && (
                                <p className="text-sm text-blue-600 font-medium mt-3">
                                  {match.note}
                                </p>
                              )}
                              {!isLive && !match.note && match.status && (
                                <p className="text-xs text-gray-500 mt-2 capitalize">
                                  {match.status}
                                </p>
                              )}
                            </Link>
                            )
                          })}
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              )}
            </div>
          )}

          {/* News Tab */}
          {activeTab === 'news' && (
            <div className="p-6">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">News & Updates</h3>
                <p className="text-gray-600">
                  Latest news, updates and articles about {leagueData.name}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  News articles will be displayed here
                </p>
              </div>
            </div>
          )}

          {/* Points Table Tab */}
          {activeTab === 'points' && (
            <div className="p-6" key={`points-${seasonId}`}>
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-500 rounded-t-2xl p-6 mb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-lg">Points Table</h2>
                    {seasons.length > 0 && (
                      <div className="mt-3">
                        <select
                          value={seasonId || ''}
                          onChange={(e) => setSelectedSeasonId(Number(e.target.value))}
                          className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
                        >
                          {sortedSeasons.map((season) => (
                            <option key={season.id} value={season.id} className="bg-blue-600 text-white">
                              {season.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-white text-xs font-semibold uppercase tracking-wide">
                      {standingsData?.data?.length > 0 ? 'Latest Standings' : 'Standings'}
                    </p>
                  </div>
                </div>
              </div>
              
              {!standingsData ? (
                <div className="bg-white rounded-b-2xl border-2 border-t-0 border-blue-200 p-12 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4 font-medium">Loading standings...</p>
                </div>
              ) : standingsData.data?.length === 0 ? (
                <div className="bg-white rounded-b-2xl border-2 border-t-0 border-blue-200 p-12 text-center">
                  <svg className="w-20 h-20 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-700 font-semibold text-lg">No standings available</p>
                  <p className="text-gray-500 text-sm mt-2">Points table will be updated once matches begin</p>
                </div>
              ) : (
                <div className="bg-white rounded-b-2xl border-2 border-t-0 border-blue-200 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
                          <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">#</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Team</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">
                            <div className="flex flex-col items-center">
                              <span>Played</span>
                              <span className="text-blue-600">P</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">
                            <div className="flex flex-col items-center">
                              <span>Won</span>
                              <span className="text-green-600">W</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">
                            <div className="flex flex-col items-center">
                              <span>Lost</span>
                              <span className="text-red-600">L</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-blue-900 uppercase tracking-wider">
                            <div className="flex flex-col items-center">
                              <span>Points</span>
                              <span className="text-blue-600">PTS</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-100">
                        {standingsData.data?.map((standing: any, index: number) => {
                          const isTop3 = index < 3
                          const isLast = index === standingsData.data.length - 1
                          return (
                          <tr 
                            key={standing.id} 
                            className={`transition-all duration-200 hover:bg-blue-50 ${
                              isTop3 ? 'bg-gradient-to-r from-blue-50/50 to-transparent' : ''
                            } ${isLast ? 'bg-red-50/30' : ''}`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg' :
                                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md' :
                                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md' :
                                  'bg-blue-100 text-blue-900'
                                }`}>
                                  {index + 1}
                                </span>
                                {isTop3 && (
                                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-gray-900">{standing.team?.name || 'Team'}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-900 font-bold text-base">
                                {standing.played || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-900 font-bold text-base">
                                {standing.won || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 text-red-900 font-bold text-base">
                                {standing.lost || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="inline-flex items-center justify-center w-16 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold text-lg shadow-lg">
                                  {standing.points || 0}
                                </span>
                                {isTop3 && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                    Q
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Legend */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-t-2 border-blue-200">
                    <div className="flex flex-wrap items-center gap-6 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-400 to-yellow-600"></div>
                        <span className="text-gray-700 font-medium">1st Place</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-gray-700 font-medium">Top 3 Teams</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 font-bold rounded">Q</span>
                        <span className="text-gray-700 font-medium">Qualified</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Squads Tab */}
          {activeTab === 'squads' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Teams & Squads</h2>
              
              {!teamsData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading teams...</p>
                </div>
              ) : teamsData.data?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No teams data available for this series</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {teamsData.data?.map((team: any) => (
                    <Link
                      key={team.id}
                      href={`/teams/${team.id}`}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors text-center"
                    >
                      {team.image_path && (
                        <Image
                          src={team.image_path}
                          alt={team.name}
                          width={60}
                          height={60}
                          className="mx-auto mb-3 object-contain"
                        />
                      )}
                      <p className="font-medium text-gray-900">{team.name}</p>
                      {team.country && (
                        <p className="text-xs text-gray-500 mt-1">{team.country.name}</p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Venues Tab */}
          {activeTab === 'venues' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Venues</h2>
              
              {!venuesData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading venues...</p>
                </div>
              ) : venuesData.data?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No venues data available for this series</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {venuesData.data?.map((venue: any) => (
                    <div key={venue.id} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{venue.name}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        {venue.city && <p>📍 {venue.city}</p>}
                        {venue.capacity && <p>👥 Capacity: {venue.capacity.toLocaleString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
