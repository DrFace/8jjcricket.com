'use client'

import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import ArchhiveCard from '@/components/ArchhiveCard'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export default function UpcomingPage() {
  const { data, error, isLoading } = useSWR('/api/upcoming', fetcher)

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-gradient-to-br from-slate-900 to-black/80">
        <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-black/70 backdrop-blur-xl px-6 py-5 shadow-2xl">
          <h1 className="text-lg font-semibold text-red-400 mb-1">Failed to load upcoming matches</h1>
          <p className="text-sm text-red-300/80">Please refresh the page or try again later.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-gradient-to-br from-slate-900 to-black/80">
        <div className="text-amber-300">Loading upcoming matches...</div>
      </div>
    )
  }

  const fixtures = data?.data || []

  return (
    <>
      <TopNav />
      <main className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-black/80 pt-4 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 drop-shadow-lg tracking-tight">
              Upcoming Matches
            </h1>
            <Link
              href="/livescore"
              className="text-sm font-medium text-amber-300 hover:text-amber-400 transition"
            >
              ← Back to Live Scores
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fixtures.map((fixture: any) => (
              <div
                key={fixture.id}
                className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-2 shadow-2xl hover:border-amber-400/50 hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)] transition-all"
              >
                <ArchhiveCard f={fixture} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
