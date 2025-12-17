"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'

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
 * Users can select a specific league to view only related teams.
 * Supports auto-selection via URL parameter: /teams?league={leagueId}
 */
export default function TeamsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const leagueParam = searchParams.get('league')
  
  const [selectedLeague, setSelectedLeague] = useState<string>('all')
  
  // Auto-select league from URL parameter
  useEffect(() => {
    if (leagueParam && leagueParam !== 'null' && leagueParam !== 'undefined') {
      console.log('Setting selected league from URL:', leagueParam)
      setSelectedLeague(leagueParam)
    } else if (leagueParam === 'null' || leagueParam === 'undefined') {
      console.warn('Invalid league ID in URL, falling back to all teams')
      setSelectedLeague('all')
    }
  }, [leagueParam])
  
  // Fetch all leagues for the dropdown (with seasons included)
  const { data: leaguesData, isLoading: leaguesLoading } = useSWR('/api/leagues', fetcher)
  const leagues: League[] = leaguesData?.data ?? []
  
  // Always fetch all teams (API doesn't support filtering by league)
  const { data: teamsData, error: teamsError, isLoading: teamsLoading } = useSWR('/api/teams', fetcher, {
    revalidateOnFocus: false,
  })
  
  // Fetch fixtures for selected league to filter teams
  const isValidSelection = selectedLeague && selectedLeague !== 'null' && selectedLeague !== 'undefined' && selectedLeague !== 'all'
  const fixturesUrl = isValidSelection ? `/api/leagues/${selectedLeague}/fixtures` : null
  const { data: fixturesData } = useSWR(fixturesUrl, fetcher, {
    revalidateOnFocus: false,
  })
  
  // Filter teams based on league fixtures
  const allTeams: TeamFromAPI[] = teamsData?.data ?? []
  let teams: TeamFromAPI[] = allTeams
  
  if (isValidSelection && fixturesData?.data) {
    // Get unique team IDs from fixtures
    const teamIdsInLeague = new Set<number>()
    fixturesData.data.forEach((fixture: any) => {
      if (fixture.localteam_id) teamIdsInLeague.add(fixture.localteam_id)
      if (fixture.visitorteam_id) teamIdsInLeague.add(fixture.visitorteam_id)
    })
    // Filter teams that participated in this league
    teams = allTeams.filter(team => teamIdsInLeague.has(team.id))
  }
  
  const data = { data: teams }
  const error = teamsError
  const isLoading = teamsLoading
  
  const title = 'Cricket Teams - All International & Domestic Teams | 8jjcricket'
  const description = 'Explore cricket teams from around the world. Filter by series and leagues including ODI, T20I, Test, IPL, and more. View international and domestic cricket teams.'
  
  // Debug logging
  useEffect(() => {
    console.log('🏏 Teams Page Debug:', {
      leagueParam,
      selectedLeague,
      isValidSelection,
      fixturesUrl,
      allTeamsCount: allTeams.length,
      filteredTeamsCount: teams.length,
      isLoading,
      hasData: teams.length > 0,
      hasError: !!error,
      hasFixturesData: !!fixturesData?.data
    })
    
    if (teams.length > 0) {
      console.log('📊 Sample team data:', teams[0])
    }
  }, [leagueParam, selectedLeague, isValidSelection, fixturesUrl, allTeams.length, teams.length, error, isLoading, fixturesData])
  
  if (error && selectedLeague === 'all') {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-xl p-8 shadow-2xl">
          <p className="text-red-300 font-medium">Failed to load teams. Please try again later.</p>
        </div>
      </>
    )
  }
  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="space-y-6">
          <div className="h-24 bg-slate-900/80 border border-white/20 rounded-3xl animate-pulse backdrop-blur-xl"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-900/80 border border-white/20 rounded-2xl animate-pulse backdrop-blur-xl"></div>
            ))}
          </div>
        </div>
      </>
    )
  }
  
  const national = teams.filter((t) => t.national_team)
  const domestic = teams.filter((t) => !t.national_team)
  const domesticLimited = domestic.slice(0, 30)

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="space-y-6 pb-8">
        {/* Header Section with Dark Theme */}
        <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title and Back Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-10 h-10 bg-black/40 hover:bg-amber-950/60 border border-amber-400/30 rounded-full transition-all duration-300 hover:scale-110 group shadow-lg backdrop-blur-sm flex-shrink-0"
                aria-label="Go back"
              >
                <svg className="w-5 h-5 text-amber-300 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-300 mb-1">
                  8JJCRICKET · TEAMS
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Cricket Teams</h1>
                <p className="text-sky-100/80 text-sm md:text-base mt-1">Browse teams by series and leagues</p>
              </div>
            </div>
            
            {/* Series/League Dropdown */}
            <div className="w-full lg:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="w-5 h-5 text-amber-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <select
                  id="league-select"
                  value={selectedLeague}
                  onChange={(e) => {
                    const value = e.target.value
                    setSelectedLeague(value)
                    // Update URL to maintain state on refresh and enable back/forward navigation
                    if (value === 'all') {
                      router.push('/teams')
                    } else {
                      router.push(`/teams?league=${value}`)
                    }
                  }}
                  className="w-full lg:w-80 pl-12 pr-10 py-3.5 bg-black/40 border border-white/20 rounded-xl shadow-sm text-amber-200 font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-200 cursor-pointer hover:bg-black/60 backdrop-blur-sm appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="all" className="bg-slate-900">All Teams - All Series/Leagues</option>
                  <option disabled className="bg-slate-900">────────────────────────────</option>
                  {leagues.map((league) => (
                    <option key={league.id} value={league.id} className="bg-slate-900">
                      {league.name} - {league.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 mt-2 ml-1">
                <div className={`w-2 h-2 rounded-full ${selectedLeague === 'all' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></div>
                <p className="text-amber-200/80 text-xs font-medium">
                  {selectedLeague === 'all' ? 'Showing all teams' : 'Filtered by selected series'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Display */}
        {teams.length === 0 && selectedLeague !== 'all' ? (
          <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-slate-900/90 via-amber-900/10 to-orange-900/20 backdrop-blur-xl p-12 text-center shadow-2xl">
            <svg className="w-20 h-20 text-amber-300/70 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-2xl font-bold text-white mb-3">No Teams Data Available</p>
            <p className="text-base text-sky-100/90 mb-2">This league doesn't have team roster data in our system yet.</p>
            <p className="text-sm text-amber-200/70 mb-6">
              💡 Teams are usually added closer to the tournament start date
            </p>
            <button
              onClick={() => setSelectedLeague('all')}
              className="px-6 py-3 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:brightness-110 hover:scale-105 transition-all duration-200 shadow-xl"
            >
              View All Cricket Teams Instead
            </button>
          </div>
        ) : teams.length > 0 ? (
          <>
        {/* International teams */}
        {national.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-amber-300">International Teams</h2>
              <span className="px-3 py-1.5 bg-gradient-to-r from-amber-300/20 via-yellow-400/20 to-orange-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/40 shadow-lg">
                {national.length}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {national.map((t) => (
                <Link
                  key={t.id}
                  href={`/teams/${t.id}`}
                  className="flex items-center gap-3 rounded-xl border border-amber-400/30 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl p-3.5 shadow-xl hover:shadow-[0_10px_40px_rgba(251,191,36,0.25)] hover:border-amber-400/60 transition-all duration-300 cursor-pointer hover:-translate-y-1 group"
                >
                  <Image
                    src={t.image_path}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="object-contain rounded-full ring-2 ring-amber-400/40 group-hover:ring-amber-400/70 transition-all"
                  />
                  <span className="font-semibold text-white group-hover:text-amber-200 transition-colors">{t.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* Domestic teams */}
        {domesticLimited.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-amber-300">Domestic Teams</h2>
              <span className="px-3 py-1.5 bg-gradient-to-r from-amber-300/20 via-yellow-400/20 to-orange-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/40 shadow-lg">
                {domesticLimited.length}
              </span>
            </div>
            <p className="text-sm text-sky-100/70 mb-5 bg-black/30 border-l-4 border-amber-400/50 pl-4 py-2.5 rounded backdrop-blur-sm">
              📋 Showing top {domesticLimited.length} domestic teams. Many more available via API.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {domesticLimited.map((t) => (
                <Link
                  key={t.id}
                  href={`/teams/${t.id}`}
                  className="flex items-center gap-3 rounded-xl border border-white/20 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 backdrop-blur-xl p-3 shadow-lg hover:shadow-[0_8px_30px_rgba(251,191,36,0.2)] hover:border-amber-400/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 group"
                >
                  <Image
                    src={t.image_path}
                    alt={t.name}
                    width={36}
                    height={36}
                    className="object-contain rounded-full ring-2 ring-white/20 group-hover:ring-amber-400/50 transition-all"
                  />
                  <span className="font-semibold text-white truncate group-hover:text-amber-200 transition-colors text-sm">{t.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
          </>
        ) : null}
      </div>
    </>
  )
}