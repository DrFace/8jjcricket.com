"use client";

import React, { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import CalenderModal from "@/components/mobile/CalenderModal";
import { CRICKET_CATEGORIES, MOBILE_PAGE_SIZE } from "@/lib/constant";
import { MatchCategory } from "@/lib/match-category";
import MobileLiveCard from "@/components/mobile/MobileLiveCard";
import MobileUpcomingCard from "@/components/mobile/MobileUpcomingCard";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

/**
 * UpcomingPage lists upcoming cricket fixtures. It adds SEO metadata via
 * in-line `<title>` and `<meta>` tags.
 */
export default function UpcomingPage() {
  const { data, error, isLoading } = useSWR("/api/upcoming", fetcher);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [page, setPage] = useState<number>(1);
  const title = "Upcoming Matches | 8jjcricket";
  const description =
    "Check the upcoming cricket fixtures and schedule on 8jjcricket.";
  const fixtures = data?.data ?? [];
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

  // fixtures filtered by selected date and category
  const filteredFixtures = useMemo(() => {
    let data = sortedFixtures;

    // 🗓 Date filter
    if (selectedDate) {
      data = data.filter((f) => f.starting_at.slice(0, 10) === selectedDate);
    }
    // 🏷 Category filter
    if (selectedCategory !== "All") {
      data = data.filter((f: any) => MatchCategory(f, selectedCategory));
    }

    return data;
  }, [sortedFixtures, selectedDate, selectedCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFixtures.length / MOBILE_PAGE_SIZE)
  );

  const pagedFixtures = useMemo(() => {
    const start = (page - 1) * MOBILE_PAGE_SIZE;
    return filteredFixtures.slice(start, start + MOBILE_PAGE_SIZE);
  }, [filteredFixtures, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedDate]);

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

          {/* Filters */}
          <div className="flex flex-wrap gap-1">
            {CRICKET_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={[
                    "rounded-full px-3 py-1 text-[11px] font-semibold transition",
                    "border backdrop-blur",
                    active
                      ? "border-amber-300/60 bg-amber-300/15 text-amber-200 shadow"
                      : "border-white/15 bg-white/5 text-sky-100/70 hover:border-amber-300/40 hover:text-sky-100",
                  ].join(" ")}
                >
                  {cat}
                </button>
              );
            })}
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
            </div>
          </aside>

          {/* Fixtures grid */}
          {filteredFixtures.length === 0 ? (
            <div className="card text-sm text-gray-600">
              No matches found for this date. Try another day or clear the
              filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pagedFixtures.map((f) => (
                <MobileUpcomingCard key={f.id} f={f} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 disabled:opacity-40"
              >
                Prev
              </button>

              <span className="text-xs text-white/70">
                Page <strong>{page}</strong> / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
