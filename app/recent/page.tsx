'use client'
import useSWR from 'swr'
import type { Fixture } from '@/types/fixture'
import LiveCard from '@/components/LiveCard'

const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function RecentPage() {
    const { data, error, isLoading } = useSWR('/api/recent', fetcher)

    if (error) return <div className="card">Failed to load recent matches.</div>
    if (isLoading) return <div className="card animate-pulse">Loading recent matches…</div>

    const fixtures: Fixture[] = data?.data ?? []
    if (!fixtures.length) return <div className="card">No recent matches found.</div>

    return (
        <div className="space-y-4">

            {/* Heading + Button */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Recent Matches</h1>

                <a
                    href="/upcoming"
                    className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Upcoming Matches
                </a>
                <a
                    href="/"
                    className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Live  Matches
                </a>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fixtures.map(f => (
                    <LiveCard key={f.id} f={f} />
                ))}
            </div>
        </div>
    )
}
