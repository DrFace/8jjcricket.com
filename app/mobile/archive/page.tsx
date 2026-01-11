"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import type { Match } from "@/lib/cricket-types";
import CalenderModal from "@/components/mobile/CalenderModal";
import BottomNav from "@/components/BottomNav";
import MobileArchhiveCard from "@/components/mobile/MobileArchhiveCard";

// Simple fetcher for SWR; fetches JSON from the given URL.
const fetcher = (u: string) => fetch(u).then((r) => r.json());

/**
 * ArchivePage displays a list of archived cricket fixtures. It provides
 * consistent light-themed styling and in-line `<title>`/`<meta>` tags for SEO.
 */
export default function ArchivePage() {
  const { data, error, isLoading } = useSWR("/api/recent", fetcher);
  const title = "Match Archive | 8jjcricket";
  const description =
    "Browse archived cricket matches with results and details.";

  const fixtures: Match[] = data?.data ?? [];

  // Calendar / date filter state and derived data
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const sortedFixtures = useMemo(
    () =>
      [...fixtures].sort(
        (a, b) =>
          new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime()
      ),
    [fixtures]
  );

  const minDate =
    sortedFixtures.length > 0
      ? sortedFixtures[0].starting_at.slice(0, 10)
      : undefined;
  const maxDate =
    sortedFixtures.length > 0
      ? sortedFixtures[sortedFixtures.length - 1].starting_at.slice(0, 10)
      : undefined;

  const filteredFixtures = useMemo(() => {
    if (!selectedDate) return sortedFixtures;
    return sortedFixtures.filter(
      (f) => f.starting_at.slice(0, 10) === selectedDate
    );
  }, [sortedFixtures, selectedDate]);

  if (error) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="min-h-[60vh] flex items-center justify-center m-1">
          <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-black/70 backdrop-blur-xl px-6 py-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h1 className="text-lg font-semibold text-red-400 mb-1">
                  Failed to load archived matches
                </h1>
                <p className="text-sm text-red-300/80">
                  Please refresh the page or try again in a moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />

        <div className="min-h-[60vh] flex flex-col gap-6 m-1">
          {/* Dark hero */}
          <div className="rounded-3xl border border-white/80 bg-slate-900/80 px-6 py-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-300">
                  8JJCRICKET · ARCHIVE
                </p>
                <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white">
                  Archive
                </h1>
                <p className="mt-2 text-sm md:text-base text-sky-100/80 max-w-xl">
                  {description}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-medium text-amber-200">
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
                className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-4 shadow-2xl animate-pulse"
              >
                <div className="h-3 w-20 rounded-full bg-amber-900/40 mb-3" />
                <div className="h-4 w-32 rounded-full bg-amber-900/40 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-slate-800/50" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-800/50" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-800/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (!fixtures.length) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl px-6 py-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🏏</div>
              <div>
                <h1 className="text-lg font-semibold text-amber-200 mb-1">
                  No archived matches found
                </h1>
                <p className="text-sm text-sky-100/80">
                  Once matches are completed, they&apos;ll appear here with full
                  details and results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <div className="flex flex-col-reverse gap-6 lg:flex-row m-1">
        {/* LEFT: existing archive header + grid */}
        <main className="flex-1 space-y-6">
          {/* Dark header / hero */}

          <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-400">
                  8JJCRICKET · ARCHIVE
                </p>
                <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white">
                  Archive
                </h1>
                <p className="mt-2 text-sm md:text-base text-sky-100/90 max-w-xl">
                  {description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-950/40 backdrop-blur-sm px-3 py-1 text-xs font-medium text-emerald-300 shadow-sm">
                  <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Completed matches
                </span>
                <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-950/40 backdrop-blur-sm px-3 py-1 text-xs font-medium text-amber-300 shadow-sm">
                  🏏 All formats
                </span>
              </div>
            </div>
          </div>

          {/* Archive grid with dark glassmorphism */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredFixtures.map((f) => (
              <div
                key={f.id}
                className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-2 shadow-2xl hover:border-amber-400/50 hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)] transition-all"
              >
                <MobileArchhiveCard f={f} />
              </div>
            ))}
          </div>
        </main>

        {/* RIGHT: calendar / date filter with bet button */}
        <aside className="lg:w-72">
          <div>
            {data ? (
              <CalenderModal
                fixtures={fixtures}
                setParentSelectedDate={setSelectedDate}
              />
            ) : null}
          </div>
        </aside>
        {/* BottomNav */}
        <div className="w-full max-w-none">
          <BottomNav />
        </div>
      </div>
    </>
  );
}
