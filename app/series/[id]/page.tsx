"use client"

import { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'

interface Season {
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
  { id: 'home', label: 'Home' },
  { id: 'matches', label: 'Matches' },
  { id: 'news', label: 'News' },
  { id: 'videos', label: 'Videos' },
  { id: 'table', label: 'Table' },
  { id: 'squads', label: 'Squads' },
  { id: 'photos', label: 'Photos' },
  { id: 'stats', label: 'Stats' },
  { id: 'venues', label: 'Venues' },
]

/**
 * SeriesDetailPage displays comprehensive information about a specific
 * cricket series/league similar to Cricbuzz format with multiple tabs
 */
export default function SeriesDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('home')
  const { data, error, isLoading } = useSWR(`/api/leagues/${params.id}`, fetcher)
  
  // Fetch additional data based on active tab
  const league: League = data?.data
  const seasonId = league?.currentseason?.id || league?.seasons?.[0]?.id
  
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

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/series" className="text-green-600 hover:underline text-sm">
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

  if (!league) {
    return (
      <div className="space-y-4">
        <Link href="/series" className="text-green-600 hover:underline text-sm">
          ← Back to Series
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          Series not found.
        </div>
      </div>
    )
  }

  const seasons = league.seasons || []
  const currentSeason = league.currentseason || seasons.find(s => s.name.includes('2025')) || seasons[0]
  const title = `${league.name} | 8jjcricket`
  const description = `View matches, news, stats and information about ${league.name}`

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
            {league.image_path && (
              <Image
                src={league.image_path}
                alt={league.name}
                width={60}
                height={60}
                className="object-contain"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {league.name}
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
                      ? 'border-green-600 text-green-600'
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
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Series Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Competition Type</p>
                    <p className="text-lg font-medium text-gray-900 capitalize">{league.type}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Series Code</p>
                    <p className="text-lg font-medium text-gray-900 uppercase">{league.code}</p>
                  </div>
                  {league.country && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Country</p>
                      <p className="text-lg font-medium text-gray-900">{league.country.name}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Seasons</p>
                    <p className="text-lg font-medium text-gray-900">{seasons.length}</p>
                  </div>
                </div>
              </div>

              {currentSeason && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Season</h2>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-lg font-medium text-gray-900 mb-2">{currentSeason.name}</p>
                    <p className="text-sm text-gray-600">{dateRange}</p>
                  </div>
                </div>
              )}

              {seasons.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">All Seasons</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {seasons.slice(0, 9).map((season) => (
                      <div
                        key={season.id}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                      >
                        <p className="font-medium text-gray-900">{season.name}</p>
                        {season.id === currentSeason?.id && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Current
                          </span>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Matches</h2>
              
              {!fixturesData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading matches...</p>
                </div>
              ) : fixturesData.data?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No matches available for this series</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fixturesData.data?.slice(0, 10).map((match: any) => (
                    <Link
                      key={match.id}
                      href={`/match/${match.id}`}
                      className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">
                            {match.stage?.name || 'Match'} • {match.venue?.name || 'Venue TBD'}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {match.localteam?.name || 'Team 1'}
                              </span>
                              {match.runs && <span className="text-gray-600">{match.runs[0]?.score || ''}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {match.visitorteam?.name || 'Team 2'}
                              </span>
                              {match.runs && <span className="text-gray-600">{match.runs[1]?.score || ''}</span>}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 capitalize">{match.status || 'Scheduled'}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
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
                  Latest news, updates and articles about {league.name}
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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

          {/* Other Tabs (Videos, Photos, Stats) */}
          {['videos', 'photos', 'stats'].includes(activeTab) && (
            <div className="p-6">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 capitalize">{activeTab}</h3>
                <p className="text-gray-600">
                  {activeTab === 'videos' && `Watch videos and highlights from ${league.name}`}
                  {activeTab === 'photos' && `Browse photo galleries from the series`}
                  {activeTab === 'stats' && `Explore detailed statistics and records`}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  This section will be available soon
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
