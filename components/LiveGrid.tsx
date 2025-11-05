'use client'
import useSWR from 'swr'
import LiveCard from './LiveCard'
import type { Fixture } from '@/types/fixture'  // ✅ from shared types

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function LiveGrid() {
  const { data, error, isLoading } = useSWR('/api/live', fetcher, { refreshInterval: 10000 })

  if (error) return <div className="card">Failed to load live scores.</div>
  if (isLoading) return <div className="card animate-pulse">Loading live scores…</div>

  // /api/live -> { data: { live, upcoming, recent } }
  const fixtures: Fixture[] = data?.data?.live ?? []   // ✅ correct path

  if (!fixtures.length) return <div className="card">No live matches right now.</div>

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {fixtures.map(f => <LiveCard key={f.id} f={f} />)}
    </div>
  )
}
