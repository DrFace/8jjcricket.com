'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

import LiveGrid from './LiveGrid';
import BetButton from './BetButton';
import LiveCard from './LiveCard';
import type { Fixture } from '@/types/fixture';

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function MatchCentre() {
    const [selected, setSelected] = useState<string>('All');

    const { data: recentData, error: recentError, isLoading: recentLoading } = useSWR('/api/recent', fetcher);
    const recentFixtures: Fixture[] = recentData?.data ?? [];

    const categories = ['International', 'T20', 'ODI', 'Test', 'Leagues', 'All'];

    return (
        <div className="h-full w-full flex flex-col">
            {/* Header */}
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-lg sm:text-2xl font-extrabold text-white">Match Centre</h1>
                    <p className="mt-1 text-xs sm:text-sm text-sky-100/70">
                        Live scores, upcoming fixtures and recent results.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                        const active = selected === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelected(cat)}
                                className={[
                                    'rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold transition',
                                    'border backdrop-blur',
                                    active
                                        ? 'border-amber-300/60 bg-amber-300/15 text-amber-200 shadow'
                                        : 'border-white/15 bg-white/5 text-sky-100/70 hover:border-amber-300/40 hover:text-sky-100',
                                ].join(' ')}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main card: constrained height + internal scroll */}
            <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-2xl backdrop-blur-2xl">
                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-white/10 bg-black/30 px-4 py-3">
                    <button className="pb-2 text-xs sm:text-sm font-semibold border-b-2 border-amber-300 text-amber-200">
                        Live
                    </button>
                    <Link href="/upcoming" className="pb-2 text-xs sm:text-sm font-semibold text-sky-100/70 hover:text-sky-100">
                        Upcoming
                    </Link>
                    <Link href="/recent" className="pb-2 text-xs sm:text-sm font-semibold text-sky-100/70 hover:text-sky-100">
                        Recent
                    </Link>
                </div>

                {/* Scroll area (THIS fixes “too big for screen”) */}
                <div className="h-full overflow-y-auto px-4 py-4 space-y-5">
                    {/* LIVE */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-sky-100/70">
                                Live Now
                            </h2>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <BetButton />
                            <div className="mt-3">
                                <LiveGrid filter={selected} />
                            </div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-white/10" />

                    {/* RECENT */}
                    <div className="space-y-3 pb-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-sky-100/70">
                                Recent Results
                            </h2>
                            <Link href="/recent" className="text-[11px] sm:text-xs font-semibold text-amber-300 hover:text-amber-200">
                                View all →
                            </Link>
                        </div>

                        {recentError && (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                                Failed to load recent matches.
                            </div>
                        )}

                        {recentLoading && !recentError && (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-4 w-40 rounded bg-white/10" />
                                <div className="space-y-2">
                                    <div className="h-20 rounded bg-white/10" />
                                    <div className="h-20 rounded bg-white/10" />
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
                            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-sky-100/60">
                                No recent matches found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
