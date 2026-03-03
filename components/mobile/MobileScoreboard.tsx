// components/Scoreboard.tsx
"use client";

import useSWR from "swr";
import { useMemo } from "react";
import { formatDate } from "@/lib/utils";
import TeamBadge from "@/components/TeamBadge";
import { useTeams } from "@/hooks/useTeams";
import { usePlayers } from "@/hooks/usePlayers";
import MobileScoreBadge from "./MobileScoreBadge";
import BattingTable from "./BattingTable";
import BowlingTable from "./BowlingTable";
import LoadingSkeleton from "../ui/LoadingSkeleton";

const fetcher = async (u: string) => {
  const res = await fetch(u, { headers: { Accept: "application/json" } });
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Bad JSON (${res.status}) ${text.slice(0, 160)}`);
  }
  if (!res.ok || json?.error)
    throw new Error(json?.error || `HTTP ${res.status}`);
  return json;
};

type AnyRow = Record<string, any>;

export default function MobileScoreboard({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR(`/api/match/${id}`, fetcher, {
    refreshInterval: 15000,
  });
  const fx = data?.data;

  // Arrays
  const runs: AnyRow[] = (fx?.runs as any[] | undefined) ?? [];
  const batting: AnyRow[] = (fx?.batting as any[] | undefined) ?? [];
  const bowling: AnyRow[] = (fx?.bowling as any[] | undefined) ?? [];

  // Build team ids
  const teamIds = useMemo(() => {
    const ids = [
      fx?.localteam_id,
      fx?.visitorteam_id,
      ...runs.map((r) => r.team_id),
      ...batting.map((b) => b.team_id),
      ...bowling.map((b) => b.team_id),
    ].filter(Boolean) as number[];
    return Array.from(new Set(ids));
  }, [fx?.localteam_id, fx?.visitorteam_id, runs, batting, bowling]);

  // Build player ids (ensure numeric)
  const playerIds = useMemo(() => {
    const ids = [
      ...batting.map((b) => Number(b.player_id)),
      ...bowling.map((b) => Number(b.player_id)),
    ].filter((id) => !!id && !Number.isNaN(id)) as number[];
    return Array.from(new Set(ids));
  }, [batting, bowling]);

  const { teams } = useTeams(teamIds);
  const { players } = usePlayers(playerIds);

  if (error) {
    return (
      <div className="card">
        Failed to load scoreboard.{" "}
        <span className="text-xs text-gray-500">
          {String((error as any).message)}
        </span>
      </div>
    );
  }

  if (isLoading) return <LoadingSkeleton num={3} col={1} />;
  if (!fx) return <div className="card">No data.</div>;

  // ✅ Merge: keep fixture images (`image_path`) even if hook objects are lean
  const home = {
    ...(fx?.localteam ?? {}),
    ...(teams.get(fx.localteam_id) ?? {}),
  };
  const away = {
    ...(fx?.visitorteam ?? {}),
    ...(teams.get(fx.visitorteam_id) ?? {}),
  };

  // Normalize for TeamBadge (ensures a `logo` key)
  const toBadgeTeam = (t: any) =>
    t
      ? {
          ...t,
          logo: t.logo ?? t.logo_url ?? t.image_path ?? t.image?.path ?? "",
        }
      : undefined;

  const homeBadge = toBadgeTeam(home);
  const awayBadge = toBadgeTeam(away);

  // Player name resolver (similar idea to WP $get_player_name)
  const nameFor = (row: any) => {
    const pid = row.player_id ? Number(row.player_id) : undefined;
    const live = pid ? players.get(pid)?.fullname : undefined;
    return (
      live ??
      row.player_name ??
      row.fullname ??
      row.firstname ??
      row.player?.fullname ??
      row.player?.firstname ??
      (pid ? `Player ${pid}` : "—")
    );
  };

  // Group rows by team
  const byTeam = <T extends AnyRow>(rows: T[]) =>
    rows.reduce<Record<number, T[]>>((acc, r) => {
      const tid = r.team_id;
      if (!tid) return acc;
      if (!acc[tid]) acc[tid] = [];
      acc[tid].push(r);
      return acc;
    }, {});

  const batByTeam = byTeam(batting);
  const bowlByTeam = byTeam(bowling);

  const teamForId = (tid?: number) =>
    tid
      ? (teams.get(tid) ??
        (tid === fx.localteam_id
          ? home
          : tid === fx.visitorteam_id
            ? away
            : undefined))
      : undefined;

  const tossTeam =
    fx.toss_won_team_id === fx.localteam_id
      ? home
      : fx.toss_won_team_id === fx.visitorteam_id
        ? away
        : teamForId(fx.toss_won_team_id);

  return (
    <div className="space-y-6">
      {/* League + header */}
      <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 p-3 shadow-2xl backdrop-blur-xl">
        <h2 className="text-center text-xl font-semibold text-amber-300 mb-3">
          {fx.league?.name || "Twenty20 International" /* fallback */}
        </h2>

        <div className="flex items-center justify-between gap-4 my-2">
          <div className="">
            <MobileScoreBadge team={homeBadge} />
          </div>
          <div className="text-amber-300 font-semibold">
            <p className="text-sm text-center mb-3"> VS</p>
            <p className="text-sm text-center">
              <strong>{fx.status || "—"}</strong>
            </p>
          </div>
          <div className="">
            <MobileScoreBadge team={awayBadge} />
          </div>
        </div>

        <p className="text-sm text-center">
          {fx.note ? <span className="text-gray-300 "> {fx.note}</span> : null}
        </p>
        <div className="">
          {(fx.toss_won_team_id || fx.elected) && (
            <div className="mt-2 rounded-2xl bg-amber-900 px-3 py-2 text-sm">
              <strong>Toss:</strong>
              {tossTeam?.name ||
                tossTeam?.short_name ||
                (fx.toss_won_team_id ? `Team ${fx.toss_won_team_id}` : "—")}
              {fx.elected ? (
                <>
                  won the toss and chose to
                  <span className="font-medium text-amber-300">
                    {String(fx.elected).toLowerCase()}
                  </span>
                  first.
                </>
              ) : null}
            </div>
          )}

          <p className="text-xs text-gray-300 mt-2 text-center">
            {fx.round || "—"} · {formatDate(fx.starting_at)}
          </p>
        </div>
      </div>

      {/* Innings Summary */}
      {runs.length > 0 && (
        <div className="">
          <h3 className="font-semibold text-amber-300 mb-2">Innings Summary</h3>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            {runs.map((inn) => {
              const t = teamForId(inn.team_id);
              const label =
                t?.short_name ||
                t?.name ||
                (inn.team_id === fx.localteam_id
                  ? home?.short_name || home?.name
                  : inn.team_id === fx.visitorteam_id
                    ? away?.short_name || away?.name
                    : `Team ${inn.team_id}`);

              return (
                <div
                  key={inn.id ?? `${inn.team_id}-${inn.inning}`}
                  className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 p-6 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <TeamBadge size={50} team={toBadgeTeam(t)} hideName />
                      <div className="font-medium">{label}</div>
                    </div>
                    <div className="text-xs text-gray-300">
                      Inn {inn.inning ?? "—"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-300 mt-0.5">
                      PP1 {inn.pp1 ?? "—"} · PP2 {inn.pp2 ?? "—"}
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {inn.score ?? "–"}/{inn.wickets ?? "–"} (
                      {inn.overs ?? "–"} ov)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Per-team sections */}
      {(
        [
          { id: fx.localteam_id, label: home?.name || home?.short_name },
          { id: fx.visitorteam_id, label: away?.name || away?.short_name },
        ] as const
      )
        .filter((t) => t.id)
        .map((team) => {
          const tid = team.id as number;
          const teamObj = teamForId(tid);
          const bats = batByTeam[tid] ?? [];
          const bowls = bowlByTeam[tid] ?? [];

          return (
            <div key={tid} className="space-y-4">
              {/* Batting */}
              <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 p-6 shadow-2xl backdrop-blur-xl">
                <h3 className="font-semibold mb-2">
                  {teamObj?.short_name ||
                    teamObj?.name ||
                    team.label ||
                    `Team ${tid}`}{" "}
                  Batting
                </h3>
                <BattingTable data={bats} players={players} teamId={tid} />
              </div>

              {/* Bowling */}
              <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 p-6 shadow-2xl backdrop-blur-xl">
                <h3 className="font-semibold mb-2">
                  {teamObj?.short_name ||
                    teamObj?.name ||
                    team.label ||
                    `Team ${tid}`}{" "}
                  Bowling
                </h3>
                <BowlingTable data={bowls} players={players} teamId={tid} />
              </div>
            </div>
          );
        })}
    </div>
  );
}
