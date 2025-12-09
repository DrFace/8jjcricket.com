"use client"

import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'

interface Season {
  id: number
  name: string
  league_id: number
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

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/**
 * SeriesDetailPage displays comprehensive information about a specific
 * cricket series/league including all seasons, current season, and statistics.
 */
export default function SeriesDetailPage({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR(`/api/leagues/${params.id}`, fetcher)

  if (error) {
    return (
      <div className="space-y-8">
        <Link href="/series" className="text-blue-600 hover:underline text-sm">
          ← Back to Series
        </Link>
        <div className="card bg-red-50 border-red-200">
          Failed to load series details. Please try again later.
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const league: League = data?.data

  if (!league) {
    return (
      <div className="space-y-8">
        <Link href="/series" className="text-blue-600 hover:underline text-sm">
          ← Back to Series
        </Link>
        <div className="card">Series not found.</div>
      </div>
    )
  }

  const seasons = league.seasons || []
  const title = `${league.name} - Series Details | 8jjcricket`
  const description = `View all seasons, statistics, and information about ${league.name}`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      <div className="space-y-8">
        {/* Back Button */}
        <Link href="/series" className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1">
          ← Back to Series
        </Link>

        {/* Series Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <div className="flex items-start gap-6">
            {league.image_path && (
              <Image
                src={league.image_path}
                alt={league.name}
                width={80}
                height={80}
                className="object-contain"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{league.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <span className="font-medium">Code:</span>
                  <span className="uppercase">{league.code}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="font-medium">Type:</span>
                  <span className="capitalize">{league.type}</span>
                </span>
                {league.country && (
                  <span className="inline-flex items-center gap-2">
                    <span className="font-medium">Country:</span>
                    <span className="flex items-center gap-1">
                      {league.country.image_path && (
                        <Image
                          src={league.country.image_path}
                          alt={league.country.name}
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                      )}
                      {league.country.name}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Season */}
        {league.currentseason && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Current Season</h2>
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <p className="text-lg font-medium text-gray-800">{league.currentseason.name}</p>
              <p className="text-sm text-gray-600 mt-1">Season ID: {league.currentseason.id}</p>
            </div>
          </div>
        )}

        {/* All Seasons */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            All Seasons ({seasons.length})
          </h2>
          
          {seasons.length === 0 ? (
            <p className="text-gray-600">No seasons available for this series.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {seasons.map((season) => (
                <div
                  key={season.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <p className="font-semibold text-gray-800 mb-2">{season.name}</p>
                  <p className="text-xs text-gray-500">Season ID: {season.id}</p>
                  {season.id === league.currentseason?.id && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{seasons.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Seasons</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <p className="text-3xl font-bold text-green-600 uppercase">{league.code}</p>
            <p className="text-sm text-gray-600 mt-1">Series Code</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <p className="text-3xl font-bold text-purple-600 capitalize">{league.type}</p>
            <p className="text-sm text-gray-600 mt-1">Competition Type</p>
          </div>
        </div>
      </div>
    </>
  )
}
