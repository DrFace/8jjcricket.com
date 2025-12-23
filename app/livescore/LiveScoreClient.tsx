"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import ArchhiveCard from "@/components/ArchhiveCard";
import LiveCard from "@/components/LiveCard";
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
        <div>
          {viewMonth.toLocaleString("default", { month: "short" })} {viewMonth.getFullYear()}
        </div>
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

export default function LiveScoreHome() {
  const { data, error } = useSWR("/api/live", fetcher);
  const liveData = data?.data?.live ?? [];
  const upcomingData = data?.data?.upcoming ?? [];
  const recentData = data?.data?.recent ?? [];

  const [activeTab, setActiveTab] = useState("Live");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // ✅ Category Filter State
  const categories = ["International", "T20", "ODI", "Test", "Leagues", "All"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Filter Recent Matches
  const filteredRecent = useMemo(() => {
    let data = recentData;
    if (selectedDate) {
      data = data.filter((f: any) => f.starting_at.slice(0, 10) === selectedDate);
    }
    if (selectedCategory !== "All") {
      data = data.filter((f: any) => f.category === selectedCategory); // Adjust based on API
    }
    return data.slice(0, 6);
  }, [recentData, selectedDate, selectedCategory]);

  // ✅ Filter Live Matches
  const filteredLive = useMemo(() => {
    let data = liveData;
    if (selectedCategory !== "All") {
      data = data.filter((f: any) => f.category === selectedCategory);
    }
    return data;
  }, [liveData, selectedCategory]);

  // ✅ Filter Upcoming Matches
  const filteredUpcoming = useMemo(() => {
    let data = upcomingData;
    if (selectedCategory !== "All") {
      data = data.filter((f: any) => f.category === selectedCategory);
    }
    return data;
  }, [upcomingData, selectedCategory]);

  const minDate = recentData.length ? recentData[recentData.length - 1].starting_at.slice(0, 10) : undefined;
  const maxDate = recentData.length ? recentData[0].starting_at.slice(0, 10) : undefined;

  return (
    <DesktopOnly>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {["Live", "Upcoming", "Recent"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-amber-400 text-black shadow"
                  : "bg-black/40 text-white hover:bg-amber-300/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-6">
          {categories.map((cat) => {
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

        {error && <div className="text-red-500">Failed to load data.</div>}
        {!error && (
          <>
            {activeTab === "Live" && (
              <>
                <h1 className="text-3xl font-bold text-white mb-6">Live Scores</h1>
                <div className="mb-8">
                  {filteredLive.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredLive.map((match: any) => (
                        <ArchhiveCard key={match.id} f={match} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400">No live matches available.</div>
                  )}
                </div>

                {/* Recent Matches with Calendar */}
                <div className="flex gap-6">
                  <main className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-4">Recent Matches</h2>
                    {filteredRecent.length === 0 ? (
                      <div className="text-gray-400">No matches found for this date.</div>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredRecent.map((f: any) => (
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
                  </aside>
                </div>
              </>
            )}

            {activeTab === "Upcoming" && (
              <>
                <h1 className="text-3xl font-bold text-white mb-6">Upcoming Matches</h1>
                {filteredUpcoming.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUpcoming.map((match: any) => (
                      <ArchhiveCard key={match.id} f={match} />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">No upcoming matches available.</div>
                )}
              </>
            )}

            {activeTab === "Recent" && (
              <>
                <h1 className="text-3xl font-bold text-white mb-6">Recent Matches</h1>
                {filteredRecent.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecent.slice(0, 30).map((f: any) => (
                      <LiveCard key={f.id} f={f} />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">No recent matches found.</div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </DesktopOnly>
  );
}
