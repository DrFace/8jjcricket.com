"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import ErrorState from "@/components/ui/ErrorState";
import { PaginationComponet } from "@/components/ui/Pagination";
import { League } from "@/types/series";
import { ApiResponse, TabKey, TeamFromAPI } from "@/types/team";
import { HasValidImage } from "@/lib/teams";
import { PAGE_SIZE } from "@/lib/constant";
import TeamsCard from "@/components/TeamsCard";
import { FetchJson } from "@/lib/fetcher";

function parseLeagueParam(value: string | null): string | null {
  if (!value) return null;
  if (value === "null" || value === "undefined") return null;
  return value;
}

// Prefer validating against known leagues.
// Fallback: allow numeric IDs only (adjust if your IDs are not numeric).
function sanitizeLeagueId(
  raw: string | null,
  leagues: League[]
): string | null {
  if (!raw) return null;

  // Strict allow-list: only values present in leagues
  const exists = leagues.some((l) => String(l.id) === raw);
  if (exists) return raw;

  // Fallback strict pattern
  if (/^\d+$/.test(raw)) return raw;

  return null;
}

function isNationalTeam(team: TeamFromAPI): boolean {
  const v: unknown = (team as any)?.national_team;
  return v === true || v === 1 || v === "1" || v === "true";
}

function sortTeamsByImage(teams: TeamFromAPI[]): TeamFromAPI[] {
  // Avoid mutating original array
  return [...teams].sort(
    (a, b) => Number(HasValidImage(b)) - Number(HasValidImage(a))
  );
}

function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function totalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

function useTeamsData(leagueId: string | null) {
  const leaguesSWR = useSWR<ApiResponse<League[]>>("/api/leagues", FetchJson, {
    revalidateOnFocus: false,
  });

  const teamsSWR = useSWR<ApiResponse<any[]>>("/api/teams", FetchJson, {
    revalidateOnFocus: false,
  });

  const fixturesUrl = leagueId ? `/api/leagues/${leagueId}/fixtures` : null;
  const fixturesSWR = useSWR<ApiResponse<any[]>>(fixturesUrl, FetchJson, {
    revalidateOnFocus: false,
  });

  // Normalize teams once
  const allTeams: TeamFromAPI[] = useMemo(() => {
    const raw = teamsSWR.data?.data ?? [];
    return raw.map((t: any) => ({
      ...t,
      id: Number(t.team_id ?? t.id),
    }));
  }, [teamsSWR.data]);

  // Filter by league fixtures if leagueId is set
  const filteredTeams: TeamFromAPI[] = useMemo(() => {
    if (!leagueId) return allTeams;

    const fixtures = fixturesSWR.data?.data;
    if (!Array.isArray(fixtures)) return [];

    const teamIds = new Set<number>();
    for (const fx of fixtures) {
      if (fx?.localteam_id != null) teamIds.add(Number(fx.localteam_id));
      if (fx?.visitorteam_id != null) teamIds.add(Number(fx.visitorteam_id));
    }

    return allTeams.filter((t) =>
      teamIds.has(Number((t as any).sportmonks_team_id))
    );
  }, [allTeams, fixturesSWR.data, leagueId]);

  return {
    leagues: leaguesSWR.data?.data ?? [],
    leaguesLoading: leaguesSWR.isLoading,
    teamsLoading: teamsSWR.isLoading,
    teamsError: teamsSWR.error,
    teams: filteredTeams,
  };
}

export default function TeamsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leagueParamRaw = parseLeagueParam(searchParams.get("league"));

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [pageIntl, setPageIntl] = useState(1);
  const [pageDom, setPageDom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  // Load leagues + teams; leagueId validated after leagues are known
  const { leagues, leaguesLoading, teamsLoading, teamsError, teams } =
    useTeamsData(null);

  const leagueId = useMemo(
    () => sanitizeLeagueId(leagueParamRaw, leagues),
    [leagueParamRaw, leagues]
  );

  // Re-run data hook with validated leagueId
  const data = useTeamsData(leagueId);

  // Reset tab + pages when query changes
  useEffect(() => {
    setActiveTab("all");
    setPageIntl(1);
    setPageDom(1);
  }, [leagueId]);

  const national = useMemo(
    () => sortTeamsByImage(data.teams.filter(isNationalTeam)),
    [data.teams]
  );

  const domestic = useMemo(
    () => sortTeamsByImage(data.teams.filter((t) => !isNationalTeam(t))),
    [data.teams]
  );

  const visibleNational = useMemo(
    () => (activeTab === "domestic" ? [] : national),
    [activeTab, national]
  );

  const visibleDomestic = useMemo(
    () => (activeTab === "international" ? [] : domestic),
    [activeTab, domestic]
  );

  const visibleTeamsCount = visibleNational.length + visibleDomestic.length;

  const intlPages = totalPages(visibleNational.length, PAGE_SIZE);
  const domPages = totalPages(visibleDomestic.length, PAGE_SIZE);

  const pagedInternational = useMemo(
    () => paginate(visibleNational, pageIntl, PAGE_SIZE),
    [visibleNational, pageIntl]
  );

  const pagedDomestic = useMemo(
    () => paginate(visibleDomestic, pageDom, PAGE_SIZE),
    [visibleDomestic, pageDom]
  );

  const onLeagueChange = useCallback(
    (value: string) => {
      if (value === "all") router.push("/teams");
      else router.push(`/teams?league=${encodeURIComponent(value)}`);
    },
    [router]
  );

  const goBack = useCallback(() => router.back(), [router]);

  useEffect(() => {
    setIsLoading(data.teamsLoading || data.leaguesLoading);
  }, [data.teamsLoading, data.leaguesLoading]);

  const showError = Boolean(data.teamsError) && !leagueId; // align with your previous logic

  return (
    <>
      {/* Prefer Next.js metadata in app router; kept here to match your current approach */}
      <title>
        Cricket Teams - All International & Domestic Teams | 8jjcricket
      </title>
      <meta
        name="description"
        content="Explore cricket teams from around the world. Filter by series and leagues including ODI, T20I, Test, IPL, and more. View international and domestic cricket teams."
      />

      <div className="min-h-screen flex flex-col">
        <TopNav />
        <BottomNav />

        <main className="flex-1">
          {showError ? (
            <div className="space-y-6 2xl:w-[75%] xl:w-[80%] lg:w-[95%] mx-auto h-min-80">
              <ErrorState message="Failed to load teams. Please try again later." />
            </div>
          ) : isLoading ? (
            <div className="space-y-6 2xl:w-[75%] xl:w-[80%] lg:w-[95%] mx-auto h-min-80">
              <div className="h-24 bg-slate-900/80 border border-white/20 rounded-3xl animate-pulse backdrop-blur-xl" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-900/80 border border-white/20 rounded-2xl animate-pulse backdrop-blur-xl"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 2xl:w-[75%] xl:w-[80%] lg:w-[95%] mx-auto h-min-80">
              {/* Header */}
              <div className="rounded-3xl border border-india-gold/40 bg-gradient-to-br from-india-charcoal via-india-maroon/20 to-india-blue/30 p-6 md:p-8 shadow-2xl backdrop-blur-xl mt-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={goBack}
                      className="flex items-center justify-center w-10 h-10 bg-black/40 hover:bg-india-gold/60 border border-india-gold/30 rounded-full transition-all duration-300 hover:scale-110 group shadow-lg backdrop-blur-sm flex-shrink-0"
                      aria-label="Go back"
                      type="button"
                    >
                      <svg
                        className="w-5 h-5 text-india-gold group-hover:-translate-x-0.5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <div>
                      <p className="text-xs font-bold tracking-[0.18em] text-india-gold mb-1">
                        8JJCRICKET · TEAMS
                      </p>
                      <h1 className="text-2xl md:text-3xl font-bold text-white india-header-text">
                        Cricket Teams
                      </h1>
                      <p className="text-sky-100/80 text-sm md:text-base mt-1">
                        Browse teams by series and leagues
                      </p>
                    </div>
                  </div>

                  {/* Dropdown */}
                  <div className="w-full lg:w-auto">
                    <div className="relative">
                      <select
                        id="league-select"
                        value={leagueId ?? "all"}
                        onChange={(e) => onLeagueChange(e.target.value)}
                        className="w-full lg:w-80 pl-4 pr-10 py-3.5 bg-black/40 border border-white/20 rounded-xl shadow-sm text-india-gold font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-india-gold/50 transition-all duration-200 cursor-pointer hover:bg-black/60 backdrop-blur-sm appearance-none"
                      >
                        <option value="all" className="bg-slate-900">
                          All Teams - All Series/Leagues
                        </option>
                        <option disabled className="bg-slate-900">
                          ────────────────────────────
                        </option>
                        {data.leagues.map((league) => (
                          <option
                            key={league.id}
                            value={String(league.id)}
                            className="bg-slate-900"
                          >
                            {league.name} - {league.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 items-center">
                {(
                  [
                    { key: "all", label: `All (${data.teams.length})` },
                    {
                      key: "international",
                      label: `International (${national.length})`,
                    },
                    { key: "domestic", label: `Domestic (${domestic.length})` },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all
                    ${
                      activeTab === tab.key
                        ? "bg-india-saffron/20 border-india-saffron/60 text-india-gold shadow-lg shadow-india-saffron/20"
                        : "bg-black/30 border-white/10 text-slate-300 hover:text-white hover:border-india-gold/40"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Empty state */}
              {visibleTeamsCount === 0 && leagueId ? (
                <div className="rounded-2xl border border-india-gold/30 bg-gradient-to-br from-slate-900/90 via-india-charcoal/80 to-india-blue/20 backdrop-blur-xl p-12 text-center shadow-2xl">
                  <p className="text-2xl font-bold text-white mb-3">
                    No Teams Data Available
                  </p>
                  <button
                    onClick={() => router.push("/teams")}
                    className="px-6 py-3 bg-gradient-to-r from-india-saffron via-india-gold to-india-orange text-black font-bold rounded-lg shadow-lg hover:brightness-110 transition-all"
                    type="button"
                  >
                    View All Cricket Teams Instead
                  </button>
                </div>
              ) : (
                <>
                  {/* International */}
                  {visibleNational.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-5">
                        <h2 className="text-xl md:text-2xl font-bold text-india-gold india-header-text">
                          International Teams
                        </h2>
                        <span className="px-3 py-1.5 text-india-gold text-xs font-bold rounded-full border border-india-gold/40 shadow-lg bg-india-gold/10">
                          {pagedInternational.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {pagedInternational.map((t) => (
                          <TeamsCard key={t.id} team={t} />
                        ))}
                      </div>

                      <PaginationComponet
                        page={pageIntl}
                        totalPages={intlPages}
                        onPage={setPageIntl}
                      />
                    </section>
                  )}

                  {/* Domestic */}
                  {visibleDomestic.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-5">
                        <h2 className="text-xl md:text-2xl font-bold text-india-gold india-header-text">
                          Domestic Teams
                        </h2>
                        <span className="px-3 py-1.5 text-india-gold text-xs font-bold rounded-full border border-india-gold/40 shadow-lg bg-india-gold/10">
                          {pagedDomestic.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {pagedDomestic.map((t) => (
                          <TeamsCard key={t.id} team={t} />
                        ))}
                      </div>

                      <PaginationComponet
                        page={pageDom}
                        totalPages={domPages}
                        onPage={setPageDom}
                      />
                    </section>
                  )}
                </>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
