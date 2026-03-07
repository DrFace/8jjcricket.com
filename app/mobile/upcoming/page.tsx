"use client";

import React, { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import CalenderModal from "@/components/mobile/CalenderModal";
import { MOBILE_PAGE_SIZE } from "@/lib/constant";
import { MatchCategory } from "@/lib/match-category";
import MobileUpcomingCard from "@/components/mobile/MobileUpcomingCard";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import MobileCricketCategory from "@/components/mobile/MobileCricketCatgory";
import MobilePagination from "@/components/mobile/MobilePagination";

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
          new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime(),
      ),
    [fixtures],
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
    Math.ceil(filteredFixtures.length / MOBILE_PAGE_SIZE),
  );

  const pagedFixtures = useMemo(() => {
    const start = (page - 1) * MOBILE_PAGE_SIZE;
    return filteredFixtures.slice(start, start + MOBILE_PAGE_SIZE);
  }, [filteredFixtures, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedDate]);

  return (
    <>
      <div className="min-h-screen">
        <main className="w-[99%]  mx-auto py-1">
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <div className="flex  items-center ">
              <h1 className="m-h">Upcoming Matches</h1>
            </div>
            <span className="text-xs text-sky-100/70">
              Stay ahead of the action with the next fixtures on 8jjcricket.
            </span>
            <MobileTabBar tabs={navTabs} />
            <MobileCricketCategory
              selected={selectedCategory}
              setSelected={setSelectedCategory}
            />

            {/* RIGHT: calendar / date filter */}

            <aside className="w-full">
              <div>
                {data ? (
                  <CalenderModal
                    fixtures={fixtures}
                    setParentSelectedDate={setSelectedDate}
                  />
                ) : null}
              </div>
            </aside>
            <div>
              {isLoading ? (
                <LoadingSkeleton num={3} col={1} />
              ) : error ? (
                <ErrorState message="Failed to load upcoming fixtures" />
              ) : !fixtures.length ? (
                <div className="card text-sm text-gray-600">
                  No upcoming matches found. Try again later.
                </div>
              ) : (
                <>
                  {/* Fixtures grid */}
                  {filteredFixtures.length === 0 ? (
                    <div className="card text-sm text-gray-600">
                      No matches found for this date. Try another day or clear
                      the filter.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {pagedFixtures.map((f) => (
                        <MobileUpcomingCard key={f.id} f={f} />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  <MobilePagination
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                  />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
