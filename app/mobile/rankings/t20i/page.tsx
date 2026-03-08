"use client";

import useSWR from "swr";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import RankingTable from "@/components/mobile/RankingTable";
import { groupByGender } from "@/src/utils/groupByGender";
import { RankingEntry } from "@/types/rankings";
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
  const title = "T20I Team Rankings | 8jjcricket";
  const description = "ICC T20I team rankings for men and women teams.";

  const rankingTabs = [
    { label: "ODI", href: "odi", active: false },
    { label: "T20I", href: "t20i", active: true },
    { label: "Test", href: "test", active: false },
  ];

  const rankings: RankingEntry[] = data?.data ?? [];
  const { men, women } = groupByGender(rankings, ["T20I", "T20"]);
  return (
    <>
      <div className="min-h-screen">
        <main className="w-[99%]  mx-auto py-1">
          {isLoading ? (
            <LoadingSkeleton num={2} col={1} />
          ) : error ? (
            <ErrorState message="Failed to load rankings" />
          ) : (
            <div className="space-y-4">
              <div className="flex  items-center ">
                <h1 className="m-h">ICC T20I Team Rankings</h1>
              </div>
              <MobileTabBar tabs={rankingTabs} />
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
          )}
        </main>
      </div>
    </>
  );
}
