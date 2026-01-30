import Image from "next/image";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";

// 1. IMPORT SEO DATA
import { rankingsMetadata, rankingsJsonLd } from "@/components/seo/RankingsSeo";

// 2. EXPORT METADATA (Works because this is a Server Component)
export const metadata = rankingsMetadata;

// --- TYPES ---
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

// --- DATA FETCHING ---
async function getRankings() {
  // Use the full URL for server-side fetching
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://72.60.107.98:8001/api";

  try {
    const res = await fetch(`${baseUrl}/team-rankings`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error("Rankings API Error:", res.status);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Rankings Fetch Failed:", error);
    return null;
  }
}

// --- MAIN COMPONENT ---
export default async function RankingsPage() {
  const data = await getRankings();
  const rankings: RankingEntry[] = data?.data ?? [];

  // Group by ranking type
  const groups: Record<string, RankingTeam[]> = {};
  for (const r of rankings) {
    if (!r.team) continue;
    groups[r.type] = r.team;
  }

  // Sort: Test, ODI, T20, then others
  const sortedTypes = Object.keys(groups).sort((a, b) => {
    const order = ["TEST", "ODI", "T20", "T20I"];
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return (
    <>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rankingsJsonLd) }}
      />

      <div className="min-h-screen flex flex-col">
        <TopNav />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          {/* Error State if data failed */}
          {!data && (
            <div className="card text-red-400 p-4 border border-red-500/30 rounded-xl bg-slate-900/50">
              Failed to load team rankings. Please try again later.
            </div>
          )}

          {/* Success State */}
          {data && (
            <div className="space-y-8">
              <h1 className="text-2xl font-semibold mb-4 text-white">
                ICC Team Rankings
              </h1>

              {sortedTypes.map((type) => {
                const teams = groups[type];
                return (
                  <div
                    key={type}
                    className="overflow-x-auto bg-slate-900/50 rounded-xl border border-white/10 p-4 backdrop-blur-sm"
                  >
                    <h2 className="text-xl font-semibold mb-4 capitalize text-amber-300">
                      {type} Rankings
                    </h2>
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-white/5 text-slate-300">
                        <tr>
                          <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                            Pos
                          </th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                            Team
                          </th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                            Matches
                          </th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                            Points
                          </th>
                          <th className="px-4 py-3 font-semibold uppercase tracking-wider">
                            Rating
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-200">
                        {teams.map((t) => (
                          <tr
                            key={t.id}
                            className="hover:bg-white/5 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-white">
                              {t.ranking.position}
                            </td>
                            <td className="px-4 py-3 flex items-center gap-3">
                              {t.image_path && (
                                <Image
                                  src={t.image_path}
                                  alt={t.name}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              )}
                              <span>{t.name}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-400">
                              {t.ranking.matches}
                            </td>
                            <td className="px-4 py-3 text-slate-400">
                              {t.ranking.points}
                            </td>
                            <td className="px-4 py-3 text-amber-400 font-bold">
                              {t.ranking.rating}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <Footer />
        <BottomNav />
      </div>
    </>
  );
}
