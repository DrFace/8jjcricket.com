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

  const rankings: RankingEntry[] = data?.data ?? [];
  const { men, women } = groupByGender(rankings, ["ODI"]);
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
                <h1 className="m-h">ICC ODI Team Rankings</h1>
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
          )}{" "}
        </main>
      </div>
    </>
  );
}
