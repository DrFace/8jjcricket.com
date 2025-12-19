
"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import type { Fixture } from "@/types/fixture";
import LiveCard from "@/components/LiveCard";
import BetButton from "@/components/BetButton";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import DesktopOnly from "@/components/DesktopOnly";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

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

    const weekRows: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekRows.push(days.slice(i, i + 7));
    }

    return { weekRows };
  }, [viewMonth]);

  const isDisabled = (day: Date) => {
    if (min && day < min) return true;
    if (max && day > max) return true;
    return false;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-medium">
        <button
          type="button"
          className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
          onClick={() =>
            setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
          }
        >
          ‹
        </button>
        <div>{viewMonth.toLocaleString("default", { month: "short" })} {viewMonth.getFullYear()}</div>
        <button
          type="button"
          className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
          onClick={() =>
            setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
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
              onClick={() => onSelectDate(dayStr)}
              className={[
                "h-7 w-7 rounded-md text-center leading-7 transition",
                selected ? "bg-blue-600 text-white" : "hover:bg-gray-100",
                disabled && "opacity-50 cursor-not-allowed"
              ].join(" ")}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function RecentPage() {
  const { data, error, isLoading } = useSWR("/api/recent", fetcher);
  const fixtures: Fixture[] = data?.data ?? [];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const sortedFixtures = useMemo(() => {
    return [...fixtures].sort(
      (a, b) => new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime()
    );
  }, [fixtures]);

  const filteredFixtures = useMemo(() => {
    if (!selectedDate) return sortedFixtures.slice(0, 30); // Show 30 recent matches
    return sortedFixtures.filter((f) => f.starting_at.slice(0, 10) === selectedDate);
  }, [sortedFixtures, selectedDate]);

  const minDate = sortedFixtures.length ? sortedFixtures[sortedFixtures.length - 1].starting_at.slice(0, 10) : undefined;
  const maxDate = sortedFixtures.length ? sortedFixtures[0].starting_at.slice(0, 10) : undefined;

  return (
    <>
      <TopNav />
      <DesktopOnly>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4 text-white">Recent Matches</h1>
          {error && <div className="text-red-500">Failed to load recent matches.</div>}
          {isLoading && <div className="text-amber-300">Loading...</div>}
          {!error && !isLoading && (
            <div className="flex gap-6">
              <main className="flex-1">
                {filteredFixtures.length === 0 ? (
                  <div className="text-gray-400">No matches found for this date.</div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFixtures.map((f) => (
                      <LiveCard key={f.id} f={f} />
                    ))}
                  </div>
                )}
              </main>
              <aside className="w-72">
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  minDate={minDate}
                  maxDate={maxDate}
                />
                <div className="mt-4">
                  <BetButton />
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