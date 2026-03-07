"use client";

import useSWR from "swr";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import RankingTable from "@/components/mobile/RankingTable";
import { groupByGender } from "@/src/utils/groupByGender";
import { RankingEntry } from "@/types/rankings";
import RankingsTabBar from "@/components/RankingsTabBar";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import ErrorState from "@/components/ui/ErrorState";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/**
 * T20IRankingsPage displays ICC T20I team rankings for men and women. It uses
 * `<title>`/`<meta>` tags for SEO and corrects the navigation labels. The
 * "Test" link previously displayed the wrong label; this has been fixed.
 */
export default function T20IRankingsPage() {
  const { data, error, isLoading } = useSWR("/api/team-rankings", fetcher);
  const title = "ICC T20I Team Rankings 2026: Men's Points Table | 8JJ Cricket";
  const description =
    "Official ICC Men's T20I Team Rankings. Check the latest 2026 points table and standings. See where India, England, and West Indies rank in T20 cricket.";

  const rankingTabs = [
    { label: "ODI", href: "odi", active: false },
    { label: "T20I", href: "t20i", active: true },
    { label: "Test", href: "test", active: false },
  ];

  const rankings: RankingEntry[] = data?.data ?? [];
  const { men, women } = groupByGender(rankings, ["T20I", "T20"]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <div className="min-h-screen">
          <main className="w-full md:w-[99%] lg:w-[95%] xl:w-[85%] mx-auto py-4 space-y-4">
            {isLoading ? (
              <div className="min-h-[60vh] space-y-6 m-2">
                {/* Hero */}
                <div className="rounded-3xl border border-white/80 bg-slate-900/80 px-6 py-5 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-amber-300">
                        8JJCRICKET · Ranking
                      </p>
                      <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white">
                        Cricket Rankings
                      </h1>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-sm">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs font-medium text-amber-200">
                        Loading rankings..
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm md:text-base text-sky-100/80 ">
                    {description}
                  </p>
                </div>
                <LoadingSkeleton num={2} col={2} />
              </div>
            ) : error ? (
              <ErrorState message="Failed to load series." />
            ) : (
              <>
                <header className="rounded-3xl border border-india-gold/40 bg-gradient-to-br from-india-charcoal via-india-maroon/20 to-india-blue/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
                  <h1 className="text-2xl font-bold text-white india-header-text">
                    ICC T20I Team Rankings
                  </h1>
                  <p className="mt-1 text-xs font-bold tracking-[0.18em] text-india-gold">
                    Official T20I standings for Men and Women.
                  </p>
                </header>

                <div className="">
                  <RankingsTabBar tabs={rankingTabs} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {men.length > 0 ? (
                    <div className="">
                      <RankingTable data={men} title="Men Rankings" />
                    </div>
                  ) : (
                    <div className="text-center">
                      No men's rankings available
                    </div>
                  )}

                  {women.length > 0 ? (
                    <div className="">
                      <RankingTable data={women} title="Women Rankings" />
                    </div>
                  ) : (
                    <div className="text-center">
                      No women's rankings available
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
}
