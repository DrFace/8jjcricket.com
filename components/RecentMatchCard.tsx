"use client";

import Link from "next/link";
import { formatDate, cn } from "@/lib/utils";
import TeamBadge from "@/components/TeamBadge";
import type { Fixture } from "@/types/fixture";
import { CalcRuns, ScoreLine } from "@/lib/match";

export default function RecentMatchCard({ f }: { f: Fixture }) {
  const home = f.localteam;
  const away = f.visitorteam;

  const homeLabel = home?.short_name || home?.name || `Team ${f.localteam_id}`;
  const awayLabel =
    away?.short_name || away?.name || `Team ${f.visitorteam_id}`;

  // Pre-formatted scores from API with fallback to calculated runs
  const runsArr = Array.isArray((f as any).runs) ? (f as any).runs : [];
  const homeRuns = CalcRuns(runsArr, f.localteam_id);
  const awayRuns = CalcRuns(runsArr, f.visitorteam_id);
  const localteamScore = f.localteam_score || ScoreLine(homeRuns) || "-";
  const visitorteamScore = f.visitorteam_score || ScoreLine(awayRuns) || "-";

  const metaLine = `${f.round ?? "Match"} · ${formatDate(f.starting_at)}`;

  return (
    <Link
      href={`/match/${f.sportmonks_id}`}
      className={cn(
        "group block rounded-xl india-card-gradient transition-all duration-300",
        "hover:border-india-green/30 hover:bg-slate-900/80 hover:scale-[1.01]"
      )}
    >
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate group-hover:text-india-green transition-colors">
              {homeLabel} vs {awayLabel}
            </h3>

            <p className="mt-0.5 text-[11px] text-gray-400">{metaLine}</p>

            {f.status && (
              <p className="mt-0.5 text-[11px] text-india-green/80">{f.status}</p>
            )}
          </div>

        </div>

        <div className="mt-2 h-px w-full bg-white/5 group-hover:bg-india-green/20 transition-colors" />

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
            <TeamBadge team={home} className="justify-start text-gray-200 flex-1 min-w-0" />
            <span className="text-sm font-bold text-india-gold flex-shrink-0">
              {localteamScore}
            </span>
          </div>

          <div className="px-2 text-[11px] text-gray-500 uppercase tracking-wide">
            vs
          </div>

          <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-india-gold flex-shrink-0">
              {visitorteamScore}
            </span>
            <TeamBadge
              team={away}
              className="justify-end text-right text-gray-200 flex-1 min-w-0"
            />
          </div>
        </div>

        {f.note && <p className="mt-2 text-xs text-gray-400 italic">{f.note}</p>}
      </div>
    </Link>
  );
}

