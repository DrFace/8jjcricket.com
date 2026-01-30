"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import Head from "next/head"; // ✅ ADD THIS IMPORT
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { PaginationComponet } from "@/components/ui/Pagination";
import ErrorState from "@/components/ui/ErrorState";
import { ToInt } from "@/lib/series-utils";
import { PAGE_SIZE, SERIES_TABS } from "@/lib/constant";
import { LeagueRespond, SeriesByMonth } from "@/types/series";

// ✅ IMPORT SEO DATA
import { seriesMetadata, seriesJsonLd } from "@/components/seo/SeriesSeo";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/**
 * SeriesPage displays cricket series similar to Cricbuzz format
 * with tabs and series grouped by month
 */
export default function SeriesPage() {
  const [activeTab, setActiveTab] = useState("series");
  const [activeFilter, setActiveFilter] = useState("All");

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = ToInt(searchParams.get("page"), 1);

  const { data, error, isLoading } = useSWR(
    `/api/leagues?page=${page}&per_page=${PAGE_SIZE}`,
    fetcher,
  );

  const leagues: LeagueRespond[] = data?.data ?? [];
  const totalPages = data?.meta?.last_page
    ? parseInt(data?.meta?.last_page)
    : 1;

  const onPage = (p: number) => {
    if (!Number.isFinite(p)) return;
    const next = Math.min(Math.max(1, p), totalPages);

    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(next));
    router.push(`?${sp.toString()}`);
  };

  // ✅ EXTRACT META VALUES
  const title =
    (seriesMetadata.title as string) ||
    "Cricket Series Schedule 2026 | 8jjcricket";
  const description =
    (seriesMetadata.description as string) ||
    "Complete cricket series schedule for 2026";
  const ogImage =
    (seriesMetadata.openGraph?.images as Array<{ url: string }>)?.[0]?.url ||
    "https://8jjcricket.com/og-series.jpg";
  const twitterImage =
    (seriesMetadata.twitter?.images as string[])?.[0] ||
    "https://8jjcricket.com/og-series.jpg";

  // Filter leagues based on active filter
  let filteredLeagues = leagues;
  if (activeFilter === "International") {
    filteredLeagues = leagues.filter(
      (l) =>
        l.code.match(/T20I|ODI|TEST|WC|AC|ASH|WA|WODI|WT20/i) ||
        l.name.toLowerCase().includes("world cup") ||
        l.name.toLowerCase().includes("ashes") ||
        l.name.toLowerCase().includes("champions trophy"),
    );
  } else if (activeFilter === "League") {
    filteredLeagues = leagues.filter(
      (l) =>
        l.code.match(/IPL|BBL|PSL|BPL|CPL|ILT20|SA20|MLC|LPL|MSL/i) ||
        l.name.toLowerCase().includes("premier league") ||
        l.name.toLowerCase().includes("super league"),
    );
  } else if (activeFilter === "Domestic") {
    filteredLeagues = leagues.filter(
      (l) => l.type === "domestic" || l.code.match(/DOMESTIC/i),
    );
  } else if (activeFilter === "Women") {
    filteredLeagues = leagues.filter(
      (l) =>
        l.code.match(/WOMEN|WOM/i) || l.name.toLowerCase().includes("women"),
    );
  }

  const currentAndFutureLeagues = filteredLeagues.filter((league) => {
    if (
      league.seasons &&
      Array.isArray(league.seasons) &&
      league.seasons.length > 0
    ) {
      return league.seasons.some((season: any) => {
        const seasonName = season.name || "";
        const yearMatch = seasonName.match(/\d{4}/);
        if (yearMatch) {
          const year = parseInt(yearMatch[0]);
          return year >= 2024;
        }
        return false;
      });
    }
    return true;
  });

  const getLatestSeason = (seasons: any[]) => {
    if (!seasons?.length) return null;
    const sorted = [...seasons].sort((a, b) => {
      const getYear = (name: string) => {
        const years = name.match(/\d{4}/g);
        return years ? Math.max(...years.map((y) => parseInt(y))) : 0;
      };
      return getYear(b.name) - getYear(a.name);
    });
    return sorted[0];
  };

  const sortedLeagues = [...currentAndFutureLeagues].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const seriesByMonth: SeriesByMonth = {};

  sortedLeagues.forEach((league) => {
    const currentSeason =
      league.seasons?.find((s: any) => s.is_current) ||
      getLatestSeason(league.seasons);

    if (currentSeason?.starting_at) {
      const startDate = new Date(currentSeason.starting_at);
      const monthYear = startDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!seriesByMonth[monthYear]) {
        seriesByMonth[monthYear] = [];
      }
      seriesByMonth[monthYear].push({
        ...league,
        dateRange: formatDateRange(
          currentSeason.starting_at,
          currentSeason.ending_at,
        ),
      });
    } else {
      const monthYear = "December 2025";
      if (!seriesByMonth[monthYear]) {
        seriesByMonth[monthYear] = [];
      }
      seriesByMonth[monthYear].push(league);
    }
  });

  function formatDateRange(start: string, end: string) {
    if (!start || !end) return "";
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  }

  return (
    <>
      {/* ✅ USE HEAD COMPONENT FOR CLIENT COMPONENTS */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content={(seriesMetadata.keywords as string[])?.join(", ") || ""}
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={(seriesMetadata.openGraph?.title as string) || title}
        />
        <meta
          property="og:description"
          content={
            (seriesMetadata.openGraph?.description as string) || description
          }
        />
        <meta property="og:url" content="https://8jjcricket.com/series" />
        <meta property="og:site_name" content="8jjcricket" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={(seriesMetadata.twitter?.title as string) || title}
        />
        <meta
          name="twitter:description"
          content={
            (seriesMetadata.twitter?.description as string) || description
          }
        />
        <meta name="twitter:image" content={twitterImage} />
        <meta name="twitter:site" content="@8jjcricket" />

        {/* Canonical */}
        <link rel="canonical" href="https://8jjcricket.com/series" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seriesJsonLd) }}
        />
      </Head>

      <div className="min-h-screen flex flex-col">
        <TopNav />
        <BottomNav />

        <main className="flex-1">
          <div className="space-y-6 2xl:w-[75%] xl:w-[80%] lg:w-[95%] mx-auto h-min-80">
            {isLoading ? (
              <div className="animate-pulse space-y-4 mt-5">
                <div className="h-10 bg-gray-200 rounded w-full" />
                <div className="h-32 bg-gray-200 rounded" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            ) : error ? (
              <ErrorState message="Failed to load series." />
            ) : (
              <>
                {/* Tabs */}
                <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                  <div className="flex overflow-x-auto">
                    {SERIES_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? "border-amber-400 text-amber-300 bg-amber-950/30"
                            : "border-transparent text-sky-100/70 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeTab === "series" && (
                  <>
                    {/* SEO Content Section */}
                    <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
                      <p className="text-xs font-semibold tracking-[0.18em] text-amber-400">
                        8JJCRICKET · SERIES
                      </p>
                      <h1 className="mt-2 text-3xl font-bold text-white">
                        Cricket Series Schedule 2026 | 8jjcricket
                      </h1>
                      <p className="mt-2 text-sky-100/90">
                        Complete cricket tournament calendar for 2026 at
                        8jjcricket. Get match schedules, fixtures, dates, and
                        venues for IPL 2026, T20 World Cup, international tours,
                        Test series, and all domestic leagues. Updated daily
                        with the latest squad announcements and venue changes.
                      </p>
                    </div>

                    {/* FAQ Section */}
                    <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl p-6 shadow-2xl">
                      <h2 className="text-xl font-bold text-amber-300 mb-4">
                        Cricket Series Schedule - Frequently Asked Questions
                      </h2>

                      <div className="space-y-4">
                        <details className="group">
                          <summary className="cursor-pointer text-white font-medium hover:text-amber-300 transition-colors">
                            When does IPL 2026 start?
                          </summary>
                          <p className="mt-2 text-sky-100/80 text-sm pl-4">
                            IPL 2026 is scheduled to start in March/April 2026.
                            The exact opening match date will be announced by
                            BCCI. Check the complete IPL 2026 schedule at{" "}
                            <a
                              href="https://8jjcricket.com/series"
                              className="text-amber-300 hover:underline"
                            >
                              8jjcricket
                            </a>{" "}
                            with all match dates, venues, and timings as soon as
                            they're officially released.
                          </p>
                        </details>

                        <details className="group">
                          <summary className="cursor-pointer text-white font-medium hover:text-amber-300 transition-colors">
                            What are the upcoming India cricket series in 2026?
                          </summary>
                          <p className="mt-2 text-sky-100/80 text-sm pl-4">
                            India's cricket schedule for 2026 includes home Test
                            series, away tours to Australia/England, bilateral
                            ODI series, T20 World Cup 2026 participation, Asia
                            Cup, and IPL. Visit 8jjcricket series page for Team
                            India's complete fixture calendar with confirmed
                            dates and venues.
                          </p>
                        </details>

                        <details className="group">
                          <summary className="cursor-pointer text-white font-medium hover:text-amber-300 transition-colors">
                            Where can I find T20 World Cup 2026 schedule?
                          </summary>
                          <p className="mt-2 text-sky-100/80 text-sm pl-4">
                            T20 World Cup 2026 complete schedule with fixtures,
                            match dates, venues, team groups, and knockout stage
                            details is available at 8jjcricket. The tournament
                            schedule includes all group matches, Super 8s,
                            semi-finals, and the final.
                          </p>
                        </details>

                        <details className="group">
                          <summary className="cursor-pointer text-white font-medium hover:text-amber-300 transition-colors">
                            Which cricket series are happening in 2026?
                          </summary>
                          <p className="mt-2 text-sky-100/80 text-sm pl-4">
                            Major cricket series in 2026 include Indian Premier
                            League (IPL), ICC T20 World Cup, Asia Cup, India vs
                            Australia Test series, The Ashes, Pakistan Super
                            League (PSL), Big Bash League (BBL), Caribbean
                            Premier League (CPL), and numerous bilateral Test,
                            ODI, and T20I tours. Check 8jjcricket for the
                            complete 2026 international and domestic cricket
                            calendar.
                          </p>
                        </details>
                      </div>
                    </div>

                    {/* Series Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {sortedLeagues && sortedLeagues.length > 0 ? (
                        sortedLeagues.map((league) => {
                          const isActive = league.seasons?.some(
                            (s: any) => s.is_current,
                          );
                          return (
                            <div
                              key={league.id}
                              className={`rounded-2xl border p-6 hover:shadow-[0_20px_50px_rgba(251,191,36,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group relative cursor-pointer backdrop-blur-xl ${
                                isActive
                                  ? "border-amber-400/60 bg-slate-900/90 ring-2 ring-amber-400/20"
                                  : "border-white/20 bg-slate-900/80 hover:border-amber-400/40"
                              }`}
                            >
                              {isActive && (
                                <span className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 text-black text-xs font-bold rounded-full">
                                  LIVE
                                </span>
                              )}

                              <div className="w-16 h-16 mb-3 flex items-center justify-center rounded-xl">
                                {league.image_path ? (
                                  <img
                                    src={
                                      league.image_path ||
                                      "/images/series-placeholder.jpg"
                                    }
                                    alt={`${league.name} - Cricket Series at 8jjcricket`}
                                    className="max-w-full max-h-full object-contain rounded-xl"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "/images/series-placeholder.jpg";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-black font-bold text-xl shadow-lg">
                                    {league?.code
                                      ?.substring(0, 2)
                                      .toUpperCase()}
                                  </div>
                                )}
                              </div>

                              <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">
                                {league.name}
                              </h3>

                              <p className="text-xs text-amber-200/80 uppercase font-medium mb-3">
                                {league.code}
                              </p>

                              <div className="flex gap-2 mt-auto w-full">
                                <Link
                                  href={`/series/${league.sportmonks_league_id}`}
                                  className="flex-1 px-3 py-1.5 text-xs font-medium text-amber-300 border border-amber-400/50 rounded-xl hover:bg-amber-950/40 transition-colors backdrop-blur-sm"
                                  aria-label={`View ${league.name} details at 8jjcricket`}
                                >
                                  Details
                                </Link>
                                <Link
                                  href={`/teams?league=${league.sportmonks_league_id}`}
                                  className="flex-1 px-3 py-1.5 text-xs font-medium text-black bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 rounded-xl hover:brightness-110 transition-all shadow-lg"
                                  aria-label={`View ${league.name} teams`}
                                >
                                  Teams
                                </Link>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-full rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl p-8 text-center shadow-2xl">
                          <p className="text-sky-100/80">
                            No current or upcoming series found. Check back soon
                            for cricket series updates at 8jjcricket.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Breadcrumb Navigation */}
                    <nav aria-label="Breadcrumb" className="text-sm">
                      <ol
                        itemScope
                        itemType="https://schema.org/BreadcrumbList"
                        className="flex items-center space-x-2 text-sky-100/60"
                      >
                        <li
                          itemProp="itemListElement"
                          itemScope
                          itemType="https://schema.org/ListItem"
                        >
                          <Link
                            itemProp="item"
                            href="https://8jjcricket.com"
                            className="hover:text-amber-300"
                          >
                            <span itemProp="name">8jjcricket</span>
                          </Link>
                          <meta itemProp="position" content="1" />
                        </li>
                        <li className="before:content-['>'] before:mx-2">
                          <span itemProp="name">Cricket Series</span>
                          <meta itemProp="position" content="2" />
                        </li>
                      </ol>
                    </nav>
                  </>
                )}

                {/* Current Matches Tab */}
                {activeTab === "current" && (
                  <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl p-8 text-center shadow-2xl">
                    <svg
                      className="w-16 h-16 text-amber-300/50 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Live Matches
                    </h3>
                    <p className="text-sky-100/80">
                      Check the home page for live cricket matches at 8jjcricket
                    </p>
                    <Link
                      href="/"
                      className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-medium rounded-lg hover:brightness-110 transition-all shadow-lg"
                    >
                      View Live Matches
                    </Link>
                  </div>
                )}

                {/* Matches By Day Tab */}
                {activeTab === "byDay" && (
                  <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl p-8 text-center shadow-2xl">
                    <svg
                      className="w-16 h-16 text-amber-300/50 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Matches Schedule
                    </h3>
                    <p className="text-sky-100/80 mb-4">
                      View matches organized by date on the Recent and Upcoming
                      pages
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Link
                        href="/recent"
                        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        Recent Matches
                      </Link>
                      <Link
                        href="/upcoming"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Upcoming Matches
                      </Link>
                    </div>
                  </div>
                )}

                {/* Teams Tab */}
                {activeTab === "teams" && (
                  <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl p-8 text-center shadow-2xl">
                    <svg
                      className="w-16 h-16 text-amber-300/50 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Cricket Teams
                    </h3>
                    <p className="text-sky-100/80 mb-4">
                      Browse all international and domestic cricket teams
                    </p>
                    <Link
                      href="/teams"
                      className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      View All Teams
                    </Link>
                  </div>
                )}

                {/* Archive Tab */}
                {activeTab === "archive" && (
                  <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl p-8 text-center shadow-2xl">
                    <svg
                      className="w-16 h-16 text-amber-300/50 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-white mb-2">
                      Series Archive
                    </h3>
                    <p className="text-sky-100/80 mb-4">
                      Browse past cricket series and tournaments
                    </p>
                    <Link
                      href="/archive"
                      className="inline-block px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      View Archive
                    </Link>
                  </div>
                )}

                <PaginationComponet
                  page={page}
                  totalPages={totalPages}
                  onPage={onPage}
                />
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
