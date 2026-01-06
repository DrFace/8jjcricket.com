"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import ArchhiveCard from "@/components/ArchhiveCard";
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

function Pagination({ page, totalPages, onPrev, onNext }: any) {
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

type Scope = "" | "International" | "Leagues";
type Format = "" | "T20" | "ODI" | "Test";

function normalizeFormatFromItem(item: any): Format {
  const direct = String(item?.format ?? "").toUpperCase();
  if (direct === "T20" || direct === "ODI" || direct === "TEST")
    return direct === "TEST" ? "Test" : (direct as any);

  // fallback if older API response doesn’t have `format`
  const cat = String(item?.category ?? "").toUpperCase();
  if (cat.includes("TEST")) return "Test";
  if (cat.includes("ODI")) return "ODI";
  if (cat.includes("T20")) return "T20";
  const type = String(item?.type ?? "").toUpperCase();
  if (type.includes("TEST")) return "Test";
  if (type.includes("ODI")) return "ODI";
  if (type.includes("T20")) return "T20";
  return "";
}

function normalizeScopeFromItem(item: any): Scope {
  const direct = String(item?.category ?? "");
  if (direct === "International" || direct === "Leagues")
    return direct as Scope;

  // fallback heuristic
  const localNat = Boolean(item?.localteam?.national_team);
  const visitNat = Boolean(item?.visitorteam?.national_team);
  if (localNat || visitNat) return "International";
  return "";
}

export default function UpcomingPage() {
  const { data, error, isLoading } = useSWR("/api/fixtures/upcoming", fetcher);
  const fixtures: any[] = data?.data ?? [];

  // Keep the same pill row UI, but interpret clicks as “scope” or “format”
  const chips = [
    "International",
    "T20",
    "ODI",
    "Test",
    "Leagues",
    "All",
  ] as const;

  const [selectedScope, setSelectedScope] = useState<Scope>("");
  const [selectedFormat, setSelectedFormat] = useState<Format>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const PAGE_SIZE = 30;
  const [page, setPage] = useState(1);

  function onChipClick(label: (typeof chips)[number]) {
    if (label === "All") {
      setSelectedScope("");
      setSelectedFormat("");
      return;
    }

    if (label === "International" || label === "Leagues") {
      setSelectedScope((cur) => (cur === label ? "" : label));
      return;
    }

    // T20 / ODI / Test
    setSelectedFormat((cur) => (cur === label ? "" : (label as Format)));
  }

  const sorted = useMemo(() => {
    return [...fixtures].sort(
      (a, b) => +new Date(a.starting_at) - +new Date(b.starting_at)
    );
  }, [fixtures]);

  const filtered = useMemo(() => {
    let list = [...sorted];

    if (selectedDate) {
      list = list.filter(
        (f) => String(f.starting_at).slice(0, 10) === selectedDate
      );
    }

    if (selectedScope) {
      list = list.filter((f) => {
        const scope = normalizeScopeFromItem(f);
        return scope === selectedScope;
      });
    }

    if (selectedFormat) {
      list = list.filter((f) => {
        const fmt = normalizeFormatFromItem(f);
        return fmt === selectedFormat;
      });
    }

    return list;
  }, [sorted, selectedDate, selectedScope, selectedFormat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useMemo(() => setPage(1), [selectedScope, selectedFormat, selectedDate]);

  const minDate = sorted.length
    ? String(sorted[0].starting_at).slice(0, 10)
    : undefined;
  const maxDate = sorted.length
    ? String(sorted[sorted.length - 1].starting_at).slice(0, 10)
    : undefined;

  const allActive = !selectedScope && !selectedFormat;

  return (
    <>
      <TopNav />
      <DesktopOnly>
        <main className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-black/80 pt-4 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-amber-400 drop-shadow-lg tracking-tight mb-6">
              Upcoming Matches
            </h1>

            {/* Filters (scope + format + all) */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {chips.map((label) => {
                const active =
                  (label === "All" && allActive) ||
                  label === selectedScope ||
                  label === selectedFormat;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onChipClick(label)}
                    className={[
                      "rounded-full px-3 py-1 text-[11px] font-semibold transition",
                      "border backdrop-blur",
                      active
                        ? "border-amber-300/60 bg-amber-300/15 text-amber-200 shadow"
                        : "border-white/15 bg-white/5 text-sky-100/70 hover:border-amber-300/40 hover:text-sky-100",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-black/70 backdrop-blur-xl px-6 py-5 shadow-2xl">
                <h2 className="text-lg font-semibold text-red-400 mb-1">
                  Failed to load upcoming matches
                </h2>
                <p className="text-sm text-red-300/80">
                  Please refresh the page or try again later.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="text-amber-300">Loading upcoming matches...</div>
            )}

            {!error && !isLoading && (
              <div className="flex gap-6">
                <main className="flex-1">
                  {paged.length > 0 ? (
                    <>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {paged.map((fixture: any) => (
                          <div
                            key={fixture.id}
                            className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-2 shadow-2xl hover:border-amber-400/50 hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)] transition-all"
                          >
                            <ArchhiveCard f={fixture} />
                          </div>
                        ))}
                      </div>

                      <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPrev={() => setPage((p) => Math.max(1, p - 1))}
                        onNext={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                      />
                    </>
                  ) : (
                    <div className="text-gray-300">
                      No upcoming matches found for this date/filter.
                    </div>
                  )}
                </main>

                <aside className="w-80">
                  <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </aside>
              </div>
            )}
          </div>
        </main>
      </DesktopOnly>
      <Footer />
    </>
  );
}
