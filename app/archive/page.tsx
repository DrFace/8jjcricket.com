"use client"

import useSWR from 'swr'
import type { Fixture } from '@/types/fixture'
import LiveCard from '@/components/LiveCard'

// Simple fetcher for SWR; fetches JSON from the given URL.
const fetcher = (u: string) => fetch(u).then((r) => r.json())

/**
 * Archive page
 *
 * This page displays a list of recent fixtures as an archive. It reuses the
 * existing `/api/recent` endpoint to fetch match data and renders it using the
 * LiveCard component. If you have a dedicated archive endpoint in the future,
 * simply update the SWR key below.
 */
export default function ArchivePage() {
  const { data, error, isLoading } = useSWR('/api/recent', fetcher)

  if (error) {
    return <div className="card">Failed to load archived matches.</div>
  }
  if (isLoading) {
    return <div className="card animate-pulse">Loading archive…</div>
  }

  const fixtures: Fixture[] = data?.data ?? []

  if (!fixtures.length) {
    return <div className="card">No archived matches found.</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Archive</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fixtures.map((f) => (
          <LiveCard key={f.id} f={f} />
        ))}
      </div>
    </div>
  )
}