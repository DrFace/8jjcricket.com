'use client'
import useSWR from 'swr'
import LiveCard from './LiveCard'
import type { Fixture } from '@/types/fixture'  // ✅ from shared types

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function LiveGrid() {
  const { data, error, isLoading } = useSWR('/api/live', fetcher, { refreshInterval: 10000 })

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
        Failed to load live scores.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white px-3 py-3 text-sm text-gray-500 animate-pulse">
        Loading live scores…
      </div>
    )
  }

  // /api/live -> { data: { live, upcoming, recent } }
  const fixtures: Fixture[] = data?.data?.live ?? []   // ✅ correct path

  if (!fixtures.length) {
    return (
      <div className="rounded-lg border bg-white px-3 py-3 text-sm text-gray-500">
        No live matches right now.
      </div>
    )
  }

  // List-style layout to match new Match Centre card
  return (
    <div className="divide-y divide-gray-100 text-sm">
      {fixtures.map(f => (
        <LiveCard key={f.id} f={f} />
      ))}
    </div>
  )
}
