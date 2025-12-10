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
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl border border-red-100 bg-red-50 px-6 py-5 shadow-md">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h1 className="text-lg font-semibold text-red-700 mb-1">
                  Failed to load archived matches
                </h1>
                <p className="text-sm text-red-600/80">
                  Please refresh the page or try again in a moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />

        <div className="min-h-[60vh] flex flex-col gap-6">
          {/* Light hero */}
          <div className="rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-sky-50 px-6 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-sky-600">
                  8JJCRICKET · ARCHIVE
                </p>
                <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">
                  Archive
                </h1>
                <p className="mt-2 text-sm md:text-base text-slate-600 max-w-xl">
                  {description}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3 rounded-full border border-sky-200 bg-white px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-xs font-medium text-sky-700">
                  Loading archive…
                </span>
              </div>
            </div>
          </div>

          {/* Skeleton grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm animate-pulse"
              >
                <div className="h-3 w-20 rounded-full bg-sky-100 mb-3" />
                <div className="h-4 w-32 rounded-full bg-sky-100 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-slate-100" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-100" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  const fixtures: Fixture[] = data?.data ?? []

  if (!fixtures.length) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-md">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🏏</div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900 mb-1">
                  No archived matches found
                </h1>
                <p className="text-sm text-slate-600">
                  Once matches are completed, they&apos;ll appear here with full
                  details and results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <div className="space-y-6">
        {/* Light header / hero */}
        <div className="rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-sky-50 px-6 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-sky-600">
                8JJCRICKET · ARCHIVE
              </p>
              <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">
                Archive
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-600 max-w-xl">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-700 shadow-sm">
                <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
                Completed matches
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                🏏 All formats
              </span>
            </div>
          </div>
        </div>

        {/* Archive grid – keep your LiveCard look, no extra dark wrappers */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fixtures.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-sky-100 bg-white p-2 shadow-[0_10px_25px_rgba(15,23,42,0.06)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] transition-shadow"
            >
              <LiveCard f={f} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
