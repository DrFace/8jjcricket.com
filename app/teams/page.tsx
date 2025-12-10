"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import Image from 'next/image'

interface TeamFromAPI {
  id: number
  name: string
  code: string
  image_path: string
  country_id: number
  national_team: boolean
}

interface League {
  id: number
  name: string
  code: string
  seasons?: Array<{
    id: number
    name: string
    is_current?: boolean
    starting_at?: string
  }>
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/**
 * TeamsPage lists cricket teams filtered by Series/League selection.
 * Users can select a specific series to view only related teams.
 * Supports auto-selection via URL parameter: /teams?series={seasonId}
 */
export default function TeamsPage() {
  const searchParams = useSearchParams()
  const seriesParam = searchParams.get('series')
  
  const [selectedLeague, setSelectedLeague] = useState<string>('all')
  
  // Auto-select series from URL parameter
  useEffect(() => {
    if (seriesParam) {
      setSelectedLeague(seriesParam)
    }
  }, [seriesParam])
  
  // Fetch all leagues for the dropdown (with seasons included)
  const { data: leaguesData, isLoading: leaguesLoading } = useSWR('/api/leagues', fetcher)
  const leagues: League[] = leaguesData?.data ?? []
  
  // Fetch teams based on selected league
  const teamsUrl = selectedLeague === 'all' 
    ? '/api/teams' 
    : `/api/seasons/${selectedLeague}/teams`
  
  const { data, error, isLoading } = useSWR(teamsUrl, fetcher)
  
  const title = 'Cricket Teams | 8jjcricket'
  const description = 'Browse cricket teams by series and leagues, including international and domestic teams.'
  if (error) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">Failed to load teams.</div>
      </>
    )
  }
  if (isLoading || leaguesLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </>
    )
  }
  
  const teams: TeamFromAPI[] = data?.data ?? []
  const national = teams.filter((t) => t.national_team)
  const domestic = teams.filter((t) => !t.national_team)
  const domesticLimited = domestic.slice(0, 30)
  
  // Get the latest season ID for each league
  const getLatestSeasonId = (league: any) => {
    if (!league.seasons?.length) return null
    const sorted = [...league.seasons].sort((a: any, b: any) => {
      const getYear = (name: string) => {
        const years = name.match(/\d{4}/g)
        return years ? Math.max(...years.map(y => parseInt(y))) : 0
      }
      return getYear(b.name) - getYear(a.name)
    })
    return sorted[0]?.id
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="space-y-6">
        {/* Header with Series/League Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Cricket Teams</h1>
          
          {/* Series/League Dropdown */}
          <div className="w-full sm:w-auto">
            <label htmlFor="league-select" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Series/League
            </label>
            <select
              id="league-select"
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
            >
              <option value="all">All Teams</option>
              {leagues.map((league) => {
                const seasonId = getLatestSeasonId(league)
                return seasonId ? (
                  <option key={league.id} value={seasonId}>
                    {league.name}
                  </option>
                ) : null
              })}
            </select>
          </div>
        </div>

        {/* Teams Display */}
        {teams.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600 font-medium">No teams found for this selection</p>
            <p className="text-sm text-gray-500 mt-2">Try selecting a different series or league</p>
          </div>
        ) : (
          <>
        {/* International teams */}
        {/* International teams */}
        {national.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">International Teams</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {national.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src={t.image_path}
                    alt={t.name}
                    width={32}
                    height={32}
                    className="object-contain rounded-full"
                  />
                    <span className="font-medium text-gray-800">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Domestic teams */}
        {domesticLimited.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Domestic Teams</h2>
            <p className="text-sm text-gray-500 mb-2">
              Showing a selection of domestic teams. There are many more available via the API.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {domesticLimited.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src={t.image_path}
                    alt={t.name}
                    width={28}
                    height={28}
                    className="object-contain rounded-full"
                  />
                  <span className="font-medium text-gray-800 truncate">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </>
  )
}