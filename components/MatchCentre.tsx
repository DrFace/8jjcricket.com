// components/MatchCentre.tsx
'use client';

import { useState } from 'react';
import LiveGrid from './LiveGrid';
import Link from 'next/link';

export default function MatchCentre() {
    // default selection is International
    const [selected, setSelected] = useState<string>('International');

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
                <div className="px-3 sm:px-4 py-3 sm:py-4">
                    <LiveGrid filter={selected} />
                </div>
            </div>
        </div>
    );
}
