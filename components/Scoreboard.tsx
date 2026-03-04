// // components/Scoreboard.tsx
// "use client";

// import useSWR from "swr";
// import { useMemo } from "react";
// import Link from "next/link";
// import { formatDate } from "@/lib/utils";
// import TeamBadge from "@/components/TeamBadge";
// import { useTeams } from "@/hooks/useTeams";
// import { usePlayers } from "@/hooks/usePlayers";
// import ScoreTeamBadge from "./ScoreTeamBadge";
// import { SubCard } from "./SubCard";
// import { Pill } from "./Pill";
// import { Panel } from "./Panel";

// const fetcher = async (u: string) => {
//   const res = await fetch(u, { headers: { Accept: "application/json" } });
//   const text = await res.text();
//   let json: any = {};
//   try {
//     json = text ? JSON.parse(text) : {};
//   } catch {
//     throw new Error(`Bad JSON (${res.status}) ${text.slice(0, 160)}`);
//   }
//   if (!res.ok || json?.error)
//     throw new Error(json?.error || `HTTP ${res.status}`);
//   return json;
// };

// type AnyRow = Record<string, any>;

// export default function Scoreboard({ id }: { id: string }) {
//   const { data, error, isLoading } = useSWR(`/api/match/${id}`, fetcher, {
//     refreshInterval: 15000,
//   });
//   const fx = data?.data;

//   const runs: AnyRow[] = (fx?.runs as any[] | undefined) ?? [];
//   const batting: AnyRow[] = (fx?.batting as any[] | undefined) ?? [];
//   const bowling: AnyRow[] = (fx?.bowling as any[] | undefined) ?? [];

//   const teamIds = useMemo(() => {
//     const ids = [
//       fx?.localteam_id,
//       fx?.visitorteam_id,
//       ...runs.map((r) => r.team_id),
//       ...batting.map((b) => b.team_id),
//       ...bowling.map((b) => b.team_id),
//     ].filter(Boolean) as number[];
//     return Array.from(new Set(ids));
//   }, [fx?.localteam_id, fx?.visitorteam_id, runs, batting, bowling]);

//   const playerIds = useMemo(() => {
//     const ids = [
//       ...batting.map((b) => Number(b.player_id)),
//       ...bowling.map((b) => Number(b.player_id)),
//     ].filter((pid) => !!pid && !Number.isNaN(pid)) as number[];
//     return Array.from(new Set(ids));
//   }, [batting, bowling]);

//   const { teams } = useTeams(teamIds);
//   const { players } = usePlayers(playerIds);

//   if (error) {
//     return (
//       <Panel>
//         <div className="text-sm text-white/90">Failed to load scoreboard.</div>
//         <div className="mt-1 text-xs text-white/60">
//           {String((error as any).message)}
//         </div>
//       </Panel>
//     );
//   }
//   if (isLoading)
//     return (
//       <Panel className="animate-pulse text-white/70">Loading scoreboard…</Panel>
//     );
//   if (!fx) return <Panel className="text-white/70">No data.</Panel>;

//   // ✅ merge fixture images even if hook objects are lean
//   const home = {
//     ...(fx?.localteam ?? {}),
//     ...(teams.get(fx.localteam_id) ?? {}),
//   };
//   const away = {
//     ...(fx?.visitorteam ?? {}),
//     ...(teams.get(fx.visitorteam_id) ?? {}),
//   };

//   const toBadgeTeam = (t: any) =>
//     t
//       ? {
//           ...t,
//           logo: t.logo ?? t.logo_url ?? t.image_path ?? t.image?.path ?? "",
//         }
//       : undefined;

//   const homeBadge = toBadgeTeam(home);
//   const awayBadge = toBadgeTeam(away);

//   const nameFor = (row: any) => {
//     const pid = row.player_id ? Number(row.player_id) : undefined;
//     const live = pid ? players.get(pid)?.fullname : undefined;
//     return (
//       live ??
//       row.player_name ??
//       row.fullname ??
//       row.firstname ??
//       row.player?.fullname ??
//       row.player?.firstname ??
//       (pid ? `Player ${pid}` : "—")
//     );
//   };

//   const byTeam = <T extends AnyRow>(rows: T[]) =>
//     rows.reduce<Record<number, T[]>>((acc, r) => {
//       const tid = r.team_id;
//       if (!tid) return acc;
//       if (!acc[tid]) acc[tid] = [];
//       acc[tid].push(r);
//       return acc;
//     }, {});

//   const batByTeam = byTeam(batting);
//   const bowlByTeam = byTeam(bowling);

//   const teamForId = (tid?: number) =>
//     tid
//       ? teams.get(tid) ??
//         (tid === fx.localteam_id
//           ? home
//           : tid === fx.visitorteam_id
//           ? away
//           : undefined)
//       : undefined;

//   const tossTeam =
//     fx.toss_won_team_id === fx.localteam_id
//       ? home
//       : fx.toss_won_team_id === fx.visitorteam_id
//       ? away
//       : teamForId(fx.toss_won_team_id);

//   const statusText = String(fx.status || "—");
//   const statusTone =
//     statusText.toLowerCase().includes("finish") ||
//     statusText.toLowerCase().includes("completed")
//       ? "success"
//       : statusText.toLowerCase().includes("live")
//       ? "warning"
//       : "neutral";

//   return (
//     <div className="space-y-6">
//       {/* Header / Match summary card */}
//       <Panel>
//         <div className="flex flex-col gap-4">
//           <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
//             <div>
//               <p className="text-xs font-semibold tracking-[0.2em] text-[#F7B731]/90">
//                 8JJCRICKET - MATCH
//               </p>
//               <h2 className="mt-2 text-xl font-bold text-white">
//                 {fx.league?.name || "League"}
//               </h2>

//               <p className="mt-1 text-sm text-white/70">
//                 {fx.round || "—"} · {formatDate(fx.starting_at)}
//               </p>
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               <Pill tone={statusTone as any}>{statusText}</Pill>
//               {fx.note ? <Pill>{fx.note}</Pill> : null}
//               <Pill>Fixture #{id}</Pill>
//             </div>
//           </div>

//           <div className="rounded-xl border border-white/10 bg-[#060A12] px-4 py-4">
//             <div className="flex items-center justify-between gap-3">
//               <div className="flex items-center gap-3">
//                 <ScoreTeamBadge team={homeBadge} />
//                 <div className="leading-tight">
//                   <div className="text-sm font-semibold text-white">
//                     {home?.short_name ||
//                       home?.name ||
//                       `Team ${fx.localteam_id}`}
//                   </div>
//                   <div className="text-xs text-amber-300">Home</div>
//                 </div>
//               </div>

//               <div className="font-semibold tracking-widest text-amber-300">
//                 VS
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="text-right leading-tight">
//                   <div className="text-sm font-semibold text-white">
//                     {away?.short_name ||
//                       away?.name ||
//                       `Team ${fx.visitorteam_id}`}
//                   </div>
//                   <div className="text-xs text-amber-300">Away</div>
//                 </div>
//                 <ScoreTeamBadge team={awayBadge} />
//               </div>
//             </div>

//             {(fx.toss_won_team_id || fx.elected) && (
//               <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
//                 <Pill>
//                   <span className="text-white/70">Toss:</span>{" "}
//                   <span className="font-medium text-white">
//                     {tossTeam?.name ||
//                       tossTeam?.short_name ||
//                       (fx.toss_won_team_id
//                         ? `Team ${fx.toss_won_team_id}`
//                         : "—")}
//                   </span>
//                   {fx.elected ? (
//                     <>
//                       <span className="text-white/70"> chose to </span>
//                       <span className="font-medium text-white">
//                         {String(fx.elected).toLowerCase()}
//                       </span>
//                       <span className="text-white/70"> first</span>
//                     </>
//                   ) : null}
//                 </Pill>
//               </div>
//             )}
//           </div>
//         </div>
//       </Panel>

//       {/* Innings Summary */}
//       {runs.length > 0 && (
//         <Panel>
//           <div className="flex items-center justify-between">
//             <h3 className="text-base font-semibold text-white">
//               Innings Summary
//             </h3>
//             <Pill>Completed matches</Pill>
//           </div>

//           <div className="mt-4 grid gap-3 sm:grid-cols-2">
//             {runs.map((inn) => {
//               const t = teamForId(inn.team_id);
//               const label =
//                 t?.short_name ||
//                 t?.name ||
//                 (inn.team_id === fx.localteam_id
//                   ? home?.short_name || home?.name
//                   : inn.team_id === fx.visitorteam_id
//                   ? away?.short_name || away?.name
//                   : `Team ${inn.team_id}`);

//               return (
//                 <SubCard key={inn.id ?? `${inn.team_id}-${inn.inning}`}>
//                   <div className="flex items-center justify-between gap-3">
//                     <div className="">
//                       <ScoreTeamBadge team={toBadgeTeam(t)} />
//                       <div className="text-sm font-semibold text-white">
//                         {label}
//                       </div>
//                     </div>

//                     <div>
//                       <div className="flex justify-end">
//                         <Pill>Inn {inn.inning ?? "—"}</Pill>
//                       </div>

//                       <div className="mt-2 text-2xl font-extrabold text-white">
//                         {inn.score ?? "–"}/{inn.wickets ?? "–"}{" "}
//                         <span className="text-sm font-semibold text-white/70">
//                           ({inn.overs ?? "–"} ov)
//                         </span>
//                       </div>

//                       <div className="mt-1 text-xs text-white/60">
//                         PP1 {inn.pp1 ?? "—"} · PP2 {inn.pp2 ?? "—"}
//                       </div>
//                     </div>
//                   </div>
//                 </SubCard>
//               );
//             })}
//           </div>
//         </Panel>
//       )}

//       {/* Per-team batting/bowling panels */}
//       {(
//         [
//           { id: fx.localteam_id, label: home?.name || home?.short_name },
//           { id: fx.visitorteam_id, label: away?.name || away?.short_name },
//         ] as const
//       )
//         .filter((t) => t.id)
//         .map((team) => {
//           const tid = team.id as number;
//           const teamObj = teamForId(tid);
//           const bats = batByTeam[tid] ?? [];
//           const bowls = bowlByTeam[tid] ?? [];
//           const teamLabel =
//             teamObj?.short_name || teamObj?.name || team.label || `Team ${tid}`;

//           return (
//             <Panel key={tid} className="space-y-6">
//               <div className="flex items-center justify-between gap-3">
//                 <div className="flex items-center gap-3">
//                   <TeamBadge team={toBadgeTeam(teamObj)} hideName />
//                   <div className="text-lg font-bold text-white">
//                     {teamLabel}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Pill>Batting</Pill>
//                   <Pill>Bowling</Pill>
//                 </div>
//               </div>

//               {/* Batting table */}
//               <div className="rounded-xl border border-white/10 bg-[#060A12] overflow-hidden">
//                 <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
//                   <h3 className="text-sm font-semibold text-white">
//                     {teamLabel} Batting
//                   </h3>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-[720px] w-full text-sm">
//                     <thead className="bg-white/5 text-white/80">
//                       <tr>
//                         <th className="py-2 px-4 text-left font-semibold">
//                           Batter
//                         </th>
//                         <th className="py-2 px-3 text-center font-semibold">
//                           R
//                         </th>
//                         <th className="py-2 px-3 text-center font-semibold">
//                           B
//                         </th>
//                         <th className="py-2 px-3 text-center font-semibold">
//                           4s
//                         </th>
//                         <th className="py-2 px-3 text-center font-semibold">
//                           6s
//                         </th>
//                         <th className="py-2 px-3 text-center font-semibold">
//                           SR
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-white/10">
//                       {bats.length
//                         ? bats.map((b: AnyRow) => {
//                             const label = nameFor(b);
//                             const pid = b.player_id
//                               ? Number(b.player_id)
//                               : undefined;
//                             return (
//                               <tr
//                                 key={
//                                   b.id ??
//                                   `${tid}-bat-${pid}-${b.score}-${b.ball}`
//                                 }
//                                 className="hover:bg-white/5"
//                               >
//                                 <td className="py-2 px-4">
//                                   {pid ? (
//                                     <Link
//                                       href={`/players/${pid}`}
//                                       className="text-white hover:underline"
//                                     >
//                                       {label}
//                                     </Link>
//                                   ) : (
//                                     <span className="text-white">{label}</span>
//                                   )}
//                                 </td>
//                                 <td className="py-2 px-3 text-center text-white/80">
//                                   {b.score ?? "–"}
//                                 </td>
//                                 <td className="py-2 px-3 text-center text-white/80">
//                                   {b.ball ?? "–"}
//                                 </td>
//                                 <td className="py-2 px-3 text-center text-white/80">
//                                   {b.four_x ?? "–"}
//                                 </td>
//                                 <td className="py-2 px-3 text-center text-white/80">
//                                   {b.six_x ?? "–"}
//                                 </td>
//                                 <td className="py-2 px-3 text-center text-white/80">
//                                   {b.rate ?? "–"}
//                                 </td>
//                               </tr>
//                             );
//                           })
//                         : Array.from({ length: 5 }).map((_, i) => (
//                             <tr key={i}>
//                               <td className="py-2 px-4 text-white/60">–</td>
//                               <td className="py-2 px-3 text-center text-white/60">
//                                 –
//                               </td>
//                               <td className="py-2 px-3 text-center text-white/60">
//                                 –
//                               </td>
//                               <td className="py-2 px-3 text-center text-white/60">
//                                 –
//                               </td>
//                               <td className="py-2 px-3 text-center text-white/60">
//                                 –
//                               </td>
//                               <td className="py-2 px-3 text-center text-white/60">
//                                 –
//                               </td>
//                             </tr>
//                           ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Bowling table */}
//               <div className="rounded-xl border border-white/10 bg-[#060A12] overflow-hidden">
//                 <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
//                   <h3 className="text-sm font-semibold text-white">
//                     {teamLabel} Bowling
//                   </h3>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-[720px] w-full text-sm">
//                     <thead className="bg-white/5 text-white/80">
//                       <tr>
//                         <th className="py-2 px-4 text-left font-semibold">
//                           Bowler
//                         </th>
//                         <th className="py-2 px-3 text-center font-semibold">
//                           O
//                         </th>
//                         <th className="py-2 px-3 text-center font-semibold">
//                           M
//                         </th>
//                         <th className="py-2 px-3 text-center font-semibold">
//                           R
//                         </th>
//                         <th className="py-2 px-3 text-center font-semibold">
//                           W
//                         </th>
//                         <th className="py-2 px-3 text-center font-semibold">
//                           ECO
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-white/10">
//                       {bowls.length
//                         ? bowls.map((b: AnyRow) => {
//                             const label = nameFor(b);
//                             const pid = b.player_id
//                               ? Number(b.player_id)
//                               : undefined;
//                             return (
//                               <tr
//                                 key={
//                                   b.id ??
//                                   `${tid}-bowl-${pid}-${b.overs}-${b.runs}`
//                                 }
//                                 className="hover:bg-white/5"
//                               >
//                                 <td className="py-2 px-4">
//                                   {pid ? (
//                                     <Link
//                                       href={`/players/${pid}`}
//                                       className="text-white hover:underline"
//                                     >
//                                       {label}
//                                     </Link>
//                                   ) : (
//                                     <span className="text-white">{label}</span>
//                                   )}
//                                 </td>
//                                 <td className="py-2 px-3 text-center text-white/80">
//                                   {b.overs ?? "–"}
//                                 </td>
//                                 <td className="py-2 px-3 text-center text-white/80">
//                                   {b.medians ?? "–"}
//                                 </td>
//                                 <td className="py-2 px-3 text-center text-white/80">
//                                   {b.runs ?? "–"}
//                                 </td>
//                                 <td className="py-2 px-3 text-center text-white/80">
//                                   {b.wickets ?? "–"}
//                                 </td>
//                                 <td className="py-2 px-3 text-center text-white/80">
//                                   {b.rate ?? "–"}
//                                 </td>
//                               </tr>
//                             );
//                           })
//                         : Array.from({ length: 5 }).map((_, i) => (
//                             <tr key={i}>
//                               <td className="py-2 px-4 text-white/60">–</td>
//                               <td className="py-2 px-3 text-center text-white/60">
//                                 –
//                               </td>
//                               <td className="py-2 px-3 text-center text-white/60">
//                                 –
//                               </td>
//                               <td className="py-2 px-3 text-center text-white/60">
//                                 –
//                               </td>
//                               <td className="py-2 px-3 text-center text-white/60">
//                                 –
//                               </td>
//                               <td className="py-2 px-3 text-center text-white/60">
//                                 –
//                               </td>
//                             </tr>
//                           ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </Panel>
//           );
//         })}
//     </div>
//   );
// }

// components/Scoreboard.tsx
"use client";

import useSWR from "swr";
import { useMemo } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import TeamBadge from "@/components/TeamBadge";
import { useTeams } from "@/hooks/useTeams";
import { usePlayers } from "@/hooks/usePlayers";
import ScoreTeamBadge from "./ScoreTeamBadge";
import { SubCard } from "./SubCard";
import { Pill } from "./Pill";
import { Panel } from "./Panel";

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
      <Panel className="relative overflow-hidden border border-white/10 bg-white/[0.04]">
        {/* GOLD THEME */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.20),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.16),transparent_55%)]" />
        <div className="relative">
          <div className="text-sm font-semibold text-white/90">
            Failed to load scoreboard.
          </div>
          <div className="mt-1 text-xs text-white/60">
            {String((error as any).message)}
          </div>
        </div>
      </Panel>
    );
  }

  if (isLoading)
    return (
      <Panel className="relative overflow-hidden border border-white/10 bg-white/[0.04] animate-pulse">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.18),transparent_60%)]" />
        <div className="relative text-white/80">Loading scoreboard…</div>
      </Panel>
    );

  if (!fx)
    return (
      <Panel className="relative overflow-hidden border border-white/10 bg-white/[0.04]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.14),transparent_60%)]" />
        <div className="relative text-white/70">No data.</div>
      </Panel>
    );

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

  const statusText = String(fx.status || "—");
  const statusTone =
    statusText.toLowerCase().includes("finish") ||
    statusText.toLowerCase().includes("completed")
      ? "success"
      : statusText.toLowerCase().includes("live")
        ? "warning"
        : "neutral";

  const scoreForTeam = (tid?: number) => {
    const inn = runs.find((r) => r.team_id === tid);
    const s = Number(inn?.score ?? 0);
    const w = Number(inn?.wickets ?? 0);
    return { s, w };
  };

  const homeSW = scoreForTeam(fx.localteam_id);
  const awaySW = scoreForTeam(fx.visitorteam_id);
  const leadingTeamId =
    homeSW.s !== awaySW.s
      ? homeSW.s > awaySW.s
        ? fx.localteam_id
        : fx.visitorteam_id
      : homeSW.w !== awaySW.w
        ? homeSW.w < awaySW.w
          ? fx.localteam_id
          : fx.visitorteam_id
        : undefined;

  const isLive =
    statusText.toLowerCase().includes("live") || statusTone === "warning";

  // UI-only: re-trigger score animation when the numbers change
  const scoreAnimKey = `${homeSW.s}-${homeSW.w}-${awaySW.s}-${awaySW.w}-${runs.length}`;

  return (
    <div className="space-y-6">
      {/* Broadcast background shell */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#060A12]/60 p-3 sm:p-4">
        {/* GOLD / AMBER theme */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.20),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.16),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_38%,rgba(255,255,255,0.02))]" />
        <div className="absolute inset-0 backdrop-blur-xl" />

        <div className="relative space-y-6">
          {/* MATCH HEADER (ESPN style) */}
          <Panel className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] shadow-[0_20px_70px_-40px_rgba(0,0,0,0.95)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,191,36,0.14),transparent_40%,rgba(245,158,11,0.12))]" />
            <div className="relative space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-semibold tracking-[0.28em] text-amber-200/80">
                      LIVE MATCH CENTER
                    </p>

                    {isLive ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.22em] text-red-200">
                        <span className="relative inline-flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/70" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                        </span>
                        LIVE
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {fx.league?.name || "League"}
                  </h2>

                  <p className="mt-1 text-sm text-white/70">
                    {fx.round || "—"} · {formatDate(fx.starting_at)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className={[
                      "rounded-full p-[1px] shadow-[0_0_0_1px_rgba(255,255,255,0.10)]",
                      statusTone === "warning"
                        ? "bg-[linear-gradient(135deg,rgba(245,158,11,0.95),rgba(251,191,36,0.70))]"
                        : statusTone === "success"
                          ? "bg-[linear-gradient(135deg,rgba(16,185,129,0.95),rgba(245,158,11,0.45))]"
                          : "bg-[linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.05))]",
                    ].join(" ")}
                  >
                    <Pill tone={statusTone as any}>{statusText}</Pill>
                  </div>

                  {fx.note ? <Pill>{fx.note}</Pill> : null}
                  <Pill>Fixture #{id}</Pill>
                </div>
              </div>

              {/* SCORE HERO STRIP */}
              <div className="rounded-[22px] border border-white/10 bg-[#050812]/70 p-3 sm:p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
                  {/* HOME */}
                  <div
                    className={[
                      "group flex items-center gap-3 rounded-2xl p-3 transition-all duration-300",
                      leadingTeamId === fx.localteam_id
                        ? "bg-white/[0.06] ring-1 ring-amber-300/30 shadow-[0_0_55px_-28px_rgba(251,191,36,0.85)]"
                        : "hover:bg-white/[0.03]",
                    ].join(" ")}
                  >
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-full bg-amber-400/25 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative rounded-full p-[2px] bg-[linear-gradient(135deg,rgba(251,191,36,0.95),rgba(245,158,11,0.65))]">
                        <div className="rounded-full bg-[#060A12] p-1">
                          <ScoreTeamBadge team={homeBadge} />
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-lg sm:text-xl font-extrabold text-white tracking-tight">
                          {home?.short_name ||
                            home?.name ||
                            `Team ${fx.localteam_id}`}
                        </div>
                        {leadingTeamId === fx.localteam_id ? (
                          <span className="shrink-0 rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-amber-200">
                            LEADING
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-0.5 text-xs text-white/60">Home</div>
                    </div>
                  </div>

                  {/* CENTER SCORE */}
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold tracking-[0.35em] text-white/70">
                      MATCH SCORE
                    </div>

                    {/* score update animation (UI-only) */}
                    <div
                      key={scoreAnimKey}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 shadow-[0_18px_60px_-40px_rgba(251,191,36,0.75)] animate-[fadeIn_380ms_ease-out]"
                    >
                      <div className="text-center">
                        <div className="text-[10px] font-semibold tracking-[0.32em] text-white/55">
                          RUNS / WKTS
                        </div>

                        <div className="mt-1 flex items-baseline justify-center gap-3">
                          <div className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                            {homeSW.s || 0}
                            <span className="text-white/50">/</span>
                            {homeSW.w || 0}
                          </div>

                          <span className="text-white/30">•</span>

                          <div className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                            {awaySW.s || 0}
                            <span className="text-white/50">/</span>
                            {awaySW.w || 0}
                          </div>
                        </div>

                        <div className="mt-1 text-xs text-white/60">
                          Overs shown in innings summary
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AWAY */}
                  <div
                    className={[
                      "group flex items-center justify-between gap-3 rounded-2xl p-3 transition-all duration-300 md:flex-row-reverse",
                      leadingTeamId === fx.visitorteam_id
                        ? "bg-white/[0.06] ring-1 ring-amber-300/30 shadow-[0_0_55px_-28px_rgba(245,158,11,0.85)]"
                        : "hover:bg-white/[0.03]",
                    ].join(" ")}
                  >
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-full bg-amber-400/25 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative rounded-full p-[2px] bg-[linear-gradient(135deg,rgba(245,158,11,0.95),rgba(251,191,36,0.65))]">
                        <div className="rounded-full bg-[#060A12] p-1">
                          <ScoreTeamBadge team={awayBadge} />
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {leadingTeamId === fx.visitorteam_id ? (
                          <span className="shrink-0 rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-amber-200">
                            LEADING
                          </span>
                        ) : null}
                        <div className="truncate text-lg sm:text-xl font-extrabold text-white tracking-tight">
                          {away?.short_name ||
                            away?.name ||
                            `Team ${fx.visitorteam_id}`}
                        </div>
                      </div>
                      <div className="mt-0.5 text-xs text-white/60">Away</div>
                    </div>
                  </div>
                </div>

                {(fx.toss_won_team_id || fx.elected) && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <Pill>
                      <span className="text-white/70">Toss:</span>{" "}
                      <span className="font-semibold text-white">
                        {tossTeam?.name ||
                          tossTeam?.short_name ||
                          (fx.toss_won_team_id
                            ? `Team ${fx.toss_won_team_id}`
                            : "—")}
                      </span>
                      {fx.elected ? (
                        <>
                          <span className="text-white/70"> chose to </span>
                          <span className="font-semibold text-white">
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

          {/* INNINGS SUMMARY */}
          {runs.length > 0 && (
            <Panel className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] shadow-[0_20px_70px_-45px_rgba(0,0,0,0.95)]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,191,36,0.12),transparent_45%,rgba(245,158,11,0.10))]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white tracking-tight">
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

                    const isLeader = leadingTeamId === inn.team_id;

                    return (
                      <SubCard
                        key={inn.id ?? `${inn.team_id}-${inn.inning}`}
                        className={[
                          "group relative overflow-hidden rounded-2xl border border-white/10 bg-[#050812]/65",
                          "transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20",
                          isLeader
                            ? "ring-1 ring-amber-300/25 shadow-[0_0_55px_-40px_rgba(251,191,36,0.90)]"
                            : "shadow-[0_12px_55px_-45px_rgba(0,0,0,0.95)]",
                        ].join(" ")}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.14),transparent_60%)]" />
                        <div className="relative flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="absolute -inset-2 rounded-full bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              <ScoreTeamBadge team={toBadgeTeam(t)} />
                            </div>

                            <div>
                              <div className="text-sm font-semibold text-white">
                                {label}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <Pill>Inn {inn.inning ?? "—"}</Pill>
                                {isLeader ? (
                                  <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-amber-200">
                                    LEADING
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-black text-white tabular-nums tracking-tight">
                              {inn.score ?? "–"}
                              <span className="text-white/60">/</span>
                              {inn.wickets ?? "–"}
                            </div>

                            <div className="mt-1 text-sm font-semibold text-white/70">
                              <span className="tabular-nums">
                                {inn.overs ?? "–"}
                              </span>{" "}
                              ov
                            </div>

                            <div className="mt-1 text-xs text-white/60">
                              PP1 {inn.pp1 ?? "—"} · PP2 {inn.pp2 ?? "—"}
                            </div>
                          </div>
                        </div>
                      </SubCard>
                    );
                  })}
                </div>
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
                teamObj?.short_name ||
                teamObj?.name ||
                team.label ||
                `Team ${tid}`;

              const isLeader = leadingTeamId === tid;

              return (
                <Panel
                  key={tid}
                  className={[
                    "relative overflow-hidden border border-white/10",
                    "bg-white/[0.035] shadow-[0_18px_60px_-35px_rgba(0,0,0,0.95)]",
                    "rounded-3xl",
                    isLeader
                      ? "ring-1 ring-amber-300/20"
                      : "ring-0 ring-transparent",
                    "transition-transform duration-300 hover:-translate-y-[2px]",
                  ].join(" ")}
                >
                  {/* GOLD background accents */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.10),transparent_58%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.08),transparent_55%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%,rgba(255,255,255,0.02))]" />

                  {/* shine sweep */}
                  <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-white/5 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative space-y-6">
                    {/* TEAM HERO HEADER */}
                    <div className="rounded-3xl border border-white/10 bg-[#050812]/55 p-4 sm:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative">
                            <div
                              className={[
                                "absolute -inset-3 rounded-full blur-xl",
                                isLeader
                                  ? "bg-amber-400/25"
                                  : "bg-yellow-400/15",
                              ].join(" ")}
                            />
                            <div className="relative rounded-full p-[2px] bg-[linear-gradient(135deg,rgba(251,191,36,0.95),rgba(245,158,11,0.65))]">
                              <div className="rounded-full bg-[#060A12] p-1">
                                <TeamBadge
                                  team={toBadgeTeam(teamObj)}
                                  hideName
                                />
                              </div>
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="truncate text-2xl sm:text-3xl font-black tracking-tight text-white">
                                {teamLabel}
                              </h3>
                              {isLeader ? (
                                <span className="shrink-0 rounded-full border border-amber-300/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.25em] text-amber-200">
                                  LEADING TEAM
                                </span>
                              ) : null}
                            </div>

                            <div className="mt-1 text-sm text-white/60">
                              Batting & Bowling breakdown
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/70">
                                {bats.length
                                  ? `${bats.length} batters`
                                  : "No batting data"}
                              </span>
                              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/70">
                                {bowls.length
                                  ? `${bowls.length} bowlers`
                                  : "No bowling data"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
                          <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/80">
                            Batting
                          </span>
                          <span className="rounded-full px-3 py-1 text-xs font-semibold text-white/60">
                            Bowling
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Batting table */}
                    <div className="rounded-3xl border border-white/10 bg-[#050812]/60 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <h3 className="text-sm font-semibold text-white">
                          {teamLabel} Batting
                        </h3>
                        <span className="text-[11px] font-semibold tracking-[0.25em] text-white/45">
                          STATS
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-[720px] w-full text-sm">
                          <thead className="sticky top-0 z-10 bg-[#0A1220]/90 backdrop-blur text-white/80">
                            <tr>
                              <th className="py-3 px-4 text-left font-semibold">
                                Batter
                              </th>
                              <th className="py-3 px-3 text-center font-semibold">
                                R
                              </th>
                              <th className="py-3 px-3 text-center font-semibold">
                                B
                              </th>
                              <th className="py-3 px-3 text-center font-semibold">
                                4s
                              </th>
                              <th className="py-3 px-3 text-center font-semibold">
                                6s
                              </th>
                              <th className="py-3 px-3 text-center font-semibold">
                                SR
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-white/10">
                            {bats.length
                              ? bats.map((b: AnyRow, idx: number) => {
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
                                      className={[
                                        idx % 2
                                          ? "bg-white/[0.01]"
                                          : "bg-transparent",
                                        "transition-colors hover:bg-amber-400/[0.08]",
                                      ].join(" ")}
                                    >
                                      <td className="py-3 px-4">
                                        {pid ? (
                                          <Link
                                            href={`/players/${pid}`}
                                            className="text-white hover:underline underline-offset-4"
                                          >
                                            {label}
                                          </Link>
                                        ) : (
                                          <span className="text-white">
                                            {label}
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-3 px-3 text-center text-white tabular-nums font-extrabold">
                                        {b.score ?? "–"}
                                      </td>
                                      <td className="py-3 px-3 text-center text-white/70 tabular-nums">
                                        {b.ball ?? "–"}
                                      </td>
                                      <td className="py-3 px-3 text-center text-white/70 tabular-nums">
                                        {b.four_x ?? "–"}
                                      </td>
                                      <td className="py-3 px-3 text-center text-white/70 tabular-nums">
                                        {b.six_x ?? "–"}
                                      </td>
                                      <td className="py-3 px-3 text-center text-white/80 tabular-nums">
                                        {b.rate ?? "–"}
                                      </td>
                                    </tr>
                                  );
                                })
                              : Array.from({ length: 5 }).map((_, i) => (
                                  <tr
                                    key={i}
                                    className={i % 2 ? "bg-white/[0.01]" : ""}
                                  >
                                    <td className="py-3 px-4 text-white/60">
                                      –
                                    </td>
                                    <td className="py-3 px-3 text-center text-white/60">
                                      –
                                    </td>
                                    <td className="py-3 px-3 text-center text-white/60">
                                      –
                                    </td>
                                    <td className="py-3 px-3 text-center text-white/60">
                                      –
                                    </td>
                                    <td className="py-3 px-3 text-center text-white/60">
                                      –
                                    </td>
                                    <td className="py-3 px-3 text-center text-white/60">
                                      –
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Bowling table */}
                    <div className="rounded-3xl border border-white/10 bg-[#050812]/60 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                        <h3 className="text-sm font-semibold text-white">
                          {teamLabel} Bowling
                        </h3>
                        <span className="text-[11px] font-semibold tracking-[0.25em] text-white/45">
                          STATS
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-[720px] w-full text-sm">
                          <thead className="sticky top-0 z-10 bg-[#0A1220]/90 backdrop-blur text-white/80">
                            <tr>
                              <th className="py-3 px-4 text-left font-semibold">
                                Bowler
                              </th>
                              <th className="py-3 px-3 text-center font-semibold">
                                O
                              </th>
                              <th className="py-3 px-3 text-center font-semibold">
                                M
                              </th>
                              <th className="py-3 px-3 text-center font-semibold">
                                R
                              </th>
                              <th className="py-3 px-3 text-center font-semibold">
                                W
                              </th>
                              <th className="py-3 px-3 text-center font-semibold">
                                ECO
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-white/10">
                            {bowls.length
                              ? bowls.map((b: AnyRow, idx: number) => {
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
                                      className={[
                                        idx % 2
                                          ? "bg-white/[0.01]"
                                          : "bg-transparent",
                                        "transition-colors hover:bg-yellow-400/[0.08]",
                                      ].join(" ")}
                                    >
                                      <td className="py-3 px-4">
                                        {pid ? (
                                          <Link
                                            href={`/players/${pid}`}
                                            className="text-white hover:underline underline-offset-4"
                                          >
                                            {label}
                                          </Link>
                                        ) : (
                                          <span className="text-white">
                                            {label}
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-3 px-3 text-center text-white/70 tabular-nums">
                                        {b.overs ?? "–"}
                                      </td>
                                      <td className="py-3 px-3 text-center text-white/70 tabular-nums">
                                        {b.medians ?? "–"}
                                      </td>
                                      <td className="py-3 px-3 text-center text-white tabular-nums font-extrabold">
                                        {b.runs ?? "–"}
                                      </td>
                                      <td className="py-3 px-3 text-center text-white tabular-nums font-extrabold">
                                        {b.wickets ?? "–"}
                                      </td>
                                      <td className="py-3 px-3 text-center text-white/80 tabular-nums">
                                        {b.rate ?? "–"}
                                      </td>
                                    </tr>
                                  );
                                })
                              : Array.from({ length: 5 }).map((_, i) => (
                                  <tr
                                    key={i}
                                    className={i % 2 ? "bg-white/[0.01]" : ""}
                                  >
                                    <td className="py-3 px-4 text-white/60">
                                      –
                                    </td>
                                    <td className="py-3 px-3 text-center text-white/60">
                                      –
                                    </td>
                                    <td className="py-3 px-3 text-center text-white/60">
                                      –
                                    </td>
                                    <td className="py-3 px-3 text-center text-white/60">
                                      –
                                    </td>
                                    <td className="py-3 px-3 text-center text-white/60">
                                      –
                                    </td>
                                    <td className="py-3 px-3 text-center text-white/60">
                                      –
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Panel>
              );
            })}
        </div>
      </div>

      {/* Tailwind-only keyframes (no inline styles, no new files needed) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(2px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}