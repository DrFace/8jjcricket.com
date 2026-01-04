"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import type { Fixture } from "@/types/fixture";
import RecentMatchCard from "@/components/RecentMatchCard";
//import BetButton from "@/components/BetButton";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import DesktopOnly from "@/components/DesktopOnly";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

/* ===================== CALENDAR ===================== */
function Calendar({ selectedDate, onSelectDate, minDate, maxDate }: any) {
  const initialMonth = selectedDate ? new Date(selectedDate) : new Date();
  const [viewMonth, setViewMonth] = useState<Date>(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
  );

  const min = minDate ? new Date(minDate) : undefined;
  const max = maxDate ? new Date(maxDate) : undefined;

  const weeks = useMemo(() => {
    const startOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const startDay = startOfMonth.getDay();
    const gridStart = new Date(startOfMonth);
    gridStart.setDate(startOfMonth.getDate() - startDay);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      days.push(d);
    }

    const rows: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
    return rows;
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
          className="rounded-md px-2 py-1 hover:bg-white/10"
          onClick={() =>
            setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
          }
        >
          ‹
        </button>
        <div>
          {viewMonth.toLocaleString("default", { month: "short" })}{" "}
          {viewMonth.getFullYear()}
        </div>
        <button
          className="rounded-md px-2 py-1 hover:bg-white/10"
          onClick={() =>
            setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
          }
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {weeks.flat().map((day, idx) => {
          const dayStr = toDateString(day);
          const selected = selectedDate === dayStr;
          const disabled = isDisabled(day);

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelectDate(selected ? null : dayStr)}
              className={[
                "h-7 w-7 rounded-md transition",
                selected
                  ? "bg-amber-400 text-black font-bold"
                  : "text-white/80 hover:bg-white/10",
                disabled && "opacity-40 cursor-not-allowed",
              ].join(" ")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onSelectDate(null)}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs text-white/80 hover:bg-white/10"
      >
        Clear date
      </button>
    </div>
  );
}

/* ===================== PAGINATION ===================== */
function Pagination({ page, totalPages, onPrev, onNext }: any) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 disabled:opacity-40"
      >
        Prev
      </button>
      <div className="text-xs text-white/70">
        Page <b>{page}</b> / {totalPages}
      </div>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

/* ===================== PAGE ===================== */
export default function RecentPage() {
  const { data, error, isLoading } = useSWR("/api/recent", fetcher);
  const fixtures: Fixture[] = data?.data ?? [];

  const categories = ["International", "T20", "ODI", "Test", "Leagues", "All"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const PAGE_SIZE = 30;
  const [page, setPage] = useState(1);

  function matchCategory(item: any, category: string) {
    const cat = String(item?.category ?? "").toLowerCase();
    if (category === "All") return true;
    if (!cat) return false;
    if (category === "Leagues") {
      return !["international", "odi", "t20", "test"].some((c) => cat.includes(c));
    }
    return cat.includes(category.toLowerCase());
  }

  const sorted = useMemo(() => {
    return [...fixtures].sort(
      (a, b) => new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime()
    );
  }, [fixtures]);

  const filtered = useMemo(() => {
    let list = [...sorted];
    if (selectedDate)
      list = list.filter((f) => f.starting_at.slice(0, 10) === selectedDate);
    if (selectedCategory !== "All")
      list = list.filter((f) => matchCategory(f, selectedCategory));
    return list;
  }, [sorted, selectedDate, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useMemo(() => setPage(1), [selectedCategory, selectedDate]);

  const minDate = sorted.length
    ? sorted[sorted.length - 1].starting_at.slice(0, 10)
    : undefined;
  const maxDate = sorted.length ? sorted[0].starting_at.slice(0, 10) : undefined;

  return (
    <>
      <TopNav />
      <DesktopOnly>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-white mb-4">Recent Matches</h1>

          {/* Category Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={[
                  "rounded-full px-3 py-1 text-[11px] font-semibold border",
                  selectedCategory === cat
                    ? "border-amber-300 bg-amber-300/15 text-amber-200"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-amber-300/40",
                ].join(" ")}
              >
                {cat}
              </button>
            ))}
          </div>

          {error && <div className="text-red-500">Failed to load matches.</div>}
          {isLoading && <div className="text-amber-300">Loading...</div>}

          {!error && !isLoading && (
            <div className="flex gap-6">
              <main className="flex-1">
                {paged.length === 0 ? (
                  <div className="text-gray-400">No matches found.</div>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {paged.map((f) => (
                        <RecentMatchCard key={f.id} f={f} />
                      ))}
                    </div>

                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onPrev={() => setPage((p) => Math.max(1, p - 1))}
                      onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                    />
                  </>
                )}
              </main>

              <aside className="w-80">
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  minDate={minDate}
                  maxDate={maxDate}
                />
                <div className="mt-4">
                  {/* <BetButton /> */}
                </div>
              </aside>
            </div>
          )}
        </div>
      </DesktopOnly>
      <Footer />
    </>
  );
}