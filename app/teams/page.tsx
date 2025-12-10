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
  
  const title = 'Cricket Teams - All International & Domestic Teams | 8jjcricket'
  const description = 'Explore cricket teams from around the world. Filter by series and leagues including ODI, T20I, Test, IPL, and more. View international and domestic cricket teams.'
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
      <div className="space-y-8">
        {/* Header Section with Gradient Background */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title and Back Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-11 h-11 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 group shadow-lg"
                aria-label="Go back"
              >
                <svg className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Cricket Teams</h1>
                <p className="text-green-50 text-sm md:text-base mt-1 font-medium">Browse teams by series and leagues</p>
              </div>
            </div>
            
            {/* Modern Series/League Dropdown */}
            <div className="w-full lg:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <select
                  id="league-select"
                  value={selectedLeague}
                  onChange={(e) => setSelectedLeague(e.target.value)}
                  className="w-full lg:w-80 pl-12 pr-10 py-3.5 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-xl shadow-lg text-gray-800 font-medium text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-white transition-all duration-200 cursor-pointer hover:bg-white appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="all">🌍 All Teams</option>
                  <option disabled>─────────────────</option>
                  {leagues.map((league) => {
                    const seasonId = getLatestSeasonId(league)
                    return seasonId ? (
                      <option key={league.id} value={seasonId}>
                        🏆 {league.name}
                      </option>
                    ) : null
                  })}
                </select>
              </div>
              <div className="flex items-center gap-2 mt-2 ml-1">
                <div className={`w-2 h-2 rounded-full ${selectedLeague === 'all' ? 'bg-yellow-300' : 'bg-green-300'} animate-pulse`}></div>
                <p className="text-green-50/90 text-xs font-medium">
                  {selectedLeague === 'all' ? 'Showing all teams' : 'Filtered by selected series'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Display */}
        {teams.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center shadow-inner">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-700 font-semibold text-lg">No teams found for this selection</p>
            <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">Try selecting a different series or league from the dropdown above</p>
          </div>
        ) : (
          <>
        {/* International teams */}
        {/* International teams */}
        {national.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">International Teams</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                {national.length}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {national.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                >
                  <Image
                    src={t.image_path}
                    alt={t.name}
                    width={32}
                    height={32}
                    className="object-contain rounded-full"
                  />
                    <span className="font-semibold text-gray-900">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Domestic teams */}
        {domesticLimited.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Domestic Teams</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                {domesticLimited.length}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4 bg-gray-50 border-l-4 border-gray-300 pl-4 py-2 rounded">
              📋 Showing top {domesticLimited.length} domestic teams. Many more available via API.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {domesticLimited.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                >
                  <Image
                    src={t.image_path}
                    alt={t.name}
                    width={28}
                    height={28}
                    className="object-contain rounded-full"
                  />
                  <span className="font-semibold text-gray-900 truncate">{t.name}</span>
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