"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ArchiveFilters, ArchivesResponse } from "@/types/archive";
import BottomNav from "@/components/BottomNav";
import useSWR from "swr";
import { FetchJson } from "@/lib/fetcher";
import { BuildQueryString } from "@/lib/api/archives";
import { MOBILE_PAGE_SIZE } from "@/lib/constant";
import { MobileNativeArchiveCard } from "@/components/mobile/MobileNativeArchiveCard";
import MobilePagination from "@/components/mobile/MobilePagination";

/**
 * Archives Page Component
 */
export default function ArchivePage() {
  const title = "Match Archive | 8jjcricket";
  const description =
    "Browse archived cricket matches with results and details.";

  // Filter states
  const [category, setCategory] = useState<"" | "International" | "Leagues">(
    () => {
      if (typeof window === "undefined") return "";
      return (
        (sessionStorage.getItem("mobile-archive-category") as
          | ""
          | "International"
          | "Leagues") || ""
      );
    },
  );
  const [format, setFormat] = useState<"" | "T20" | "ODI" | "Test">(() => {
    if (typeof window === "undefined") return "";
    return (
      (sessionStorage.getItem("mobile-archive-format") as
        | ""
        | "T20"
        | "ODI"
        | "Test") || ""
    );
  });
  const [date, setDate] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("mobile-archive-date") || "";
  });
  const [page, setPage] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const p = sessionStorage.getItem("mobile-archive-page");
    return p ? parseInt(p, 10) : 1;
  });
  const [isRestored, setIsRestored] = useState(false);

  // Mark as restored on mount
  useEffect(() => {
    setIsRestored(true);
  }, []);

  // Save state to sessionStorage
  useEffect(() => {
    if (!isRestored) return;
    sessionStorage.setItem("mobile-archive-category", category);
    sessionStorage.setItem("mobile-archive-format", format);
    sessionStorage.setItem("mobile-archive-date", date);
    sessionStorage.setItem("mobile-archive-page", String(page));
  }, [category, format, date, page, isRestored]);

  // Save scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isRestored) {
        sessionStorage.setItem(
          "mobile-archive-scroll-pos",
          window.scrollY.toString(),
        );
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isRestored]);

  // Build filters object
  const filters: ArchiveFilters = useMemo(() => {
    const f: ArchiveFilters = {
      page,
      per_page: MOBILE_PAGE_SIZE,
    };
    if (category) f.category = category;
    if (format) f.format = format;
    if (date) f.date = date;
    return f;
  }, [category, format, date, page]);

  // Fetch archives using custom hook
  const { data, error, isLoading } = useSWR<ArchivesResponse>(
    `/api/archives${BuildQueryString(filters)}`,
    FetchJson,
  );

  // Clear all filters
  const clearFilters = () => {
    setCategory("");
    setFormat("");
    setDate("");
    setPage(1);
  };

  const dataMemo = useMemo(() => data?.data, [data]);

  // Restore scroll position after data is loaded
  useEffect(() => {
    if (isRestored && !isLoading && dataMemo && dataMemo.length > 0) {
      const savedScroll = sessionStorage.getItem("mobile-archive-scroll-pos");
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
        }, 100);
      }
    }
  }, [isRestored, isLoading, dataMemo?.length]);

  // Handle filter changes (reset to page 1)
  const handleCategoryChange = (value: "" | "International" | "Leagues") => {
    setCategory(value);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormatChange = (value: "" | "T20" | "ODI" | "Test") => {
    setFormat(value);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = data?.last_page || 1;

  // Check if any filters are active
  const hasActiveFilters = category || format || date;

  // Error state
  if (error) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-black/70 backdrop-blur-xl px-6 py-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div>
                <h1 className="text-xl font-semibold text-red-400 mb-2">
                  Failed to load archives
                </h1>
                <p className="text-sm text-red-300/80 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium border border-red-500/30"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <>
        <BottomNav />

        <div className="min-h-[60vh] space-y-6">
          {/* Hero */}
          <div className="rounded-3xl border border-white/80 bg-slate-900/80 px-6 py-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-300">
                  8JJCRICKET · ARCHIVE
                </p>
                <div className="flex  items-center ">
                  <h1 className="m-h">Cricket Archives</h1>
                </div>
                <p className="mt-2 text-sm md:text-base text-sky-100/80 max-w-xl">
                  {description}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-medium text-amber-200">
                  Loading archives…
                </span>
              </div>
            </div>
          </div>

          {/* Skeleton grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-5 shadow-2xl animate-pulse"
              >
                <div className="h-3 w-20 rounded-full bg-amber-900/40 mb-3" />
                <div className="h-4 w-32 rounded-full bg-amber-900/40 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-slate-800/50" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-800/50" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-800/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Empty state
  if (!dataMemo || dataMemo.length === 0) {
    return (
      <>
        <BottomNav />
        <div className="min-h-screen">
          <main className="w-[99%]  mx-auto py-1">
            <div className="space-y-6">
              {/* Hero */}
              <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-amber-400">
                      8JJCRICKET · ARCHIVE
                    </p>
                    <div className="flex  items-center ">
                      <h1 className="m-h">Cricket Archives</h1>
                    </div>
                    <p className="mt-2 text-sm md:text-base text-sky-100/90 max-w-xl">
                      {description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-5 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-xs font-medium text-amber-200 mb-2"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) =>
                        handleCategoryChange(
                          e.target.value as "" | "International" | "Leagues",
                        )
                      }
                      className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    >
                      <option value="">All Categories</option>
                      <option value="International">International</option>
                      <option value="Leagues">Leagues</option>
                    </select>
                  </div>

                  {/* Format Filter */}
                  <div>
                    <label
                      htmlFor="format"
                      className="block text-xs font-medium text-amber-200 mb-2"
                    >
                      Format
                    </label>
                    <select
                      id="format"
                      value={format}
                      onChange={(e) =>
                        handleFormatChange(
                          e.target.value as "" | "T20" | "ODI" | "Test",
                        )
                      }
                      className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    >
                      <option value="">All Formats</option>
                      <option value="T20">T20</option>
                      <option value="ODI">ODI</option>
                      <option value="Test">Test</option>
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-xs font-medium text-amber-200 mb-2"
                    >
                      Match Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                  </div>

                  {/* Clear Button */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      disabled={!hasActiveFilters}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        hasActiveFilters
                          ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30"
                          : "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Empty state message */}
              <div className="min-h-[40vh] flex items-center justify-center">
                <div className="max-w-md w-full rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl px-6 py-8 shadow-2xl text-center">
                  <div className="text-5xl mb-4">🏏</div>
                  <h2 className="text-xl font-semibold text-amber-200 mb-2">
                    No matches found
                  </h2>
                  <p className="text-sm text-sky-100/80">
                    {hasActiveFilters
                      ? "Try adjusting your filters to see more results."
                      : "No archived matches are available at this time."}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors text-sm font-medium border border-amber-500/30"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // Main content
  return (
    <>
      <BottomNav />

      <div className="min-h-screen">
        <main className="w-[99%]  mx-auto py-1">
          <div className="space-y-4">
            {/* Hero */}
            <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-amber-400">
                    8JJCRICKET · ARCHIVE
                  </p>
                  <div className="flex  items-center ">
                    <h1 className="m-h">Cricket Archives</h1>
                  </div>
                  <p className="mt-2 text-sm md:text-base text-sky-100/90 max-w-xl">
                    {description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-950/40 backdrop-blur-sm px-3 py-1 text-xs font-medium text-emerald-300 shadow-sm">
                    <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    {data?.total} matches
                  </span>
                  <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-950/40 backdrop-blur-sm px-3 py-1 text-xs font-medium text-amber-300 shadow-sm">
                    🏏 All formats
                  </span>
                </div>
              </div>
            </div>

            {data ? (
              <div>
                <div className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-5 shadow-2xl space-y-4 ">
                  <div>
                    <h2 className="text-sm font-semibold tracking-tight text-amber-200 mb-2">
                      Quick Stats
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-sky-100/70">Total Matches</span>
                        <span className="font-bold text-amber-300">
                          {data.total}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-sky-100/70">Current Page</span>
                        <span className="font-bold text-amber-300">
                          {data.current_page} / {data.last_page}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-sky-100/70">Per Page</span>
                        <span className="font-bold text-amber-300">
                          {data.per_page}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h2 className="text-sm font-semibold tracking-tight text-amber-200 mb-3">
                      Active Filters
                    </h2>
                    <div className="space-y-2">
                      {category && (
                        <div className="flex items-center justify-between bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20">
                          <span className="text-xs text-amber-300">
                            Category
                          </span>
                          <span className="text-xs font-bold text-white">
                            {category}
                          </span>
                        </div>
                      )}
                      {format && (
                        <div className="flex items-center justify-between bg-purple-500/10 rounded-lg px-3 py-2 border border-purple-500/20">
                          <span className="text-xs text-purple-300">
                            Format
                          </span>
                          <span className="text-xs font-bold text-white">
                            {format}
                          </span>
                        </div>
                      )}
                      {date && (
                        <div className="flex items-center justify-between bg-blue-500/10 rounded-lg px-3 py-2 border border-blue-500/20">
                          <span className="text-xs text-blue-300">Date</span>
                          <span className="text-xs font-bold text-white">
                            {date}
                          </span>
                        </div>
                      )}
                      {!hasActiveFilters && (
                        <p className="text-xs text-sky-100/50 italic">
                          No filters applied
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Filters */}
            <div className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-5 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-xs font-medium text-amber-200 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) =>
                      handleCategoryChange(
                        e.target.value as "" | "International" | "Leagues",
                      )
                    }
                    className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  >
                    <option value="">All Categories</option>
                    <option value="International">International</option>
                    <option value="Leagues">Leagues</option>
                  </select>
                </div>

                {/* Format Filter */}
                <div>
                  <label
                    htmlFor="format"
                    className="block text-xs font-medium text-amber-200 mb-2"
                  >
                    Format
                  </label>
                  <select
                    id="format"
                    value={format}
                    onChange={(e) =>
                      handleFormatChange(
                        e.target.value as "" | "T20" | "ODI" | "Test",
                      )
                    }
                    className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  >
                    <option value="">All Formats</option>
                    <option value="T20">T20</option>
                    <option value="ODI">ODI</option>
                    <option value="Test">Test</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label
                    htmlFor="date"
                    className="block text-xs font-medium text-amber-200 mb-2"
                  >
                    Match Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  />
                </div>

                {/* Clear Button */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      hasActiveFilters
                        ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30"
                        : "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Archives Grid */}
            <div className="grid gap-4">
              {dataMemo.map((archive) => (
                <MobileNativeArchiveCard key={archive.id} archive={archive} />
              ))}
            </div>

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
