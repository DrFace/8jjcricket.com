"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import DesktopOnly from "@/components/DesktopOnly";
import RecentMatchCard from "@/components/RecentMatchCard";
import LiveCard from "@/components/LiveCard";
import { MatchCategory } from "@/lib/match-category";
import UpcomingCard from "@/components/UpcomingCard";
import { CRICKET_CATEGORIES } from "@/lib/constant";
import LiveScoreCard from "@/components/LiveScoreCard";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function Calendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
}: {
  selectedDate: string | null;
  onSelectDate: (d: string | null) => void;
  minDate?: string;
  maxDate?: string;
}) {
  const initialMonth = selectedDate ? new Date(selectedDate) : new Date();
  const [viewMonth, setViewMonth] = useState<Date>(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
  );

  const min = minDate ? new Date(minDate) : undefined;
  const max = maxDate ? new Date(maxDate) : undefined;

  const weeks = useMemo(() => {
    const startOfMonth = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth(),
      1
    );
    const startDay = startOfMonth.getDay();
    const gridStart = new Date(startOfMonth);
    gridStart.setDate(startOfMonth.getDate() - startDay);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      days.push(d);
    }

    const weekRows: Date[][] = [];
    for (let i = 0; i < days.length; i += 7)
      weekRows.push(days.slice(i, i + 7));

    return { weekRows };
  }, [viewMonth]);

  const isDisabled = (day: Date) => {
    if (min && day < min) return true;
    if (max && day > max) return true;
    return false;
  };

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/40 backdrop-blur p-3">
      <div className="flex items-center justify-between text-sm font-medium text-white/80">
        <button
          type="button"
          className="rounded-md px-2 py-1 text-white/70 hover:bg-white/10"
          onClick={() =>
            setViewMonth(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
            )
          }
        >
          ‹
        </button>
        <div>
          {viewMonth.toLocaleString("default", { month: "short" })}{" "}
          {viewMonth.getFullYear()}
        </div>
        <button
          type="button"
          className="rounded-md px-2 py-1 text-white/70 hover:bg-white/10"
          onClick={() =>
            setViewMonth(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
            )
          }
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {weeks.weekRows.flat().map((day, idx) => {
          const dayStr = toDateString(day);
          const selected = selectedDate === dayStr;
          const disabled = isDisabled(day);

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelectDate(selected ? null : dayStr)}
              className={[
                "h-7 w-7 rounded-md text-center leading-7 transition",
                selected
                  ? "bg-amber-400 text-black font-bold"
                  : "text-white/80 hover:bg-white/10",
                disabled &&
                  "opacity-40 cursor-not-allowed hover:bg-transparent",
              ].join(" ")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onSelectDate(null)}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs text-white/80 hover:bg-white/10 transition"
      >
        Clear date
      </button>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Prev
      </button>
      <div className="text-xs text-white/70">
        Page <span className="text-white/90 font-semibold">{page}</span> /{" "}
        {totalPages}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </div>
  );
}

type TypeCountMap = Record<string, number>;

export default function LiveScoreHome() {
  // ✅ Separate APIs
  const liveRes = useSWR("/api/live", fetcher);
  const recentRes = useSWR("/api/recent", fetcher);
  const upcomingRes = useSWR("/api/upcoming", fetcher);

  const liveMatches = liveRes.data?.data?.live ?? [];
  const recentMatches = recentRes.data?.data ?? [];
  const upcomingMatches = upcomingRes.data?.data ?? [];

  const loading =
    liveRes.isLoading || recentRes.isLoading || upcomingRes.isLoading;
  const error = liveRes.error || recentRes.error || upcomingRes.error;

  const [activeTab, setActiveTab] = useState<"Live" | "Upcoming" | "Recent">(
    "Live"
  );
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Calendar for ALL tabs
  const [selectedDateLive, setSelectedDateLive] = useState<string | null>(null);
  const [selectedDateRecent, setSelectedDateRecent] = useState<string | null>(
    null
  );
  const [selectedDateUpcoming, setSelectedDateUpcoming] = useState<
    string | null
  >(null);

  // ✅ Pagination
  const RECENT_PAGE_SIZE = 30;
  const UPCOMING_PAGE_SIZE = 30;
  const [recentPage, setRecentPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);

  const recentSorted = useMemo(() => {
    return [...recentMatches].sort(
      (a: any, b: any) => +new Date(b.starting_at) - +new Date(a.starting_at)
    );
  }, [recentMatches]);

  const upcomingSorted = useMemo(() => {
    return [...upcomingMatches].sort(
      (a: any, b: any) => +new Date(a.starting_at) - +new Date(b.starting_at)
    );
  }, [upcomingMatches]);

  const filteredLive = useMemo(() => {
    let data = [...liveMatches];
    if (selectedCategory !== "All")
      data = data.filter((m: any) => MatchCategory(m, selectedCategory));
    return data;
  }, [liveMatches, selectedCategory]);

  // ✅ Live tab recent 4 -> use RecentMatchCard
  const liveTabRecent4 = useMemo(() => {
    let data = [...recentSorted];
    if (selectedDateLive)
      data = data.filter(
        (m: any) => String(m.starting_at).slice(0, 10) === selectedDateLive
      );
    if (selectedCategory !== "All")
      data = data.filter((m: any) => MatchCategory(m, selectedCategory));
    return data.slice(0, 4);
  }, [recentSorted, selectedDateLive, selectedCategory]);

  // ✅ Recent tab (pagination + calendar) -> use RecentMatchCard
  const filteredRecentAll = useMemo(() => {
    let data = [...recentSorted];
    if (selectedDateRecent)
      data = data.filter(
        (m: any) => String(m.starting_at).slice(0, 10) === selectedDateRecent
      );
    if (selectedCategory !== "All")
      data = data.filter((m: any) => MatchCategory(m, selectedCategory));
    return data;
  }, [recentSorted, selectedDateRecent, selectedCategory]);

  const recentTotalPages = Math.max(
    1,
    Math.ceil(filteredRecentAll.length / RECENT_PAGE_SIZE)
  );
  const recentPaged = useMemo(() => {
    const start = (recentPage - 1) * RECENT_PAGE_SIZE;
    return filteredRecentAll.slice(start, start + RECENT_PAGE_SIZE);
  }, [filteredRecentAll, recentPage]);

  // ✅ Upcoming tab (pagination + calendar) -> use UpcomingMatchCard
  const filteredUpcomingAll = useMemo(() => {
    let data = [...upcomingSorted];
    if (selectedDateUpcoming)
      data = data.filter(
        (m: any) => String(m.starting_at).slice(0, 10) === selectedDateUpcoming
      );
    if (selectedCategory !== "All")
      data = data.filter((m: any) => MatchCategory(m, selectedCategory));
    return data;
  }, [upcomingSorted, selectedDateUpcoming, selectedCategory]);

  const upcomingTotalPages = Math.max(
    1,
    Math.ceil(filteredUpcomingAll.length / UPCOMING_PAGE_SIZE)
  );
  const upcomingPaged = useMemo(() => {
    const start = (upcomingPage - 1) * UPCOMING_PAGE_SIZE;
    return filteredUpcomingAll.slice(start, start + UPCOMING_PAGE_SIZE);
  }, [filteredUpcomingAll, upcomingPage]);

  // Min/max calendar ranges
  const recentMinDate = recentSorted.length
    ? String(recentSorted[recentSorted.length - 1].starting_at).slice(0, 10)
    : undefined;
  const recentMaxDate = recentSorted.length
    ? String(recentSorted[0].starting_at).slice(0, 10)
    : undefined;

  const upcomingMinDate = upcomingSorted.length
    ? String(upcomingSorted[0].starting_at).slice(0, 10)
    : undefined;
  const upcomingMaxDate = upcomingSorted.length
    ? String(upcomingSorted[upcomingSorted.length - 1].starting_at).slice(0, 10)
    : undefined;

  // Reset pages on filter change
  useMemo(() => setRecentPage(1), [selectedCategory, selectedDateRecent]);
  useMemo(() => setUpcomingPage(1), [selectedCategory, selectedDateUpcoming]);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {(["Live", "Upcoming", "Recent"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition shadow-md ${
                activeTab === tab
                  ? "bg-gradient-to-r from-india-saffron to-india-gold text-black border border-india-gold"
                  : "bg-black/40 text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {CRICKET_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-semibold transition border backdrop-blur",
                  active
                    ? "border-india-green bg-india-green/20 text-india-green shadow-sm"
                    : "border-white/15 bg-white/5 text-gray-400 hover:border-india-green/40 hover:text-india-green",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {error && <div className="text-india-red">Failed to load data.</div>}
        {!error && loading && <div className="text-india-gold animate-pulse">Loading matches...</div>}

        {!error && !loading && (
          <>
            {/* LIVE TAB */}
            {activeTab === "Live" && (
              <>
                <h1 className="text-3xl font-bold india-header-text mb-6">
                  Live Scores
                </h1>

                <div className="mb-10">
                  {filteredLive.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                      {filteredLive.map((match: any) => (
                        <LiveScoreCard key={match.id} f={match} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 italic text-center py-10 india-card-gradient rounded-xl">
                      No live matches available at the moment.
                    </div>
                  )}
                </div>

                {/* Recent 6 below live */}
                <div className="flex flex-col lg:flex-row gap-6">
                  <main className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-white">
                        Recent Matches
                      </h2>
                      <div className="text-xs text-white/60">
                        Showing{" "}
                        <span className="text-india-gold font-semibold">
                          {liveTabRecent4?.length}
                        </span>{" "}
                        latest
                      </div>
                    </div>

                    {liveTabRecent4.length === 0 ? (
                      <div className="text-gray-400 italic text-center py-10 india-card-gradient rounded-xl">
                        No recent matches found for this date/filter.
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {liveTabRecent4.map((f: any) => (
                          <LiveScoreCard key={f.id} f={f} />
                        ))}
                      </div>
                    )}
                  </main>

                  <aside className="w-full lg:w-80">
                    <div className="mb-2 text-xs font-semibold text-india-gold">
                      Calendar (filters recent)
                    </div>
                    <Calendar
                      selectedDate={selectedDateLive}
                      onSelectDate={setSelectedDateLive}
                      minDate={recentMinDate}
                      maxDate={recentMaxDate}
                    />
                  </aside>
                </div>
              </>
            )}

            {/* UPCOMING TAB */}
            {activeTab === "Upcoming" && (
              <>
                <h1 className="text-3xl font-bold india-header-text mb-6">
                  Upcoming Matches
                </h1>

                <div className="flex flex-col lg:flex-row gap-6">
                  <main className="flex-1">
                    {filteredUpcomingAll.length > 0 ? (
                      <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                          {upcomingPaged.map((match: any) => (
                            <UpcomingCard key={match.id} f={match} />
                          ))}
                        </div>

                        <Pagination
                          page={upcomingPage}
                          totalPages={upcomingTotalPages}
                          onPrev={() =>
                            setUpcomingPage((p) => Math.max(1, p - 1))
                          }
                          onNext={() =>
                            setUpcomingPage((p) =>
                              Math.min(upcomingTotalPages, p + 1)
                            )
                          }
                        />
                      </>
                    ) : (
                      <div className="text-gray-400 italic text-center py-10 india-card-gradient rounded-xl">
                        No upcoming matches found for this date/filter.
                      </div>
                    )}
                  </main>

                  <aside className="w-full lg:w-80">
                    <div className="mb-2 text-xs font-semibold text-india-gold">
                      Calendar (filters upcoming)
                    </div>
                    <Calendar
                      selectedDate={selectedDateUpcoming}
                      onSelectDate={setSelectedDateUpcoming}
                      minDate={upcomingMinDate}
                      maxDate={upcomingMaxDate}
                    />
                  </aside>
                </div>
              </>
            )}

            {/* RECENT TAB */}
            {activeTab === "Recent" && (
              <>
                <h1 className="text-3xl font-bold india-header-text mb-6">
                  Recent Matches
                </h1>

                <div className="flex flex-col lg:flex-row gap-6">
                  <main className="flex-1">
                    {filteredRecentAll.length > 0 ? (
                      <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                          {recentPaged.map((f: any) => (
                            <LiveScoreCard key={f.id} f={f} />
                          ))}
                        </div>

                        <Pagination
                          page={recentPage}
                          totalPages={recentTotalPages}
                          onPrev={() =>
                            setRecentPage((p) => Math.max(1, p - 1))
                          }
                          onNext={() =>
                            setRecentPage((p) =>
                              Math.min(recentTotalPages, p + 1)
                            )
                          }
                        />
                      </>
                    ) : (
                      <div className="text-gray-400 italic text-center py-10 india-card-gradient rounded-xl">
                        No recent matches found for this date/filter.
                      </div>
                    )}
                  </main>

                  <aside className="w-full lg:w-80">
                    <div className="mb-2 text-xs font-semibold text-india-gold">
                      Calendar (filters recent)
                    </div>
                    <Calendar
                      selectedDate={selectedDateRecent}
                      onSelectDate={setSelectedDateRecent}
                      minDate={recentMinDate}
                      maxDate={recentMaxDate}
                    />
                  </aside>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
