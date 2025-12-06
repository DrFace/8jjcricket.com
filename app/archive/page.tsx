"use client"

import useSWR from 'swr'
import type { Fixture } from '@/types/fixture'
import LiveCard from '@/components/LiveCard'

// Simple fetcher for SWR; fetches JSON from the given URL.
const fetcher = (u: string) => fetch(u).then((r) => r.json())

/**
 * ArchivePage displays a list of archived cricket fixtures. It provides
 * consistent light-themed styling and in-line `<title>`/`<meta>` tags for SEO.
 */
export default function ArchivePage() {
  const { data, error, isLoading } = useSWR('/api/recent', fetcher)
  const title = 'Match Archive | 8jjcricket'
  const description = 'Browse archived cricket matches with results and details.'
  if (error) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">Failed to load archived matches.</div>
      </>
    )
  }
  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card animate-pulse">Loading archive…</div>
      </>
    )
  }
  const fixtures: Fixture[] = data?.data ?? []
  if (!fixtures.length) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">No archived matches found.</div>
      </>
    )
  }
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold mb-4">Archive</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fixtures.map((f) => (
            <LiveCard key={f.id} f={f} />
          ))}
        </div>
      </div>
    </>
  )
}