// components/MatchCentre.tsx
'use client';

import { useState } from 'react';
import LiveGrid from './LiveGrid';
import Link from 'next/link';
import BetButton from './BetButton';
import LiveCard from './LiveCard';
import type { Fixture } from '@/types/fixture'
import useSWR from 'swr';

// simple fetcher for SWR
const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function MatchCentre() {
    // default selection is International
    const [selected, setSelected] = useState<string>('All');

    // recent matches (reusing LiveCard, like RecentPage)
    const { data: recentData, error: recentError, isLoading: recentLoading } = useSWR('/api/recent', fetcher);
    const recentFixtures: Fixture[] = recentData?.data ?? [];

    const categories = ['International', 'T20', 'ODI', 'Test', 'Leagues', 'All'];

    return (
        <div className="space-y-4">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Match Centre</h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Live scores, upcoming fixtures and recent results from major tours and leagues.
                    </p>
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelected(cat)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium bg-white ${selected === cat
                                ? 'border-blue-400 text-blue-600'
                                : 'border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                {/* Live / Upcoming / Recent tabs */}
                <div className="flex items-center gap-4 border-b bg-gray-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold">
                    <button className="border-b-2 border-blue-500 pb-1 text-blue-600">Live</button>
                    <Link href="/upcoming" className="pb-1 text-gray-600 hover:text-blue-600">Upcoming</Link>
                    <Link href="/recent" className="pb-1 text-gray-600 hover:text-blue-600">Recent</Link>
                </div>

                {/* Live matches grid */}
                <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-4">

                    {/* LIVE SECTION */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">
                                Live Now
                            </h2>
                        </div>
                        <BetButton />
                        <LiveGrid filter={selected} />
                    </div>

                    {/* NOTICEABLE BREAK */}
                    <div className="border-t border-gray-200" />

                    {/* RECENT SECTION */}
                    <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">
                                Recent Results
                            </h2>
                            <Link
                                href="/recent"
                                className="text-xs font-medium text-blue-600 hover:underline"
                            >
                                View all
                            </Link>
                        </div>

                        {recentError && (
                            <div className="text-xs text-red-500">
                                Failed to load recent matches.
                            </div>
                        )}

                        {recentLoading && !recentError && (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-4 w-32 rounded bg-gray-200" />
                                <div className="space-y-2">
                                    <div className="h-20 rounded bg-gray-200" />
                                    <div className="h-20 rounded bg-gray-200" />
                                </div>
                            </div>
                        )}

                        {!recentLoading && !recentError && recentFixtures.length > 0 && (
                            <div className="space-y-2">
                                {recentFixtures.slice(0, 4).map((f) => (
                                    <LiveCard key={f.id} f={f} />
                                ))}
                            </div>
                        )}

                        {!recentLoading && !recentError && recentFixtures.length === 0 && (
                            <div className="text-xs text-gray-500">
                                No recent matches found.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
