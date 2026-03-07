"use client";

import React, { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import CalenderModal from "@/components/mobile/CalenderModal";
import { CRICKET_CATEGORIES, MOBILE_PAGE_SIZE } from "@/lib/constant";
import { MatchCategory } from "@/lib/match-category";
import MobileRecentCard from "@/components/mobile/MobileRecentCard";
import { Fetcher } from "@/lib/fetcher";
import type { ApiEnvelope } from "@/lib/cricket-types";
import { Fixture } from "@/types/fixture";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import MobileCricketCategory from "@/components/mobile/MobileCricketCatgory";
import MobilePagination from "@/components/mobile/MobilePagination";

/**
 * RecentPage lists recently completed matches. It adds page-specific
 * `<title>` and `<meta>` tags for SEO, and uses the UpcomingPage template layout.
 */
export default function RecentPage() {
  const { data, error, isLoading } = useSWR<ApiEnvelope<Fixture[]>>(
    "/api/recent",
    Fetcher,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [page, setPage] = useState<number>(1);
  const title = "Recent Matches | 8jjcricket";
  const description =
    "See the most recent cricket matches and results on 8jjcricket.";

  const fixtures = data?.data ?? [];

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
          new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime(),
      ),
    [fixtures],
  );

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
    Math.ceil(filteredFixtures.length / MOBILE_PAGE_SIZE),
  );

  const pagedFixtures = useMemo(() => {
    const start = (page - 1) * MOBILE_PAGE_SIZE;
    return filteredFixtures.slice(start, start + MOBILE_PAGE_SIZE);
  }, [filteredFixtures, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedDate]);

  // early returns
  if (error)
    return (
      <>
        <div className="card">Failed to load recent matches.</div>
      </>
    );

  if (isLoading) return <LoadingSkeleton num={3} col={1} />;

  if (!fixtures.length)
    return (
      <>
        <div className="card">No recent matches found.</div>
      </>
    );

  return (
    <>
      <div className="min-h-screen">
        <main className="w-[99%]  mx-auto py-1">
          <div className="flex flex-col space-y-4">
            {/* Header */}
            <div className="flex  items-center ">
              <h1 className="m-h">Recent Matches</h1>
            </div>
            <p className="mt-1 text-xs text-sky-100/70">
              See the most recent cricket matches and results on 8jjcricket.
            </p>
            <MobileTabBar tabs={navTabs} />
            <MobileCricketCategory
              selected={selectedCategory}
              setSelected={setSelectedCategory}
            />
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
              <div className="card text-sm text-gray-600 text-center">
                No matches found for this date. Try another day or clear the
                filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pagedFixtures.map((f) => (
                  <MobileRecentCard key={f.id} f={f} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <MobilePagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </div>
        </main>
      </div>
    </>
  );
}
