"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import type { Fixture } from "@/types/fixture";
import BetButton from "@/components/BetButton";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import CalenderModal from "@/components/mobile/CalenderModal";
import MobileLiveCard from "@/components/mobile/MobileLiveCard";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

/**
 * RecentPage lists recently completed matches. It adds page-specific
 * `<title>` and `<meta>` tags for SEO, and uses the UpcomingPage template layout.
 */
export default function RecentPage() {
  const { data, error, isLoading } = useSWR("/api/recent", fetcher);
  const title = "Recent Matches | 8jjcricket";
  const description =
    "See the most recent cricket matches and results on 8jjcricket.";

  const fixtures: Fixture[] = data?.data ?? [];

  // Hooks must be before any early returns
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const navTabs = [
    { label: "Live", href: "livescore", active: false },
    { label: "Upcoming", href: "upcoming", active: false },
    { label: "Recent", href: "recent", active: true },
  ];

  // sort fixtures by start time ascending (same idea as UpcomingPage)
  const sortedFixtures = useMemo(
    () =>
      [...fixtures].sort(
        (a, b) =>
          new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime()
      ),
    [fixtures]
  );

  // date bounds for the picker (YYYY-MM-DD)
  const minDate =
    sortedFixtures.length > 0
      ? sortedFixtures[0].starting_at.slice(0, 10)
      : undefined;
  const maxDate =
    sortedFixtures.length > 0
      ? sortedFixtures[sortedFixtures.length - 1].starting_at.slice(0, 10)
      : undefined;

  // fixtures filtered by selected date
  const filteredFixtures = useMemo(() => {
    if (!selectedDate) return sortedFixtures;
    return sortedFixtures.filter(
      (f) => f.starting_at.slice(0, 10) === selectedDate
    );
  }, [sortedFixtures, selectedDate]);

  // early returns

  if (error)
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">Failed to load recent matches.</div>
      </>
    );

  if (isLoading)
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card space-y-4 animate-pulse">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-200" />
          <div className="mt-4 h-20 rounded bg-gray-200" />
        </div>
      </>
    );

  if (!fixtures.length)
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">No recent matches found.</div>
      </>
    );

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* LEFT: heading + fixtures grid */}
        <main className="flex-1 space-y-5">
          {/* Header */}
          <div>
            <h1 className="text-lg font-extrabold text-white">
              Recent Matches
            </h1>
            <p className="mt-1 text-xs text-sky-100/70">
              See the most recent cricket matches and results on 8jjcricket.
            </p>
          </div>
          <div>
            <MobileTabBar tabs={navTabs} />
          </div>
          {/* RIGHT: calendar / date filter */}

          <aside className="lg:w-72">
            <div>
              {data ? (
                <CalenderModal
                  fixtures={fixtures}
                  setParentSelectedDate={setSelectedDate}
                />
              ) : null}
              {/* Bet button under the calendar, aligned to the right */}
              <div className="mt-2 flex justify-end border-t border-white/10 pt-3">
                <BetButton />
              </div>
            </div>
          </aside>
          {/* Fixtures grid */}
          {filteredFixtures.length === 0 ? (
            <div className="card text-sm text-gray-600 text-center">
              No matches found for this date. Try another day or clear the
              filter.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {filteredFixtures.map((f) => (
                <MobileLiveCard key={f.id} f={f} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
