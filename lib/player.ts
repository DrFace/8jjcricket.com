import {
  BattingStats,
  BowlingStats,
  Career,
  CRICKETS_FORMATS,
  CricketsFormat,
  PlayerRespond,
} from "@/types/player";

export const ToNum = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
};

// cricket overs like "10.4" = 10 overs + 4 balls
export function OversToBalls(overs: string | null | undefined): number {
  if (!overs) return 0;
  const [oStr, bStr = "0"] = overs.split(".");
  const o = ToNum(oStr);
  const b = ToNum(bStr);
  return o * 6 + b; // b should be 0..5 in valid data
}

export function BallsToOversString(balls: number): string {
  const o = Math.floor(balls / 6);
  const b = balls % 6;
  return `${o}.${b}`;
}

export function Format2(n: number): string {
  return n.toFixed(2);
}

/** ---- Aggregators (per format) ---- */
export function AggregateBatting(items: Career[]): BattingStats | null {
  const batting = items.map((c) => c.batting).filter(Boolean) as BattingStats[];
  if (batting.length === 0) return null;

  const matches = batting.reduce((a, x) => a + (x.matches ?? 0), 0);
  const innings = batting.reduce((a, x) => a + (x.innings ?? 0), 0);
  const runs = batting.reduce((a, x) => a + (x.runs_scored ?? 0), 0);
  const balls = batting.reduce((a, x) => a + (x.balls_faced ?? 0), 0);
  const notOuts = batting.reduce((a, x) => a + (x.not_outs ?? 0), 0);

  const highest = batting.reduce(
    (m, x) => Math.max(m, x.highest_inning_score ?? 0),
    0
  );
  const fours = batting.reduce((a, x) => a + (x.four_x ?? 0), 0);
  const sixes = batting.reduce((a, x) => a + (x.six_x ?? 0), 0);
  const hundreds = batting.reduce((a, x) => a + (x.hundreds ?? 0), 0);
  const fifties = batting.reduce((a, x) => a + (x.fifties ?? 0), 0);

  const outs = Math.max(innings - notOuts, 0);
  const avg = outs > 0 ? runs / outs : 0;
  const sr = balls > 0 ? (runs / balls) * 100 : 0;

  return {
    matches,
    innings,
    runs_scored: runs,
    not_outs: notOuts,
    highest_inning_score: highest,
    balls_faced: balls,
    average: Format2(avg),
    strike_rate: Format2(sr),
    four_x: fours,
    six_x: sixes,
    fow_score: null,
    fow_balls: null,
    hundreds,
    fifties,
  };
}

export function AggregateBowling(items: Career[]): BowlingStats | null {
  const bowling = items.map((c) => c.bowling).filter(Boolean) as BowlingStats[];
  if (bowling.length === 0) return null;

  const matches = bowling.reduce((a, x) => a + (x.matches ?? 0), 0);
  const innings = bowling.reduce((a, x) => a + (x.innings ?? 0), 0);
  const runs = bowling.reduce((a, x) => a + (x.runs ?? 0), 0);
  const wickets = bowling.reduce((a, x) => a + (x.wickets ?? 0), 0);

  const balls = bowling.reduce((a, x) => a + OversToBalls(x.overs), 0);
  const oversStr = BallsToOversString(balls);

  const wides = bowling.reduce((a, x) => a + (x.wide ?? 0), 0);
  const noballs = bowling.reduce((a, x) => a + (x.noball ?? 0), 0);

  const fourW = bowling.reduce((a, x) => a + (x.four_wickets ?? 0), 0);
  const fiveW = bowling.reduce((a, x) => a + (x.five_wickets ?? 0), 0);
  const tenW = bowling.reduce((a, x) => a + (x.ten_wickets ?? 0), 0);

  const oversFloat = balls / 6;
  const econ = oversFloat > 0 ? runs / oversFloat : 0;
  const avg = wickets > 0 ? runs / wickets : 0;
  const sr = wickets > 0 ? balls / wickets : 0;

  return {
    matches,
    innings,
    overs: oversStr,
    runs,
    wickets,
    wide: wides,
    noball: noballs,
    econ_rate: Format2(econ),
    average: Format2(avg),
    strike_rate: Format2(sr),
    four_wickets: fourW,
    five_wickets: fiveW,
    ten_wickets: tenW,
    rate: Format2(econ),
  };
}

export function BuildSummary(careers: Career[]) {
  const byFormat = new Map<CricketsFormat, Career[]>();
  for (const f of CRICKETS_FORMATS) byFormat.set(f, []);

  for (const c of careers) {
    const t = (c.type ?? "").trim() as CricketsFormat;
    if (CRICKETS_FORMATS.includes(t)) byFormat.get(t)!.push(c);
  }

  const battingSummary: Record<CricketsFormat, BattingStats | null> = {
    Test: AggregateBatting(byFormat.get("Test")!),
    ODI: AggregateBatting(byFormat.get("ODI")!),
    T20: AggregateBatting(byFormat.get("T20")!),
    T20I: AggregateBatting(byFormat.get("T20I")!),
  };

  const bowlingSummary: Record<CricketsFormat, BowlingStats | null> = {
    Test: AggregateBowling(byFormat.get("Test")!),
    ODI: AggregateBowling(byFormat.get("ODI")!),
    T20: AggregateBowling(byFormat.get("T20")!),
    T20I: AggregateBowling(byFormat.get("T20I")!),
  };

  return { battingSummary, bowlingSummary };
}

export function GetDisplayName(p: PlayerRespond): string {
  return (
    p.fullname ??
    p.name ??
    [p.firstname, p.lastname].filter(Boolean).join(" ") ??
    `Player #${p.id}`
  );
}
