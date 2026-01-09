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

// Local UI helpers (8jjcricket-like)
function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning";
}) {
  const cls =
    tone === "success"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
      : tone === "warning"
      ? "border-[#F7B731]/30 bg-[#F7B731]/10 text-[#F7B731]"
      : "border-white/15 bg-white/5 text-white/75";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
        cls,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-[#070D18] p-4 md:p-6",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function SubCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-xl border border-white/10 bg-[#060A12] p-4",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function Scoreboard({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR(`/api/match/${id}`, fetcher, {
    refreshInterval: 15000,
  });
  const fx = data?.data;

  const runs: AnyRow[] = (fx?.runs as any[] | undefined) ?? [];
  const batting: AnyRow[] = (fx?.batting as any[] | undefined) ?? [];
  const bowling: AnyRow[] = (fx?.bowling as any[] | undefined) ?? [];

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

  const playerIds = useMemo(() => {
    const ids = [
      ...batting.map((b) => Number(b.player_id)),
      ...bowling.map((b) => Number(b.player_id)),
    ].filter((pid) => !!pid && !Number.isNaN(pid)) as number[];
    return Array.from(new Set(ids));
  }, [batting, bowling]);

  const { teams } = useTeams(teamIds);
  const { players } = usePlayers(playerIds);

  if (error) {
    return (
      <Panel>
        <div className="text-sm text-white/90">Failed to load scoreboard.</div>
        <div className="mt-1 text-xs text-white/60">
          {String((error as any).message)}
        </div>
      </Panel>
    );
  }
  if (isLoading)
    return (
      <Panel className="animate-pulse text-white/70">Loading scoreboard…</Panel>
    );
  if (!fx) return <Panel className="text-white/70">No data.</Panel>;

  // ✅ merge fixture images even if hook objects are lean
  const home = {
    ...(fx?.localteam ?? {}),
    ...(teams.get(fx.localteam_id) ?? {}),
  };
  const away = {
    ...(fx?.visitorteam ?? {}),
    ...(teams.get(fx.visitorteam_id) ?? {}),
  };

  const toBadgeTeam = (t: any) =>
    t
      ? {
          ...t,
          logo: t.logo ?? t.logo_url ?? t.image_path ?? t.image?.path ?? "",
        }
      : undefined;

  const homeBadge = toBadgeTeam(home);
  const awayBadge = toBadgeTeam(away);

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

  const statusText = String(fx.status || "—");
  const statusTone =
    statusText.toLowerCase().includes("finish") ||
    statusText.toLowerCase().includes("completed")
      ? "success"
      : statusText.toLowerCase().includes("live")
      ? "warning"
      : "neutral";

  return (
    <div className="space-y-6">
      {/* Header / Match summary card */}
      <Panel>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#F7B731]/90">
                8JJCRICKET - MATCH
              </p>
              <h2 className="mt-2 text-xl font-bold text-white">
                {fx.league?.name || "League"}
              </h2>

              <p className="mt-1 text-sm text-white/70">
                {fx.round || "—"} · {formatDate(fx.starting_at)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={statusTone as any}>{statusText}</Pill>
              {fx.note ? <Pill>{fx.note}</Pill> : null}
              <Pill>Fixture #{id}</Pill>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#060A12] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <TeamBadge team={homeBadge} />
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-white">
                    {home?.short_name ||
                      home?.name ||
                      `Team ${fx.localteam_id}`}
                  </div>
                  <div className="text-xs text-white/60">Home</div>
                </div>
              </div>

              <div className="text-xs font-semibold tracking-widest text-white/50">
                VS
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right leading-tight">
                  <div className="text-sm font-semibold text-white">
                    {away?.short_name ||
                      away?.name ||
                      `Team ${fx.visitorteam_id}`}
                  </div>
                  <div className="text-xs text-white/60">Away</div>
                </div>
                <TeamBadge team={awayBadge} />
              </div>
            </div>

            {(fx.toss_won_team_id || fx.elected) && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <Pill>
                  <span className="text-white/70">Toss:</span>{" "}
                  <span className="font-medium text-white">
                    {tossTeam?.name ||
                      tossTeam?.short_name ||
                      (fx.toss_won_team_id
                        ? `Team ${fx.toss_won_team_id}`
                        : "—")}
                  </span>
                  {fx.elected ? (
                    <>
                      <span className="text-white/70"> chose to </span>
                      <span className="font-medium text-white">
                        {String(fx.elected).toLowerCase()}
                      </span>
                      <span className="text-white/70"> first</span>
                    </>
                  ) : null}
                </Pill>
              </div>
            )}
          </div>
        </div>
      </Panel>

      {/* Innings Summary */}
      {runs.length > 0 && (
        <Panel>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">
              Innings Summary
            </h3>
            <Pill>Completed matches</Pill>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                <SubCard key={inn.id ?? `${inn.team_id}-${inn.inning}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <TeamBadge team={toBadgeTeam(t)} hideName />
                      <div className="text-sm font-semibold text-white">
                        {label}
                      </div>
                    </div>
                    <Pill>Inn {inn.inning ?? "—"}</Pill>
                  </div>

                  <div className="mt-2 text-2xl font-extrabold text-white">
                    {inn.score ?? "–"}/{inn.wickets ?? "–"}{" "}
                    <span className="text-sm font-semibold text-white/70">
                      ({inn.overs ?? "–"} ov)
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-white/60">
                    PP1 {inn.pp1 ?? "—"} · PP2 {inn.pp2 ?? "—"}
                  </div>
                </SubCard>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Per-team batting/bowling panels */}
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
          const teamLabel =
            teamObj?.short_name || teamObj?.name || team.label || `Team ${tid}`;

          return (
            <Panel key={tid} className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <TeamBadge team={toBadgeTeam(teamObj)} hideName />
                  <div className="text-lg font-bold text-white">
                    {teamLabel}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill>Batting</Pill>
                  <Pill>Bowling</Pill>
                </div>
              </div>

              {/* Batting table */}
              <div className="rounded-xl border border-white/10 bg-[#060A12] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-white">
                    {teamLabel} Batting
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[720px] w-full text-sm">
                    <thead className="bg-white/5 text-white/80">
                      <tr>
                        <th className="py-2 px-4 text-left font-semibold">
                          Batter
                        </th>
                        <th className="py-2 px-3 text-center font-semibold">
                          R
                        </th>
                        <th className="py-2 px-3 text-center font-semibold">
                          B
                        </th>
                        <th className="py-2 px-3 text-center font-semibold">
                          4s
                        </th>
                        <th className="py-2 px-3 text-center font-semibold">
                          6s
                        </th>
                        <th className="py-2 px-3 text-center font-semibold">
                          SR
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
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
                                className="hover:bg-white/5"
                              >
                                <td className="py-2 px-4">
                                  {pid ? (
                                    <Link
                                      href={`/players/${pid}`}
                                      className="text-white hover:underline"
                                    >
                                      {label}
                                    </Link>
                                  ) : (
                                    <span className="text-white">{label}</span>
                                  )}
                                </td>
                                <td className="py-2 px-3 text-center text-white/80">
                                  {b.score ?? "–"}
                                </td>
                                <td className="py-2 px-3 text-center text-white/80">
                                  {b.ball ?? "–"}
                                </td>
                                <td className="py-2 px-3 text-center text-white/80">
                                  {b.four_x ?? "–"}
                                </td>
                                <td className="py-2 px-3 text-center text-white/80">
                                  {b.six_x ?? "–"}
                                </td>
                                <td className="py-2 px-3 text-center text-white/80">
                                  {b.rate ?? "–"}
                                </td>
                              </tr>
                            );
                          })
                        : Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i}>
                              <td className="py-2 px-4 text-white/60">–</td>
                              <td className="py-2 px-3 text-center text-white/60">
                                –
                              </td>
                              <td className="py-2 px-3 text-center text-white/60">
                                –
                              </td>
                              <td className="py-2 px-3 text-center text-white/60">
                                –
                              </td>
                              <td className="py-2 px-3 text-center text-white/60">
                                –
                              </td>
                              <td className="py-2 px-3 text-center text-white/60">
                                –
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bowling table */}
              <div className="rounded-xl border border-white/10 bg-[#060A12] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-white">
                    {teamLabel} Bowling
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[720px] w-full text-sm">
                    <thead className="bg-white/5 text-white/80">
                      <tr>
                        <th className="py-2 px-4 text-left font-semibold">
                          Bowler
                        </th>
                        <th className="py-2 px-3 text-center font-semibold">
                          O
                        </th>
                        <th className="py-2 px-3 text-center font-semibold">
                          M
                        </th>
                        <th className="py-2 px-3 text-center font-semibold">
                          R
                        </th>
                        <th className="py-2 px-3 text-center font-semibold">
                          W
                        </th>
                        <th className="py-2 px-3 text-center font-semibold">
                          ECO
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
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
                                className="hover:bg-white/5"
                              >
                                <td className="py-2 px-4">
                                  {pid ? (
                                    <Link
                                      href={`/players/${pid}`}
                                      className="text-white hover:underline"
                                    >
                                      {label}
                                    </Link>
                                  ) : (
                                    <span className="text-white">{label}</span>
                                  )}
                                </td>
                                <td className="py-2 px-3 text-center text-white/80">
                                  {b.overs ?? "–"}
                                </td>
                                <td className="py-2 px-3 text-center text-white/80">
                                  {b.medians ?? "–"}
                                </td>
                                <td className="py-2 px-3 text-center text-white/80">
                                  {b.runs ?? "–"}
                                </td>
                                <td className="py-2 px-3 text-center text-white/80">
                                  {b.wickets ?? "–"}
                                </td>
                                <td className="py-2 px-3 text-center text-white/80">
                                  {b.rate ?? "–"}
                                </td>
                              </tr>
                            );
                          })
                        : Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i}>
                              <td className="py-2 px-4 text-white/60">–</td>
                              <td className="py-2 px-3 text-center text-white/60">
                                –
                              </td>
                              <td className="py-2 px-3 text-center text-white/60">
                                –
                              </td>
                              <td className="py-2 px-3 text-center text-white/60">
                                –
                              </td>
                              <td className="py-2 px-3 text-center text-white/60">
                                –
                              </td>
                              <td className="py-2 px-3 text-center text-white/60">
                                –
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Panel>
          );
        })}
    </div>
  );
}
