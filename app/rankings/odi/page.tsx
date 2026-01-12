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
 * ODIRankingsPage shows ICC ODI team rankings for men and women. It includes
 * SEO metadata via `<title>` and `<meta>` tags and corrects the navigation
 * label for the Test link.
 */
export default function ODIRankingsPage() {
  const { data, error, isLoading } = useSWR("/api/team-rankings", fetcher);
  const title = "ODI Team Rankings | 8jjcricket";
  const description = "ICC ODI team rankings for men and women teams.";

  const rankingTabs = [
    { label: "ODI", href: "odi", active: true },
    { label: "T20I", href: "t20i", active: false },
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
  const { men, women } = groupByGender(rankings, ["ODI"]);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1 overflow-visible">
          <div className="space-y-4 2xl:w-[75%] xl:w-[80%] lg:w-[95%] mx-auto px-4">
            <h1 className="text-lg font-extrabold mt-4">
              ICC ODI Team Rankings
            </h1>

            <div className="sticky top-[12%] left-0 right-0 z-50 backdrop-blur-sm ">
              <RankingsTabBar tabs={rankingTabs} />
            </div>

            {men.length > 0 ? (
              <RankingTable data={men} title="Men Rankings" />
            ) : (
              <div className="card text-gray-500 text-center">
                No men's rankings available
              </div>
            )}

            {women.length > 0 ? (
              <RankingTable data={women} title="Women Rankings" />
            ) : (
              <div className="card text-gray-500 text-center">
                No women's rankings available
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
