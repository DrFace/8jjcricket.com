"use client";

import useSWR from "swr";
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

function groupByGender(rankings: RankingEntry[], targetType: string) {
  const result = { men: [] as RankingTeam[], women: [] as RankingTeam[] };
  for (const entry of rankings) {
    if (!entry.team) continue;
    const type = entry.type?.toUpperCase() || "";
    if (!type.includes(targetType.toUpperCase())) continue;
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
  const { men, women } = groupByGender(rankings, "ODI");
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold mb-4">ICC ODI Team Rankings</h1>
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
          <div className="card text-gray-500 text-center">
            No women's rankings available
          </div>
        )}
      </div>
    </>
  );
}
