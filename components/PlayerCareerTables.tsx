import React, { useMemo, useState } from "react";
import { SummaryTable } from "./SummaryTable";
import {
  Career,
  BattingStats,
  BowlingStats,
  CRICKETS_FORMATS,
} from "@/types/player";
import { BuildSummary } from "@/lib/player";
import { CareerDetailsTable } from "./CareerDetailsTable";

const battingRows = [
  { label: "Matches", get: (b: BattingStats | null) => b?.matches ?? "-" },
  { label: "Innings", get: (b: BattingStats | null) => b?.innings ?? "-" },
  { label: "Runs", get: (b: BattingStats | null) => b?.runs_scored ?? "-" },
  { label: "Balls", get: (b: BattingStats | null) => b?.balls_faced ?? "-" },
  {
    label: "Highest",
    get: (b: BattingStats | null) => b?.highest_inning_score ?? "-",
  },
  { label: "Average", get: (b: BattingStats | null) => b?.average ?? "-" },
  { label: "SR", get: (b: BattingStats | null) => b?.strike_rate ?? "-" },
  { label: "Not Out", get: (b: BattingStats | null) => b?.not_outs ?? "-" },
  { label: "Fours", get: (b: BattingStats | null) => b?.four_x ?? "-" },
  { label: "Sixes", get: (b: BattingStats | null) => b?.six_x ?? "-" },
  { label: "50s", get: (b: BattingStats | null) => b?.fifties ?? "-" },
  { label: "100s", get: (b: BattingStats | null) => b?.hundreds ?? "-" },
] as const;

const bowlingRows = [
  { label: "Matches", get: (b: BowlingStats | null) => b?.matches ?? "-" },
  { label: "Innings", get: (b: BowlingStats | null) => b?.innings ?? "-" },
  { label: "Overs", get: (b: BowlingStats | null) => b?.overs ?? "-" },
  { label: "Runs", get: (b: BowlingStats | null) => b?.runs ?? "-" },
  { label: "Wickets", get: (b: BowlingStats | null) => b?.wickets ?? "-" },
  { label: "Avg", get: (b: BowlingStats | null) => b?.average ?? "-" },
  { label: "Eco", get: (b: BowlingStats | null) => b?.econ_rate ?? "-" },
  { label: "SR", get: (b: BowlingStats | null) => b?.strike_rate ?? "-" },
  { label: "4w", get: (b: BowlingStats | null) => b?.four_wickets ?? "-" },
  { label: "5w", get: (b: BowlingStats | null) => b?.five_wickets ?? "-" },
  { label: "10w", get: (b: BowlingStats | null) => b?.ten_wickets ?? "-" },
] as const;

export function PlayerCareerTables({ careers }: { careers: Career[] }) {
  const { battingSummary, bowlingSummary } = useMemo(
    () => BuildSummary(careers),
    [careers]
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="grid grid-cols-2 gap-4">
        {/* 3) Batting career summary (like screenshot) */}
        <SummaryTable<BattingStats>
          title="Batting Career Summary"
          columns={CRICKETS_FORMATS}
          dataByColumn={battingSummary}
          rows={battingRows as any}
        />

        {/* 4) Bowling career summary (like screenshot) */}
        <SummaryTable<BowlingStats>
          title="Bowling Career Summary"
          columns={CRICKETS_FORMATS}
          dataByColumn={bowlingSummary}
          rows={bowlingRows as any}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* 1) Batting details */}
        <CareerDetailsTable
          title="Batting Details"
          careers={careers}
          kind="batting"
        />

        {/* 2) Bowling details */}
        <CareerDetailsTable
          title="Bowling Details"
          careers={careers}
          kind="bowling"
        />
      </div>
    </div>
  );
}
