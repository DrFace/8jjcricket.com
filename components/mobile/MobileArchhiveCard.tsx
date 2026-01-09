"use client";

import Link from "next/link";
import { formatDate, cn } from "@/lib/utils";
import type { Match } from "@/lib/cricket-types";
import MobileTeamBadge from "./MobileTeamBadge";

export default function MobileArchiveCard({ f }: { f: Match }) {
  const home = f.localteam;
  const away = f.visitorteam;

  const metaLine = f.round ?? "Match";
  const dateLine = formatDate(f.starting_at);

  return (
    <div className="relative group">
      <div className="absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-amber-500/60 via-amber-400/50 to-amber-600/60 via-slate-900 to-slate-950 backdrop-blur-xl shadow-2xl group-hover:shadow-amber-500/40 group-hover:border-amber-400/90 transition-all duration-300" />

      <div
        className="
          pointer-events-none
          absolute -inset-1 rounded-2xl
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-amber-600/25
          blur-xl
        "
      />

      <Link
        href={`/mobile/match/${f.id}`}
        className="relative z-10 block rounded-2xl px-5 py-5 transition-transform duration-300 group-hover:scale-105"
      >
        <div className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3">
          {dateLine.toString().split(",")[2]}
        </div>

        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex flex-col gap-2">
            {/* {f.status && (
              <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                {f.status}
              </div>
            )} */}
            <p className="text-sm font-black text-white uppercase tracking-wider">
              {metaLine}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide border-2 transition-all whitespace-nowrap",
              f.live
                ? "bg-red-500/30 text-red-200 border-red-400/60 animate-pulse"
                : "bg-slate-700/60 text-slate-200 border-slate-600/60"
            )}
          >
            {f.live
              ? "LIVE"
              : f.status === "Finished"
              ? "FINISHED"
              : "Upcoming"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 py-5 px-4 rounded-xl bg-slate-800/40 border border-slate-700/60 group-hover:border-amber-500/40 transition-colors mb-4">
          <div className="flex-1 min-w-0">
            <MobileTeamBadge team={home} size={70} className="justify-start" />
          </div>

          <div
            className="px-4 py-2 text-white font-black text-lg uppercase tracking-widest
            bg-gradient-to-r from-amber-400 via-amber-600 to-amber-800
            rounded-lg shadow-lg whitespace-nowrap"
          >
            VS
          </div>

          <div className="flex-1 min-w-0 flex justify-end">
            <MobileTeamBadge
              team={away}
              size={70}
              className="justify-end text-right"
            />
          </div>
        </div>

        {f.note && (
          <p className="text-xs text-slate-300 font-medium italic border-l-2 border-amber-500/60 pl-3 py-2 rounded bg-slate-800/30">
            {f.note}
          </p>
        )}
      </Link>
    </div>
  );
}
