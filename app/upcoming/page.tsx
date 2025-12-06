'use client'
import useSWR from 'swr'
import TeamBadge from '@/components/TeamBadge'
import { formatDate } from '@/lib/utils'
import type { Fixture } from '@/types/fixture'

const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function UpcomingPage() {
    const { data, error, isLoading } = useSWR('/api/upcoming', fetcher)

    if (error) return <div className="card">Failed to load upcoming fixtures.</div>
    if (isLoading) return <div className="card animate-pulse">Loading upcoming matches…</div>

    const fixtures: Fixture[] = data?.data ?? []

    if (!fixtures.length) return <div className="card">No upcoming matches right now.</div>

    return (
        <div className="space-y-4">

            {/* Heading + Button */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Upcoming Matches</h1>

                <a
                    href="/recent"
                    className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Recent Matches
                </a>
                <a
                    href="/"
                    className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Live  Matches
                </a>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fixtures.map(f => <FixtureCard key={f.id} f={f} />)}
            </div>
        </div>
    )
}

function FixtureCard({ f }: { f: Fixture }) {
    if (!f) return null

    const home = f.localteam
    const away = f.visitorteam

    return (
        <div className="card">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h3 className="font-semibold">
                        {(home?.short_name || home?.name || `Team ${f.localteam_id}`)} vs{' '}
                        {(away?.short_name || away?.name || `Team ${f.visitorteam_id}`)}
                    </h3>
                    <p className="text-sm text-gray-600">{f.round ?? 'Match'}</p>
                    <p className="text-xs text-gray-500">{formatDate(f.starting_at)}</p>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-5 items-center gap-2">
                <TeamBadge team={home} className="col-span-2" />
                <div className="text-center text-xs text-gray-500">vs</div>
                <TeamBadge team={away} className="col-span-2 justify-self-end text-right" />
            </div>
        </div>
    )
}
