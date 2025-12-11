"use client"

import { useState } from 'react'
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
  { id: 'stats', label: 'Stats' },
]

/**
 * SeriesDetailPage displays comprehensive information about a specific
 * cricket series/league similar to Cricbuzz format with multiple tabs
 */
export default function SeriesDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('matches')
  const { data, error, isLoading } = useSWR(`/api/leagues/${params.id}`, fetcher)
  
  // Extract league data from response
  const leagueData: League = data?.data
  
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
  
  const seasonId = leagueData?.currentseason?.id || getLatestSeasonId()
  
  const { data: fixturesData } = useSWR(
    activeTab === 'matches' && params.id ? `/api/leagues/${params.id}/fixtures` : null,
    fetcher
  )
  
  const { data: standingsData } = useSWR(
    activeTab === 'table' && seasonId ? `/api/seasons/${seasonId}/standings` : null,
    fetcher
  )
  
  const { data: teamsData } = useSWR(
    activeTab === 'squads' && seasonId ? `/api/seasons/${seasonId}/teams` : null,
    fetcher
  )
  
  const { data: venuesData } = useSWR(
    activeTab === 'venues' && seasonId ? `/api/seasons/${seasonId}/venues` : null,
    fetcher
  )
  
  const { data: statsData } = useSWR(
    activeTab === 'stats' && seasonId ? `/api/seasons/${seasonId}/stats` : null,
    fetcher
  )

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/series" className="text-blue-600 hover:underline text-sm">
          ← Back to Series
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          Failed to load series details. Please try again later.
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-full mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!leagueData) {
    return (
      <div className="space-y-4">
        <Link href="/series" className="text-blue-600 hover:underline text-sm">
          ← Back to Series
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
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
  
  // Get current season: prefer is_current, then 2025/2026 seasons, then latest season
  const currentSeason = leagueData.currentseason || 
    seasons.find(s => s.is_current === true) ||
    sortedSeasons.find(s => s.name.includes('2025') || s.name.includes('2026')) || 
    sortedSeasons[0] // Latest season
    
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110 group shadow-sm flex-shrink-0"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 text-gray-700 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {leagueData.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
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
          <div className="border-t border-gray-200 -mx-6 px-6 mt-4">
            <div className="flex overflow-x-auto -mx-6 px-6">
              {seriesTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                    // Group matches by date
                    const groupedMatches: { [key: string]: any[] } = {}
                    fixturesData.data?.forEach((match: any) => {
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
                        <div className="bg-blue-50 px-4 py-2 mb-3 rounded">
                          <p className="text-sm font-semibold text-blue-800 uppercase">{date}</p>
                        </div>
                        
                        {/* Matches for this date */}
                        <div className="space-y-3">
                          {matches.map((match: any) => (
                            <Link
                              key={match.id}
                              href={`/match/${match.id}`}
                              className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
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
                              {match.note && (
                                <p className="text-sm text-blue-600 font-medium mt-3">
                                  {match.note}
                                </p>
                              )}
                              {!match.note && match.status && (
                                <p className="text-xs text-gray-500 mt-2 capitalize">
                                  {match.status}
                                </p>
                              )}
                            </Link>
                          ))}
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

          {/* Table Tab */}
          {activeTab === 'table' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Points Table</h2>
              
              {!standingsData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading standings...</p>
                </div>
              ) : standingsData.data?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No standings available for this series</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pos</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">P</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">W</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">L</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {standingsData.data?.map((standing: any, index: number) => (
                        <tr key={standing.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{standing.team?.name || 'Team'}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-600">{standing.played || 0}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-600">{standing.won || 0}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-600">{standing.lost || 0}</td>
                          <td className="px-4 py-3 text-sm text-center font-medium text-gray-900">{standing.points || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
              
              {!statsData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading statistics...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Batting Stats */}
                  {statsData.data?.batting && statsData.data.batting.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Run Scorers</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Player</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Runs</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Innings</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Average</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">SR</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">HS</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">100s</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">50s</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {statsData.data.batting.slice(0, 10).map((stat: any, index: number) => (
                              <tr key={stat.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{stat.player?.fullname || 'Unknown'}</td>
                                <td className="px-4 py-3 text-sm text-center font-medium text-gray-900">{stat.total?.runs || 0}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">{stat.total?.innings || 0}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">{stat.total?.average || '0.00'}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">{stat.total?.strike_rate || '0.00'}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">{stat.total?.highest_score || 0}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">{stat.total?.hundreds || 0}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">{stat.total?.fifties || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Bowling Stats */}
                  {statsData.data?.bowling && statsData.data.bowling.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Wicket Takers</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Player</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Wickets</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Innings</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Average</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Economy</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">SR</th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Best</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {statsData.data.bowling.slice(0, 10).map((stat: any, index: number) => (
                              <tr key={stat.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{stat.player?.fullname || 'Unknown'}</td>
                                <td className="px-4 py-3 text-sm text-center font-medium text-gray-900">{stat.total?.wickets || 0}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">{stat.total?.innings || 0}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">{stat.total?.average || '0.00'}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">{stat.total?.econ || '0.00'}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">{stat.total?.strike_rate || '0.00'}</td>
                                <td className="px-4 py-3 text-sm text-center text-gray-600">{stat.total?.best || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* No Stats Available */}
                  {(!statsData.data?.batting || statsData.data.batting.length === 0) && 
                   (!statsData.data?.bowling || statsData.data.bowling.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-gray-600 font-medium">No statistics available for this series</p>
                      <p className="text-sm text-gray-500 mt-2">Statistics will appear here once matches are completed</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
