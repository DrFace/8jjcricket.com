"use client";

import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import RankingTabBar from "@/components/RankingTabBar";
import RankingTable from "@/components/mobile/RankingTable";

interface RankingTeam {
  id: number;
  name: string;
  code: string;
  image_path: string;
  ranking: {
    position: number;
    matches: number;
    points: number;
    rating: number;
  };
}
interface RankingEntry {
  resource: string;
  type: string;
  team: RankingTeam[];
}
const fetcher = (url: string) => fetch(url).then((r) => r.json());

function groupByGender(rankings: RankingEntry[], targetTypes: string[]) {
  const result = { men: [] as RankingTeam[], women: [] as RankingTeam[] };
  for (const entry of rankings) {
    if (!entry.team) continue;
    const type = entry.type?.toUpperCase() || "";
    const matchesType = targetTypes.some((t) => type.includes(t.toUpperCase()));
    if (!matchesType) continue;
    const resource = entry.resource?.toLowerCase() || "";
    const isWomen = resource.includes("women") || resource.includes("female");
    if (isWomen) {
      result.women = entry.team;
    } else {
      result.men = entry.team;
    }
  }
  return result;
}

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

  if (error) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">
          Failed to load team rankings.
          {typeof error === "string" ? ` ${error}` : ""}
        </div>
      </>
    );
  }
  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card animate-pulse">Loading rankings…</div>
      </>
    );
  }
  const rankings: RankingEntry[] = data?.data ?? [];
  const { men, women } = groupByGender(rankings, ["T20I", "T20"]);
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold mb-4">ICC T20I Team Rankings</h1>
        <RankingTabBar tabs={rankingTabs} />
        {men.length > 0 ? (
          <RankingTable
            data={men}
            title="Men Rankings"
            onViewAll={() =>
              console.log("View All need to change this function")
            }
          />
        ) : (
          <div className="card text-gray-500">No men's rankings available</div>
        )}
        {women.length > 0 ? (
          <RankingTable
            data={women}
            title="Women Rankings"
            onViewAll={() =>
              console.log("View All need to change this function")
            }
          />
        ) : (
          <div className="card text-gray-500">No women's rankings available</div>
        )}
      </div>
    </>
  );
}
