// components/Scoreboard.tsx
"use client";

import useSWR from "swr";
import { useMemo } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import TeamBadge from "@/components/TeamBadge";
import { useTeams } from "@/hooks/useTeams";
import { usePlayers } from "@/hooks/usePlayers";

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
  const { data, error, isLoading } = useSWR(`/api/fixture/${id}`, fetcher, {
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
  if (isLoading)
    return <div className="card animate-pulse">Loading scoreboard…</div>;
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
      ? teams.get(tid) ??
        (tid === fx.localteam_id
          ? home
          : tid === fx.visitorteam_id
          ? away
          : undefined)
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
      <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="text-center text-xl font-semibold text-amber-300 mb-3">
          {fx.league?.name || "Twenty20 International" /* fallback */}
        </h2>

        <div className="flex items-center justify-center gap-5 mb-3">
          <div className="flex flex-col items-center gap-1">
            <TeamBadge team={homeBadge} />
            <div className="text-sm font-medium">
              {home?.short_name || home?.name || `Team ${fx.localteam_id}`}
            </div>
          </div>
          <div className="text-xs text-gray-500">VS</div>
          <div className="flex flex-col items-center gap-1">
            <TeamBadge team={awayBadge} />
            <div className="text-sm font-medium">
              {away?.short_name || away?.name || `Team ${fx.visitorteam_id}`}
            </div>
          </div>
        </div>

        <p className="text-sm">
          <strong>{fx.status || "—"}</strong>
          {fx.note ? (
            <span className="text-gray-700"> — {fx.note}</span>
          ) : null}{" "}
        </p>

        {(fx.toss_won_team_id || fx.elected) && (
          <div className="mt-2 rounded-2xl bg-amber-900 px-3 py-2 text-sm">
            <strong>Toss:</strong>{" "}
            {tossTeam?.name ||
              tossTeam?.short_name ||
              (fx.toss_won_team_id ? `Team ${fx.toss_won_team_id}` : "—")}
            {fx.elected ? (
              <>
                {" "}
                won the toss and chose to{" "}
                <span className="font-medium">
                  {String(fx.elected).toLowerCase()}
                </span>{" "}
                first.
              </>
            ) : null}
          </div>
        )}

        <p className="text-xs text-gray-600 mt-2">
          {fx.round || "—"} · {formatDate(fx.starting_at)}
        </p>
      </div>

      {/* Innings Summary */}
      {runs.length > 0 && (
        <div className="card">
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
                      <TeamBadge team={toBadgeTeam(t)} hideName />
                      <div className="font-medium">{label}</div>
                    </div>
                    <div className="text-xs text-gray-600">
                      Inn {inn.inning ?? "—"}
                    </div>
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {inn.score ?? "–"}/{inn.wickets ?? "–"} ({inn.overs ?? "–"}{" "}
                    ov)
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    PP1 {inn.pp1 ?? "—"} · PP2 {inn.pp2 ?? "—"}
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
            <div key={tid} className="card space-y-4">
              {/* Batting */}
              <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 p-6 shadow-2xl backdrop-blur-xl">
                <h3 className="font-semibold mb-2">
                  {teamObj?.short_name ||
                    teamObj?.name ||
                    team.label ||
                    `Team ${tid}`}{" "}
                  Batting
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-[640px] w-full text-sm">
                    <thead className="text-left text-white bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30">
                      <tr>
                        <th className="py-1 px-2">Batter</th>
                        <th className="py-1 px-2 text-center">R</th>
                        <th className="py-1 px-2 text-center">B</th>
                        <th className="py-1 px-2 text-center">4s</th>
                        <th className="py-1 px-2 text-center">6s</th>
                        <th className="py-1 px-2 text-center">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bats.length
                        ? bats.map((b: AnyRow) => {
                            const label = nameFor(b);
                            const pid = b.player_id
                              ? Number(b.player_id)
                              : undefined;

                            return (
                              <tr
                                key={
                                  b.id ??
                                  `${tid}-bat-${pid}-${b.score}-${b.ball}`
                                }
                                className="border-t"
                              >
                                <td className="py-1 px-2">
                                  {pid ? (
                                    <Link
                                      href={`players/${pid}`}
                                      className="text-white  hover:underline"
                                    >
                                      {label}
                                    </Link>
                                  ) : (
                                    label
                                  )}
                                </td>
                                <td className="py-1 px-2 text-center">
                                  {b.score ?? "–"}
                                </td>
                                <td className="py-1 px-2 text-center">
                                  {b.ball ?? "–"}
                                </td>
                                <td className="py-1 px-2 text-center">
                                  {b.four_x ?? "–"}
                                </td>
                                <td className="py-1 px-2 text-center">
                                  {b.six_x ?? "–"}
                                </td>
                                <td className="py-1 px-2 text-center">
                                  {b.rate ?? "–"}
                                </td>
                              </tr>
                            );
                          })
                        : Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-t">
                              <td className="py-1 px-2">–</td>
                              <td className="py-1 px-2 text-center">–</td>
                              <td className="py-1 px-2 text-center">–</td>
                              <td className="py-1 px-2 text-center">–</td>
                              <td className="py-1 px-2 text-center">–</td>
                              <td className="py-1 px-2 text-center">–</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
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
                <div className="overflow-x-auto">
                  <table className="min-w-[640px] w-full text-sm">
                    <thead className="text-left text-white bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30">
                      <tr>
                        <th className="py-1 px-2">Bowler</th>
                        <th className="py-1 px-2 text-center">O</th>
                        <th className="py-1 px-2 text-center">M</th>
                        <th className="py-1 px-2 text-center">R</th>
                        <th className="py-1 px-2 text-center">W</th>
                        <th className="py-1 px-2 text-center">ECO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bowls.length
                        ? bowls.map((b: AnyRow) => {
                            const label = nameFor(b);
                            const pid = b.player_id
                              ? Number(b.player_id)
                              : undefined;

                            return (
                              <tr
                                key={
                                  b.id ??
                                  `${tid}-bowl-${pid}-${b.overs}-${b.runs}`
                                }
                                className="border-t"
                              >
                                <td className="py-1 px-2">
                                  {pid ? (
                                    <Link
                                      href={`/mobile/players/${pid}`}
                                      className="text-white hover:underline"
                                    >
                                      {label}
                                    </Link>
                                  ) : (
                                    label
                                  )}
                                </td>
                                <td className="py-1 px-2 text-center">
                                  {b.overs ?? "–"}
                                </td>
                                <td className="py-1 px-2 text-center">
                                  {b.medians ?? "–"}
                                </td>
                                <td className="py-1 px-2 text-center">
                                  {b.runs ?? "–"}
                                </td>
                                <td className="py-1 px-2 text-center">
                                  {b.wickets ?? "–"}
                                </td>
                                <td className="py-1 px-2 text-center">
                                  {b.rate ?? "–"}
                                </td>
                              </tr>
                            );
                          })
                        : Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-t">
                              <td className="py-1 px-2">–</td>
                              <td className="py-1 px-2 text-center">–</td>
                              <td className="py-1 px-2 text-center">–</td>
                              <td className="py-1 px-2 text-center">–</td>
                              <td className="py-1 px-2 text-center">–</td>
                              <td className="py-1 px-2 text-center">–</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
