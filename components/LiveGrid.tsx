// components/LiveGrid.tsx
'use client';
import useSWR from 'swr';
import LiveCard from './LiveCard';
import type { Fixture } from '@/types/fixture';

interface LiveGridProps {
  filter?: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Helper: filter fixtures by category
function filterFixtures(fixtures: Fixture[], filter: string | undefined): Fixture[] {
  if (!filter || filter === 'All') return fixtures;

  const upper = filter.toUpperCase();

  return fixtures.filter((f) => {
    const round = (f.round || '').toUpperCase();
    const leagueName = (f.league?.name || '').toLowerCase();

    if (upper === 'TEST') return round.includes('TEST');
    if (upper === 'ODI') return round.includes('ODI');
    if (upper === 'T20') return round.includes('T20');
    if (upper === 'LEAGUES') return leagueName.includes('league');
    if (upper === 'INTERNATIONAL') return !leagueName.includes('league');
    return true;
  });
}

export default function LiveGrid({ filter = 'All' }: LiveGridProps) {
  const { data, error, isLoading } = useSWR('/api/live', fetcher, {
    refreshInterval: 60_000,
    dedupingInterval: 60_000,
    revalidateOnFocus: false,
  });

  if (data?.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
        {data.error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white px-3 py-3 text-sm text-gray-500 animate-pulse">
        Loading live scores…
      </div>
    );
  }

  // Get the live fixtures and apply the current filter
  const fixtures: Fixture[] = data?.data?.live ?? [];
  const filtered = filterFixtures(fixtures, filter);

  if (!filtered.length) {
    return (
      <div className="rounded-lg border bg-white px-3 py-3 text-sm text-gray-500">
        No live matches right now.
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm">
      {filtered.map((f) => (
        <LiveCard key={f.id} f={f} />
      ))}
    </div>
  );
}
