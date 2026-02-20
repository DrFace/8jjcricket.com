"use client"

import React, { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import Image from "next/image"
import Link from "next/link"
import SecondaryButton from "@/components/ui/SecondaryButton"

interface SearchResult {
  id: number
  type: "team" | "player" | "series" | "match" | "news"
  title: string
  subtitle?: string
  image?: string
  link: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function UniversalSearchPage() {
  // ✅ Required: wrap the component that uses useSearchParams in Suspense
  return (
    <Suspense fallback={null}>
      <SearchInner />
    </Suspense>
  )
}

function SearchInner() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || ""

  const [query, setQuery] = useState(queryParam)
  const [activeTab, setActiveTab] = useState<
    "all" | "teams" | "players" | "matches" | "series" | "news"
  >("all")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Fetch data for search
  const { data: teamsData } = useSWR("/api/teams", fetcher)
  const { data: playersData } = useSWR("/api/players", fetcher)
  const { data: seriesData } = useSWR("/api/leagues", fetcher)
  const { data: matchesData } = useSWR("/api/live", fetcher)
  const { data: newsData } = useSWR("/api/news", fetcher)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    const searchQuery = query.toLowerCase()
    const allResults: SearchResult[] = []

    // Search Teams
    if (teamsData?.data) {
      const teamResults = teamsData.data
        .filter(
          (team: any) =>
            team.name?.toLowerCase().includes(searchQuery) ||
            team.code?.toLowerCase().includes(searchQuery),
        )
        .map((team: any) => ({
          id: team.id,
          type: "team" as const,
          title: team.name,
          subtitle: team.code,
          image: team.image_path,
          link: `/teams`,
        }))
      allResults.push(...teamResults)
    }

    // Search Players
    if (playersData?.data) {
      const playerResults = playersData.data
        .filter(
          (player: any) =>
            player.fullname?.toLowerCase().includes(searchQuery) ||
            player.firstname?.toLowerCase().includes(searchQuery) ||
            player.lastname?.toLowerCase().includes(searchQuery),
        )
        .map((player: any) => ({
          id: player.id,
          type: "player" as const,
          title: player.fullname || `${player.firstname} ${player.lastname}`,
          subtitle: player.position?.name || "Player",
          image: player.image_path,
          link: `/players/${player.id}`,
        }))
      allResults.push(...playerResults)
    }

    // Search Series
    if (seriesData?.data) {
      const seriesResults = seriesData.data
        .filter((series: any) =>
          series.name?.toLowerCase().includes(searchQuery),
        )
        .map((series: any) => ({
          id: series.id,
          type: "series" as const,
          title: series.name,
          subtitle: "Series",
          link: `/series`,
        }))
      allResults.push(...seriesResults)
    }

    // Search News
    if (newsData?.data) {
      const newsResults = newsData.data
        .filter(
          (news: any) =>
            news.title?.toLowerCase().includes(searchQuery) ||
            news.description?.toLowerCase().includes(searchQuery),
        )
        .map((news: any) => ({
          id: news.id,
          type: "news" as const,
          title: news.title,
          subtitle: news.published_at,
          image: news.image_path,
          link: `/news/${news.slug}`,
        }))
      allResults.push(...newsResults)
    }

    setResults(allResults)
    setIsSearching(false)
  }, [query, teamsData, playersData, seriesData, matchesData, newsData])

  const filteredResults =
    activeTab === "all"
      ? results
      : results.filter((r) => r.type === activeTab.slice(0, -1))

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "team":
        return "🏏"
      case "player":
        return "👤"
      case "series":
        return "🏆"
      case "match":
        return "⚡"
      case "news":
        return "📰"
      default:
        return "🔍"
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Search Bar */}
      <div className="rounded-3xl border border-india-gold/40 bg-gradient-to-br from-india-charcoal via-india-maroon/20 to-india-blue/30 px-6 py-8 md:px-8 md:py-10 shadow-2xl backdrop-blur-xl">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2 india-header-text">
            Universal Search
          </h1>
          <p className="text-center text-xs font-bold tracking-[0.18em] text-india-gold mb-6">
            Find teams, players, series, matches, and news
          </p>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <svg
                className="w-6 h-6 text-india-gold/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams, players, series, matches, news..."
              className="w-full pl-14 pr-6 py-4 text-lg text-white bg-slate-900/60 rounded-xl border-2 border-india-gold/30 focus:border-india-gold focus:ring-4 focus:ring-india-gold/20 outline-none transition-all placeholder:text-sky-100/50 backdrop-blur-md shadow-lg"
              autoFocus
            />
          </div>

          {/* Quick Stats */}
          {query && (
            <div className="mt-4 text-center text-sky-100/80 text-sm">
              Found <span className="font-bold text-india-gold">{results.length}</span>{" "}
              results
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      {query && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["all", "teams", "players", "series", "news"].map((tab) => (
            <SecondaryButton
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              active={activeTab === tab}
              size="sm"
              className="px-5 whitespace-nowrap"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== "all" &&
                ` (${results.filter((r) => r.type === tab.slice(0, -1)).length})`}
            </SecondaryButton>
          ))}
        </div>
      )}

      {/* Search Results */}
      <div>
        {!query ? (
          <div className="text-center py-16 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10">
            <svg
              className="w-20 h-20 text-india-gold/40 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-white text-lg font-bold mb-2">Start typing to search</p>
            <p className="text-sky-100/60 text-sm">
              Search across teams, players, series, matches, and news
            </p>
          </div>
        ) : isSearching ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-900/40 rounded-xl p-4 border border-white/10 backdrop-blur-md animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-5 bg-white/10 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-white/10 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 backdrop-blur-md rounded-3xl border-2 border-dashed border-india-gold/30">
            <svg
              className="w-16 h-16 text-india-gold/40 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-white font-bold text-lg mb-2">No results found</p>
            <p className="text-sky-100/60 text-sm">Try different keywords or check spelling</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResults.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.link}
                className="block bg-slate-900/40 rounded-xl p-4 border border-india-gold/20 hover:border-india-gold hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] transition-all group backdrop-blur-md"
              >
                <div className="flex items-center gap-4">
                  {/* Icon/Image */}
                  {result.image ? (
                    <Image
                      src={result.image}
                      alt={result.title}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover ring-2 ring-white/10"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-india-saffron/20 to-india-gold/20 rounded-lg flex items-center justify-center text-2xl border border-india-gold/20">
                      {getTypeIcon(result.type)}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white group-hover:text-india-gold transition-colors truncate">
                      {result.title}
                    </h3>
                    {result.subtitle && (
                      <p className="text-sm text-sky-100/60 truncate">{result.subtitle}</p>
                    )}
                  </div>

                  {/* Type Badge */}
                  <div className="px-3 py-1 bg-india-gold/10 text-india-gold text-xs font-bold rounded-lg border border-india-gold/20">
                    {result.type}
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-5 h-5 text-sky-100/40 group-hover:text-india-gold group-hover:translate-x-1 transition-all"
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
