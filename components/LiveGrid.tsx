'use client'
import useSWR from 'swr'
import LiveCard from './LiveCard'
import type { Fixture } from '@/types/fixture'  // ✅ from shared types

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function LiveGrid() {
  const { data, error, isLoading } = useSWR('/api/live', fetcher, {
    refreshInterval: 60_000,
    dedupingInterval: 60_000,
    revalidateOnFocus: false,
  })

  if (data?.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
        {data.error}
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

  // 👉 Just layout/styling changed here: each LiveCard in its own card
  return (
    <div className="space-y-3 text-sm">
      {fixtures.map((f) => (
        <div
          key={f.id}
          className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm hover:shadow-md transition"
        >
          <LiveCard f={f} />
        </div>
      ))}
    </div>
  )
}
