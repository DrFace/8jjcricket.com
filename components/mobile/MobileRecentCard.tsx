"use client";

import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import type { Fixture } from "@/types/fixture";
import MobileRecentBadge from "./MobileRecentBadge";
import { CalcRuns, ExtractTarget } from "@/lib/match";

export default function MobileRecentCard({ f }: { f: Fixture }) {
  const home = f.localteam;
  const away = f.visitorteam;

  const homeLabel = home?.short_name || home?.name || "Home";
  const awayLabel = away?.short_name || away?.name || "Away";

  const runsArr = Array.isArray((f as any).runs) ? (f as any).runs : [];

  const homeRuns = CalcRuns(runsArr, f.localteam_id);
  const awayRuns = CalcRuns(runsArr, f.visitorteam_id);

  const target = ExtractTarget(f.note);

  return (
    <Link
      href={`/mobile/match/${f.sportmonks_id}`}
      className="block active:scale-[0.98] transition-transform"
    >
      {/* Gradient border */}
      <div
        className={cn(
          "relative rounded-2xl p-[0.2px]",
          "bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500",
          "shadow-lg shadow-amber-500/25",
        )}
      >
        {/* Card body */}
        <div
          className={cn(
            "relative rounded-2xl p-4",
            "bg-gradient-to-br from-[#0E1118] via-[#0B0E14] to-black",
          )}
        >
          <p className="mt-0.5 text-[11px] text-sky-100/60 text-center">
            {f.round ?? "Match"} · {formatDate(f.starting_at)}
          </p>
          {/* Teams */}
          <div className="relative z-10 flex items-center justify-between gap-2 my-3">
            <div className="flex-1 flex justify-start">
              <MobileRecentBadge runs={homeRuns} team={home} />
            </div>

            <div className="flex flex-col items-center shrink-0 px-1">
              <span className="text-[18px] tracking-widest text-amber-300 font-bold">
                VS
              </span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
            </div>

            <div className="flex-1 flex justify-end">
              <MobileRecentBadge runs={awayRuns} team={away} />
            </div>
          </div>

          {f.note && f.note != "No result" ? (
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
            text-center sm:text-center
          "
            >
              {target ? target : f.note == "No result" ? "-" : f.note}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
