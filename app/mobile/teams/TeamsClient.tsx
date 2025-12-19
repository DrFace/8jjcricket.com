"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";

interface TeamFromAPI {
  id: number;
  name: string;
  code: string;
  image_path: string;
  country_id: number;
  national_team: boolean;
}

interface League {
  id: number;
  name: string;
  code: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TeamsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const leagueParam = searchParams.get("league");

  const [selectedLeague, setSelectedLeague] = useState<string>("all");

  useEffect(() => {
    if (leagueParam && leagueParam !== "null" && leagueParam !== "undefined") {
      setSelectedLeague(leagueParam);
    } else {
      setSelectedLeague("all");
    }
  }, [leagueParam]);

  const { data: leaguesData } = useSWR("/api/leagues", fetcher);
  const leagues: League[] = leaguesData?.data ?? [];

  const { data: teamsData, isLoading } = useSWR("/api/teams", fetcher);
  const allTeams: TeamFromAPI[] = teamsData?.data ?? [];

  const isValidSelection =
    selectedLeague !== "all" &&
    selectedLeague !== "null" &&
    selectedLeague !== "undefined";

  const fixturesUrl = isValidSelection
    ? `/api/leagues/${selectedLeague}/fixtures`
    : null;

  const { data: fixturesData } = useSWR(fixturesUrl, fetcher);

  let teams = allTeams;

  if (isValidSelection && fixturesData?.data) {
    const teamIds = new Set<number>();
    fixturesData.data.forEach((f: any) => {
      if (f.localteam_id) teamIds.add(f.localteam_id);
      if (f.visitorteam_id) teamIds.add(f.visitorteam_id);
    });
    teams = allTeams.filter((t) => teamIds.has(t.id));
  }

  const national = teams.filter((t) => t.national_team);
  const domestic = teams.filter((t) => !t.national_team).slice(0, 30);

  if (isLoading) {
    return <div className="h-40 animate-pulse bg-slate-900/80 rounded-xl" />;
  }

  return (
    <>
      <BottomNav />

      <div className="space-y-8 pb-8">
        {/* Header */}
        <div className="rounded-3xl border border-amber-400/40 bg-slate-900/90 p-6 shadow-2xl">
          <h1 className="text-3xl font-bold text-white">Cricket Teams</h1>
          <p className="text-sky-200 mt-1">
            Browse teams by series and leagues
          </p>

          <select
            value={selectedLeague}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedLeague(value);
              value === "all"
                ? router.push("/mobile/teams")
                : router.push(`/mobile/teams?league=${value}`);
            }}
            className="mt-4 w-full md:w-80 bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-amber-200"
          >
            <option value="all">All Teams</option>
            {leagues.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.code})
              </option>
            ))}
          </select>
        </div>

        {/* International Teams */}
        {national.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-amber-300 mb-4">
              International Teams ({national.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {national.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl border border-amber-400/30 bg-slate-900/80 p-3 shadow-lg opacity-90 cursor-default"
                >
                  <Image
                    src={t.image_path}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-semibold text-white">{t.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Domestic Teams */}
        {domestic.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-amber-300 mb-4">
              Domestic Teams ({domestic.length})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {domestic.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl border border-white/20 bg-slate-900/70 p-3 shadow-md opacity-80 cursor-default"
                >
                  <Image
                    src={t.image_path}
                    alt={t.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <span className="text-white font-medium truncate">
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
