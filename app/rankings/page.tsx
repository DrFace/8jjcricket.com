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
            <div className="card text-red-400 p-4 border border-red-500/30 rounded-xl bg-slate-900/50 backdrop-blur-sm">
              Failed to load team rankings. Please try again later.
            </div>
          )}

          {/* Success State */}
          {data && (
            <div className="space-y-8">
              <header className="mb-6 rounded-3xl border border-india-gold/40 bg-gradient-to-br from-india-charcoal via-india-maroon/20 to-india-blue/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
                <h1 className="text-2xl font-bold text-white india-header-text">
                  ICC Team Rankings
                </h1>
                <p className="mt-1 text-xs font-bold tracking-[0.18em] text-india-gold">
                  Official team rankings across all formats.
                </p>
              </header>

              {sortedTypes.map((type) => {
                const teams = groups[type];
                return (
                  <div
                    key={type}
                    className="overflow-x-auto bg-slate-900/50 rounded-xl border border-india-gold/20 p-4 backdrop-blur-xl shadow-lg"
                  >
                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-india-gold border-b border-india-gold/20 pb-2">
                       {type} Rankings
                    </h2>
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-gradient-to-r from-india-saffron via-india-gold to-india-orange text-black shadow-md rounded-t-lg">
                        <tr>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider rounded-tl-lg">
                            Pos
                          </th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider">
                            Team
                          </th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider">
                            Matches
                          </th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider">
                            Points
                          </th>
                          <th className="px-4 py-3 font-bold uppercase tracking-wider rounded-tr-lg">
                            Rating
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-200">
                        {teams.map((t, index) => (
                          <tr
                            key={t.id}
                            className={`hover:bg-white/5 transition-colors ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}
                          >
                            <td className="px-4 py-3 font-bold text-india-gold">
                              {t.ranking.position}
                            </td>
                            <td className="px-4 py-3 flex items-center gap-3">
                              {t.image_path && (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white/5 p-1">
                                  <Image
                                    src={t.image_path}
                                    alt={t.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <span className="font-semibold text-white">{t.name}</span>
                            </td>
                            <td className="px-4 py-3 text-sky-100/80">
                              {t.ranking.matches}
                            </td>
                            <td className="px-4 py-3 text-sky-100/80">
                              {t.ranking.points}
                            </td>
                            <td className="px-4 py-3 text-india-saffron font-bold text-base">
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
