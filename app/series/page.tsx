"use client"

import useSWR from 'swr'
import Image from 'next/image'

interface League {
  id: number
  name: string
  code: string
  image_path: string
  type: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SeriesPage() {
  const { data, error, isLoading } = useSWR('/api/leagues', fetcher)

  if (error) {
    return <div className="card">Failed to load series.</div>
  }
  if (isLoading) {
    return <div className="card animate-pulse">Loading series…</div>
  }
  const leagues: League[] = data?.data ?? []
  // Filter to show only a handful of notable leagues. We'll prioritise leagues
  // marked as "league" type and include a few international tournaments.
  const notable = leagues
    .filter((l) => l.type === 'league' || l.code.match(/IPL|BBL|PSL|BPL|T20I|ODI|TEST|WC|AC/i))
    .slice(0, 18)

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold mb-4">Series &amp; Leagues</h1>
      <p className="text-sm text-gray-600">Explore major cricket leagues and tournaments.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {notable.map((l) => (
          <div
            key={l.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <Image
              src={l.image_path}
              alt={l.name}
              width={48}
              height={48}
              className="object-contain mb-2"
            />
            <span className="font-medium text-gray-800 truncate w-full" title={l.name}>
              {l.name}
            </span>
            <span className="text-xs text-gray-500 mt-0.5 uppercase">{l.code}</span>
          </div>
        ))}
      </div>
    </div>
  )
}