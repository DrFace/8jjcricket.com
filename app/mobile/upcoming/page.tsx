"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import type { Fixture } from "@/types/fixture";
import BetButton from "@/components/BetButton";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import CalenderModal from "@/components/mobile/CalenderModal";
import MobileFixtureCard from "@/components/mobile/MobileFixtureCard";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

/**
 * UpcomingPage lists upcoming cricket fixtures. It adds SEO metadata via
 * in-line `<title>` and `<meta>` tags.
 */
export default function UpcomingPage() {
  const { data, error, isLoading } = useSWR("/api/upcoming", fetcher);
  const title = "Upcoming Matches | 8jjcricket";
  const description =
    "Check the upcoming cricket fixtures and schedule on 8jjcricket.";

  const fixtures: Fixture[] = data?.data ?? [];

  // Hooks must be before any early returns
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // sort fixtures by start time ascending
  const sortedFixtures = useMemo(
    () =>
      [...fixtures].sort(
        (a, b) =>
          new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime()
      ),
    [fixtures]
  );

  const navTabs = [
    { label: "Live", href: "livescore", active: false },
    { label: "Upcoming", href: "upcoming", active: true },
    { label: "Recent", href: "recent", active: false },
  ];

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

  // early-return states (after hooks)

  if (error)
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">Failed to load upcoming fixtures.</div>
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
        <div className="card">No upcoming matches right now.</div>
      </>
    );

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        {/* LEFT: heading + fixtures grid */}
        <main className="flex-1 space-y-5">
          {/* Heading + nav pills */}
          {/* Header */}
          <div>
            <h1 className="text-lg font-extrabold text-white">
              Upcoming Matches
            </h1>
            <p className="mt-1 text-xs text-sky-100/70">
              Stay ahead of the action with the next fixtures on 8jjcricket.
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
            <div className="card text-sm text-gray-600">
              No matches found for this date. Try another day or clear the
              filter.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {filteredFixtures.map((f) => (
                <MobileFixtureCard key={f.id} f={f} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
