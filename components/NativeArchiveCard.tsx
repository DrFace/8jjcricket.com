import { FormatDateToArchive } from "@/lib/utils";
import { ArchiveCardProps } from "@/types/archive";
import Link from "next/link";
import { useState } from "react";

export function NativeArchiveCard({ archive }: ArchiveCardProps) {
  const [homeImageError, setHomeImageError] = useState(false);
  const [awayImageError, setAwayImageError] = useState(false);

  return (
    <Link href={`/match/${archive.sportmonks_fixture_id}`} className="block">
      <div className="rounded-2xl border border-india-gold/20 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl p-5 shadow-lg hover:border-india-gold hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] transition-all duration-300 group cursor-pointer h-full flex flex-col">
        {/* Format and Category Badges */}
        <div className="flex items-center gap-2 mb-3">
          {archive.format && (
            <span
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${
                archive.format === "T20"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : archive.format === "ODI"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {archive.format}
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${
              archive.category === "International"
                ? "bg-india-gold/20 text-india-gold border border-india-gold/30"
                : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
            }`}
          >
            {archive.category}
          </span>
          <span className="ml-auto text-[10px] text-emerald-400 font-bold uppercase tracking-wide">
            {archive.status}
          </span>
        </div>

        {/* Match Title */}
        <h3 className="text-base font-bold text-white mb-4 group-hover:text-india-gold transition-colors line-clamp-2 min-h-[3rem]">
          {archive.match_title}
        </h3>

        {/* Round */}
        {archive.round && (
          <p className="text-xs text-sky-200/70 mb-3 font-medium">{archive.round}</p>
        )}

        {/* Scores */}
        <div className="space-y-3 mb-4 flex-grow">
          <div className="flex items-center justify-between bg-black/40 rounded-xl px-3 py-2 border border-white/5 group-hover:border-india-gold/20 transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden border border-white/10 bg-white/5">
                {archive.home_team_logo && !homeImageError ? (
                  <img
                    src={archive.home_team_logo}
                    alt={archive.home_team}
                    className="w-full h-full object-contain p-0.5"
                    loading="lazy"
                    onError={() => setHomeImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {archive.home_team
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase() || "??"}
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-white truncate">
                {archive.home_team}
              </span>
            </div>
            <span className="text-sm font-bold text-india-gold ml-2">
              {archive.home_score || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between bg-black/40 rounded-xl px-3 py-2 border border-white/5 group-hover:border-india-gold/20 transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden border border-white/10 bg-white/5">
                {archive.away_team_logo && !awayImageError ? (
                  <img
                    src={archive.away_team_logo}
                    alt={archive.away_team}
                    className="w-full h-full object-contain p-0.5"
                    loading="lazy"
                    onError={() => setAwayImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xs">
                    {archive.away_team
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase() || "??"}
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-white truncate">
                {archive.away_team}
              </span>
            </div>
            <span className="text-sm font-bold text-india-gold ml-2">
              {archive.away_score || "-"}
            </span>
          </div>
        </div>

        {/* Result */}
        {archive.result && (
          <div className="bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-500/20 rounded-xl px-3 py-2 mb-4">
            <p className="text-xs text-emerald-300 font-medium line-clamp-2">
              {archive.result}
            </p>
          </div>
        )}

        {/* Match Date */}
        <div className="flex items-center justify-between text-xs text-sky-100/60 pt-3 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5 text-india-gold/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">{FormatDateToArchive(archive.match_date)}</span>
          </div>
          <div className="flex items-center gap-1 text-india-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
            <span className="text-[10px] uppercase tracking-wider">Details</span>
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
