"use client";

import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import type { Fixture } from "@/types/fixture";
import MobileRecentBadge from "./MobileRecentBadge";
import { CalcRuns } from "@/lib/match";

export default function MobileLiveCard({ f }: { f: Fixture }) {
  const home = f.localteam;
  const away = f.visitorteam;

  const homeLabel = home?.short_name || home?.name || "Home";
  const awayLabel = away?.short_name || away?.name || "Away";

  const runsArr = Array.isArray((f as any).runs) ? (f as any).runs : [];

  const homeRuns = CalcRuns(runsArr, f.localteam_id);
  const awayRuns = CalcRuns(runsArr, f.visitorteam_id);

  return (
    <Link
      href={`/mobile/match/${f.fixture_id}`}
      className="block active:scale-[0.98] transition-transform"
    >
      {/* Gradient border */}
      <div
        className={cn(
          "relative rounded-2xl p-[0.2px]",
          "bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500",
          "shadow-lg shadow-amber-500/25"
        )}
      >
        {/* Card body */}
        <div
          className={cn(
            "relative rounded-2xl p-4",
            "bg-gradient-to-br from-[#0E1118] via-[#0B0E14] to-black"
          )}
        >
          {/* LIVE glow */}
          {f.live && (
            <div className="absolute inset-0 rounded-2xl ring-1 ring-red-500/30 animate-pulse" />
          )}

          {/* Header */}
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="
              text-sm sm:text-base
              font-extrabold
              text-transparent bg-clip-text
              bg-gradient-to-r from-white to-sky-200
              truncate
            "
              >
                {homeLabel} vs {awayLabel}
              </h3>

              <p className="mt-0.5 text-[11px] text-sky-100/60">
                {f.round ?? "Match"} · {formatDate(f.starting_at)}
              </p>
            </div>

            {/* LIVE badge */}
            <span
              className={cn(
                "relative shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold",
                f.live
                  ? "bg-red-500 text-white shadow-md shadow-red-500/40"
                  : "bg-white/10 text-sky-100/70"
              )}
            >
              {f.live && (
                <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-red-400 animate-ping" />
              )}
              {f.live ? "LIVE" : "FINISHED"}
            </span>
          </div>

          {/* Divider */}
          <div className="my-3 h-px bg-white/10" />

          {/* Teams */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex-1 flex justify-start">
              <MobileRecentBadge runs={homeRuns} team={home} />
            </div>

            <div className="flex flex-col items-center shrink-0 px-1">
              <span className=" font-bold text-amber-200">VS</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
            </div>

            <div className="flex-1 flex justify-end">
              <MobileRecentBadge runs={awayRuns} team={away} />
            </div>
          </div>

          {/* Result */}
          {f.note && (
            <div
              className="
            mt-3
            rounded-xl
            bg-gradient-to-r from-emerald-500/15 to-sky-500/10
            px-3 py-2
            text-[12px]
            font-semibold
            text-emerald-200
            break-words
            text-left sm:text-center
          "
            >
              {f.note}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
