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

// ─── Design tokens ────────────────────────────────────────────────────────────
//
//  All one-off magic numbers have been replaced with these tokens so every
//  layer of the UI shares a single source of truth.
//
//  bg-surface-*   →  panel backgrounds (darkest → lightest)
//  rounded-card   →  24 px — every card / panel
//  rounded-inner  →  16 px — inner containers inside a card
//  shadow-card    →  standard drop-shadow
//  gradient-gold  →  ambient amber glow (top + bottom)
//  ring-lead      →  ring on the leading team
//
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN = {
  /** Outermost shell */
  surfaceBase: "bg-[#060A12]/60",
  /** Cards / panels */
  surfaceCard: "bg-[#070C16]/70",
  /** Inner sections inside a card (tables, score strip) */
  surfaceInner: "bg-[#050810]/80",
  /** Subtle row tint */
  surfaceRow: "bg-white/[0.025]",

  border: "border border-white/10",
  roundedCard: "rounded-2xl",
  roundedShell: "rounded-3xl",

  shadowCard: "shadow-[0_16px_48px_-24px_rgba(0,0,0,0.90)]",
  shadowInner: "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",

  /** Amber radial placed at top of a surface */
  glowTop:
    "bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.18),transparent_60%)]",
  /** Amber radial placed at bottom of a surface */
  glowBottom:
    "bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.14),transparent_58%)]",
  /** Diagonal shine streak */
  shine:
    "bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_38%,rgba(255,255,255,0.02))]",

  ringLead: "ring-1 ring-amber-300/25",
  shadowLead: "shadow-[0_0_48px_-24px_rgba(251,191,36,0.80)]",
} as const;

// ─── Fetcher ──────────────────────────────────────────────────────────────────
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

// ─── Shared sub-components ────────────────────────────────────────────────────

/** Consistent section heading used in every panel */
function SectionHeading({
  title,
  aside,
}: {
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <span className="text-sm font-semibold text-white">{title}</span>
      {aside && (
        <span className="text-[11px] font-semibold tracking-[0.25em] text-white/40">
          {aside}
        </span>
      )}
    </div>
  );
}

/** Table head cell */
function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-2.5 px-3 text-center text-xs font-semibold text-white/70 first:text-left first:px-4">
      {children}
    </th>
  );
}

/** Table body cell */
function Td({
  children,
  bold,
  left,
}: {
  children: React.ReactNode;
  bold?: boolean;
  left?: boolean;
}) {
  return (
    <td
      className={[
        "py-3 px-3 text-center tabular-nums",
        left ? "text-left px-4" : "",
        bold ? "text-white font-extrabold" : "text-white/65",
      ].join(" ")}
    >
      {children}
    </td>
  );
}

/** Blank placeholder row */
function BlankRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td
          key={i}
          className={`py-3 px-3 text-center text-white/30 ${i === 0 ? "text-left px-4" : ""}`}
        >
          –
        </td>
      ))}
    </tr>
  );
}

/** LEADING badge */
function LeadingBadge() {
  return (
    <span className="shrink-0 rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-amber-200">
      LEADING
    </span>
  );
}

/** Ambient glow layer (absolute, inset-0) */
function GlowLayer() {
  return (
    <>
      <div className={`absolute inset-0 ${TOKEN.glowTop}`} />
      <div className={`absolute inset-0 ${TOKEN.glowBottom}`} />
      <div className={`absolute inset-0 ${TOKEN.shine}`} />
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Scoreboard({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR(`/api/match/${id}`, fetcher, {
    refreshInterval: 15_000,
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

  // ── Status states ────────────────────────────────────────────────────────
  if (error) {
    return (
      <Panel
        className={`relative overflow-hidden ${TOKEN.border} ${TOKEN.surfaceCard} ${TOKEN.roundedShell} ${TOKEN.shadowCard}`}
      >
        <GlowLayer />
        <div className="relative">
          <p className="text-sm font-semibold text-white/90">
            Failed to load scoreboard.
          </p>
          <p className="mt-1 text-xs text-white/55">
            {String((error as any).message)}
          </p>
        </div>
      </Panel>
    );
  }

  if (isLoading) {
    return (
      <Panel
        className={`relative overflow-hidden ${TOKEN.border} ${TOKEN.surfaceCard} ${TOKEN.roundedShell} ${TOKEN.shadowCard} animate-pulse`}
      >
        <GlowLayer />
        <p className="relative text-sm text-white/70">Loading scoreboard…</p>
      </Panel>
    );
  }

  if (!fx) {
    return (
      <Panel
        className={`relative overflow-hidden ${TOKEN.border} ${TOKEN.surfaceCard} ${TOKEN.roundedShell} ${TOKEN.shadowCard}`}
      >
        <GlowLayer />
        <p className="relative text-sm text-white/55">No data.</p>
      </Panel>
    );
  }

  // ── Data helpers ─────────────────────────────────────────────────────────
  const home = { ...(fx?.localteam ?? {}), ...(teams.get(fx.localteam_id) ?? {}) };
  const away = {
    ...(fx?.visitorteam ?? {}),
    ...(teams.get(fx.visitorteam_id) ?? {}),
  };

  const toBadgeTeam = (t: any) =>
    t
      ? { ...t, logo: t.logo ?? t.logo_url ?? t.image_path ?? t.image?.path ?? "" }
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
  const isFinished =
    statusText.toLowerCase().includes("finish") ||
    statusText.toLowerCase().includes("completed");
  const isLive = statusText.toLowerCase().includes("live");
  const statusTone: "success" | "warning" | "neutral" = isFinished
    ? "success"
    : isLive
      ? "warning"
      : "neutral";

  const scoreForTeam = (tid?: number) => {
    const inn = runs.find((r) => r.team_id === tid);
    return { s: Number(inn?.score ?? 0), w: Number(inn?.wickets ?? 0) };
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

  const scoreAnimKey = `${homeSW.s}-${homeSW.w}-${awaySW.s}-${awaySW.w}-${runs.length}`;

  // ── Shared class builders ────────────────────────────────────────────────
  const teamCardCls = (tid: number) =>
    [
      "group flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
      leadingTeamId === tid
        ? `${TOKEN.ringLead} ${TOKEN.shadowLead} bg-white/[0.06]`
        : "hover:bg-white/[0.04]",
    ].join(" ");

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* ── Outer shell ────────────────────────────────────────────────────── */}
      <div
        className={`relative overflow-hidden ${TOKEN.roundedShell} ${TOKEN.border} ${TOKEN.surfaceBase} p-3 sm:p-4`}
      >
        <GlowLayer />
        <div className="absolute inset-0 backdrop-blur-xl" />

        <div className="relative space-y-5">

          {/* ── MATCH HEADER ─────────────────────────────────────────────── */}
          <Panel
            className={`relative overflow-hidden ${TOKEN.roundedShell} ${TOKEN.border} ${TOKEN.surfaceCard} ${TOKEN.shadowCard}`}
          >
            <GlowLayer />
            <div className="relative space-y-4">

              {/* Title row */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-semibold tracking-[0.28em] text-amber-200/80">
                      LIVE MATCH CENTER
                    </p>
                    {isLive && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/25 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.22em] text-red-200">
                        <span className="relative inline-flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/70" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
                        </span>
                        LIVE
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-white tracking-tight">
                    {fx.league?.name || "League"}
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    {fx.round || "—"} · {formatDate(fx.starting_at)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className={[
                      "rounded-full p-[1px]",
                      statusTone === "warning"
                        ? "bg-gradient-to-br from-amber-400/90 to-amber-600/70"
                        : statusTone === "success"
                          ? "bg-gradient-to-br from-emerald-400/90 to-amber-500/45"
                          : "bg-gradient-to-br from-white/25 to-white/5",
                    ].join(" ")}
                  >
                    <Pill tone={statusTone as any}>{statusText}</Pill>
                  </div>
                  {fx.note && <Pill>{fx.note}</Pill>}
                  <Pill>Fixture #{id}</Pill>
                </div>
              </div>

              {/* ── Score hero strip ───────────────────────────────────── */}
              <div
                className={`${TOKEN.roundedCard} ${TOKEN.border} ${TOKEN.surfaceInner} p-3 sm:p-4 ${TOKEN.shadowInner}`}
              >
                <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">

                  {/* Home */}
                  <div id="HoverStyleCard" className={teamCardCls(fx.localteam_id)}>
                    <div className="relative shrink-0">
                      <div className="absolute -inset-2 rounded-full bg-amber-400/20 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="relative rounded-full  p-1">
                        <ScoreTeamBadge team={homeBadge} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-base font-extrabold text-white tracking-tight">
                          {home?.short_name || home?.name || `Team ${fx.localteam_id}`}
                        </span>
                        {leadingTeamId === fx.localteam_id && <LeadingBadge />}
                      </div>
                      <p className="mt-0.5 text-xs text-white/50">Home</p>
                    </div>
                  </div>

                  {/* Center score */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold tracking-[0.32em] text-white/60">
                      VS
                    </span>
                    <div
                      key={scoreAnimKey}
                      className={`${TOKEN.roundedCard} ${TOKEN.border} ${TOKEN.surfaceCard} px-5 py-3 ${TOKEN.shadowCard} animate-[fadeIn_380ms_ease-out]`}
                    >
                      <p className="text-center text-[10px] font-semibold tracking-[0.32em] text-white/50 mb-1">
                        RUNS / WKTS
                      </p>
                      <div className="flex items-baseline justify-center gap-3">
                        <span className="text-3xl font-black text-white tabular-nums">
                          {homeSW.s}
                          <span className="text-white/40">/</span>
                          {homeSW.w}
                        </span>
                        <span className="text-white/25">•</span>
                        <span className="text-3xl font-black text-white tabular-nums">
                          {awaySW.s}
                          <span className="text-white/40">/</span>
                          {awaySW.w}
                        </span>
                      </div>
                      <p className="mt-1 text-center text-xs text-white/50">
                        Overs shown in innings summary
                      </p>
                    </div>
                  </div>

                  {/* Away */}
                  <div id="HoverStyleCard"
                    className={`${teamCardCls(fx.visitorteam_id)} md:flex-row-reverse md:text-right`}
                  >
                    <div className="relative shrink-0">
                      <div className="absolute -inset-2 rounded-full bg-amber-400/20 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="relative rounded-full ] p-1">
                        <ScoreTeamBadge team={awayBadge} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center justify-end gap-2">
                        {leadingTeamId === fx.visitorteam_id && <LeadingBadge />}
                        <span className="truncate text-base font-extrabold text-white tracking-tight">
                          {away?.short_name || away?.name || `Team ${fx.visitorteam_id}`}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-white/50 text-right">Away</p>
                    </div>
                  </div>
                </div>

                {/* Toss */}
                {(fx.toss_won_team_id || fx.elected) && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <Pill>
                      <span className="text-white/60">Toss: </span>
                      <span className="font-semibold text-white">
                        {tossTeam?.name ||
                          tossTeam?.short_name ||
                          (fx.toss_won_team_id ? `Team ${fx.toss_won_team_id}` : "—")}
                      </span>
                      {fx.elected && (
                        <>
                          <span className="text-white/60"> chose to </span>
                          <span className="font-semibold text-white">
                            {String(fx.elected).toLowerCase()}
                          </span>
                          <span className="text-white/60"> first</span>
                        </>
                      )}
                    </Pill>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          {/* ── INNINGS SUMMARY ───────────────────────────────────────────── */}
          {runs.length > 0 && (
            <Panel
              className={`relative overflow-hidden ${TOKEN.roundedShell} ${TOKEN.border} ${TOKEN.surfaceCard} ${TOKEN.shadowCard}`}
            >
              <GlowLayer />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-white">
                    Innings Summary
                  </h3>
                  <Pill>All innings</Pill>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
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
                          `group relative overflow-hidden ${TOKEN.roundedCard} ${TOKEN.border} ${TOKEN.surfaceInner}`,
                          "transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20",
                          isLeader
                            ? `${TOKEN.ringLead} ${TOKEN.shadowLead}`
                            : TOKEN.shadowCard,
                        ].join(" ")}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.12),transparent_60%)]" />
                        <div className="relative flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="absolute -inset-2 rounded-full bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              <ScoreTeamBadge team={toBadgeTeam(t)} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {label}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <Pill>Inn {inn.inning ?? "—"}</Pill>
                                {isLeader && <LeadingBadge />}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-white tabular-nums">
                              {inn.score ?? "–"}
                              <span className="text-white/50">/</span>
                              {inn.wickets ?? "–"}
                            </p>
                            <p className="mt-0.5 text-sm font-semibold text-white/60">
                              {inn.overs ?? "–"} ov
                            </p>
                            <p className="mt-0.5 text-xs text-white/45">
                              PP1 {inn.pp1 ?? "—"} · PP2 {inn.pp2 ?? "—"}
                            </p>
                          </div>
                        </div>
                      </SubCard>
                    );
                  })}
                </div>
              </div>
            </Panel>
          )}

          {/* ── PER-TEAM BATTING / BOWLING ────────────────────────────────── */}
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
              const isLeader = leadingTeamId === tid;

              return (
                <Panel
                  key={tid}
                  className={[
                    `relative overflow-hidden ${TOKEN.roundedShell} ${TOKEN.border} ${TOKEN.surfaceCard} ${TOKEN.shadowCard}`,
                    "transition-transform duration-300 hover:-translate-y-0.5",
                    isLeader ? TOKEN.ringLead : "",
                  ].join(" ")}
                >
                  <GlowLayer />

                  <div className="relative space-y-5">
                    {/* Team hero header */}
                    <div
                      className={`${TOKEN.roundedCard} ${TOKEN.border} ${TOKEN.surfaceInner} p-4 ${TOKEN.shadowInner}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative shrink-0">
                            <div
                              className={[
                                "absolute -inset-3 rounded-full blur-xl",
                                isLeader ? "bg-amber-400/25" : "bg-amber-400/15",
                              ].join(" ")}
                            />
                            <div className="relative rounded-full p-[2px] bg-gradient-to-br from-amber-400/90 to-amber-600/65">
                              <div className="rounded-full bg-[#060A12] p-1">
                                <TeamBadge team={toBadgeTeam(teamObj)} hideName />
                              </div>
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="truncate text-xl font-black tracking-tight text-white">
                                {teamLabel}
                              </h3>
                              {isLeader && (
                                <span className="shrink-0 rounded-full border border-amber-300/30 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.25em] text-amber-200">
                                  LEADING
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-white/50">
                              Batting & Bowling breakdown
                            </p>
                            <div className="mt-2.5 flex flex-wrap items-center gap-2">
                              <span className={`${TOKEN.roundedCard} border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/60`}>
                                {bats.length ? `${bats.length} batters` : "No batting data"}
                              </span>
                              <span className={`${TOKEN.roundedCard} border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/60`}>
                                {bowls.length ? `${bowls.length} bowlers` : "No bowling data"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Batting table ─────────────────────────────────── */}
                    <div
                      className={`${TOKEN.roundedCard} ${TOKEN.border} ${TOKEN.surfaceInner} overflow-hidden ${TOKEN.shadowInner}`}
                    >
                      <SectionHeading title={`${teamLabel} Batting`} aside="STATS" />
                      <div className="overflow-x-auto">
                        <table className="min-w-[640px] w-full text-sm">
                          <thead className="bg-[#0A1220]/90 backdrop-blur-sm">
                            <tr>
                              <Th>Batter</Th>
                              <Th>R</Th>
                              <Th>B</Th>
                              <Th>4s</Th>
                              <Th>6s</Th>
                              <Th>SR</Th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.07]">
                            {bats.length
                              ? bats.map((b: AnyRow, idx: number) => {
                                  const label = nameFor(b);
                                  const pid = b.player_id ? Number(b.player_id) : undefined;
                                  return (
                                    <tr
                                      key={b.id ?? `${tid}-bat-${pid}-${b.score}-${b.ball}`}
                                      className={[
                                        idx % 2 ? TOKEN.surfaceRow : "bg-transparent",
                                        "transition-colors hover:bg-amber-400/[0.07]",
                                      ].join(" ")}
                                    >
                                      <Td left>
                                        {pid ? (
                                          <Link
                                            href={`/players/${pid}`}
                                            className="text-white hover:underline underline-offset-4"
                                          >
                                            {label}
                                          </Link>
                                        ) : (
                                          <span className="text-white">{label}</span>
                                        )}
                                      </Td>
                                      <Td bold>{b.score ?? "–"}</Td>
                                      <Td>{b.ball ?? "–"}</Td>
                                      <Td>{b.four_x ?? "–"}</Td>
                                      <Td>{b.six_x ?? "–"}</Td>
                                      <Td>{b.rate ?? "–"}</Td>
                                    </tr>
                                  );
                                })
                              : Array.from({ length: 5 }).map((_, i) => (
                                  <tr key={i} className={i % 2 ? TOKEN.surfaceRow : ""}>
                                    <BlankRow cols={6} />
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* ── Bowling table ─────────────────────────────────── */}
                    <div
                      className={`${TOKEN.roundedCard} ${TOKEN.border} ${TOKEN.surfaceInner} overflow-hidden ${TOKEN.shadowInner}`}
                    >
                      <SectionHeading title={`${teamLabel} Bowling`} aside="STATS" />
                      <div className="overflow-x-auto">
                        <table className="min-w-[640px] w-full text-sm">
                          <thead className="bg-[#0A1220]/90 backdrop-blur-sm">
                            <tr>
                              <Th>Bowler</Th>
                              <Th>O</Th>
                              <Th>M</Th>
                              <Th>R</Th>
                              <Th>W</Th>
                              <Th>ECO</Th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.07]">
                            {bowls.length
                              ? bowls.map((b: AnyRow, idx: number) => {
                                  const label = nameFor(b);
                                  const pid = b.player_id ? Number(b.player_id) : undefined;
                                  return (
                                    <tr
                                      key={b.id ?? `${tid}-bowl-${pid}-${b.overs}-${b.runs}`}
                                      className={[
                                        idx % 2 ? TOKEN.surfaceRow : "bg-transparent",
                                        "transition-colors hover:bg-amber-400/[0.07]",
                                      ].join(" ")}
                                    >
                                      <Td left>
                                        {pid ? (
                                          <Link
                                            href={`/players/${pid}`}
                                            className="text-white hover:underline underline-offset-4"
                                          >
                                            {label}
                                          </Link>
                                        ) : (
                                          <span className="text-white">{label}</span>
                                        )}
                                      </Td>
                                      <Td>{b.overs ?? "–"}</Td>
                                      <Td>{b.medians ?? "–"}</Td>
                                      <Td bold>{b.runs ?? "–"}</Td>
                                      <Td bold>{b.wickets ?? "–"}</Td>
                                      <Td>{b.rate ?? "–"}</Td>
                                    </tr>
                                  );
                                })
                              : Array.from({ length: 5 }).map((_, i) => (
                                  <tr key={i} className={i % 2 ? TOKEN.surfaceRow : ""}>
                                    <BlankRow cols={6} />
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

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0)  scale(1);     }
        }
          body {
            background: var(--bg-primary);
          }
      `}</style>
    </div>
  );
}