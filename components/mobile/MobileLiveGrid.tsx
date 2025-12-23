"use client";

import useSWR from "swr";
import type { Fixture } from "@/types/fixture";
import MobileLiveCard from "./MobileLiveCard";

interface LiveGridProps {
  filter?: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function filterFixtures(
  fixtures: Fixture[],
  filter: string | undefined
): Fixture[] {
  if (!filter || filter === "All") return fixtures;

  const upper = filter.toUpperCase();

  return fixtures.filter((f) => {
    const round = (f.round || "").toUpperCase();
    const leagueName = (f.league?.name || "").toLowerCase();

    if (upper === "TEST") return round.includes("TEST");
    if (upper === "ODI") return round.includes("ODI");
    if (upper === "T20") return round.includes("T20");
    if (upper === "LEAGUES") return leagueName.includes("league");
    if (upper === "INTERNATIONAL") return !leagueName.includes("league");
    return true;
  });
}

export default function MobileLiveGrid({ filter = "All" }: LiveGridProps) {
  const { data, isLoading } = useSWR("/api/live", fetcher, {
    refreshInterval: 60_000,
    dedupingInterval: 60_000,
    revalidateOnFocus: false,
  });

  if (data?.error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-3 text-xs text-red-200">
        {data.error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-sky-100/60 animate-pulse">
        Loading live scores…
      </div>
    );
  }

  const fixtures: Fixture[] = data?.data?.live ?? [];
  const filtered = filterFixtures(fixtures, filter);

  if (!filtered.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-sky-100/60">
        No live matches right now.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((f) => (
        <MobileLiveCard key={f.id} f={f} />
      ))}
    </div>
  );
}
