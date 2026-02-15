"use client";

import useSWR from "swr";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import RankingTable from "@/components/mobile/RankingTable";
import { groupByGender } from "@/src/utils/groupByGender";
import { RankingEntry } from "@/types/rankings";
import RankingsTabBar from "@/components/RankingsTabBar";

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

  if (error) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="min-h-screen flex flex-col">
          <TopNav />
          <main className="flex-1">
            <div className="card">
              Failed to load team rankings.
              {typeof error === "string" ? ` ${error}` : ""}
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="min-h-screen flex flex-col">
          <TopNav />
          <main className="flex-1">
            <div className="card animate-pulse">Loading rankings…</div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const rankings: RankingEntry[] = data?.data ?? [];
  const { men, women } = groupByGender(rankings, ["T20I", "T20"]);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1">
          <div className="space-y-6 2xl:w-[75%] xl:w-[80%] lg:w-[95%] mx-auto px-4 py-8">
            <header className="rounded-3xl border border-india-gold/40 bg-gradient-to-br from-india-charcoal via-india-maroon/20 to-india-blue/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
              <h1 className="text-2xl font-bold text-white india-header-text">
                ICC T20I Team Rankings
              </h1>
              <p className="mt-1 text-xs font-bold tracking-[0.18em] text-india-gold">
                Official T20I standings for Men and Women.
              </p>
            </header>

            <div className="sticky top-20 z-40 backdrop-blur-xl bg-slate-900/50 rounded-xl border border-white/10 p-2 shadow-lg">
              <RankingsTabBar tabs={rankingTabs} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {men.length > 0 ? (
                <div className="rounded-2xl border border-india-gold/20 bg-slate-900/40 p-1 backdrop-blur-md">
                   <RankingTable data={men} title="Men Rankings" />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
                  No men's rankings available
                </div>
              )}

              {women.length > 0 ? (
                <div className="rounded-2xl border border-india-gold/20 bg-slate-900/40 p-1 backdrop-blur-md">
                   <RankingTable data={women} title="Women Rankings" />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
                  No women's rankings available
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
