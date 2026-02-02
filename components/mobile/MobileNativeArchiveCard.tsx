"use client";

import { FormatDateToArchive } from "@/lib/utils";
import { ArchiveCardProps } from "@/types/archive";
import Link from "next/link";
import { useState } from "react";

export function MobileNativeArchiveCard({ archive }: ArchiveCardProps) {
  const [homeImageError, setHomeImageError] = useState(false);
  const [awayImageError, setAwayImageError] = useState(false);

  return (
    <Link
      href={`/mobile/match/${archive.sportmonks_fixture_id}`}
      className="block"
    >
      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 backdrop-blur-xl p-5 shadow-2xl hover:border-amber-400/60 hover:shadow-[0_20px_40px_rgba(251,191,36,0.1)] transition-all duration-300 group cursor-pointer overflow-hidden relative">
        {/* Format and Category Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3 relative z-10">
          {archive.format && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                archive.format === "T20"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  : archive.format === "ODI"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {archive.format}
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
              archive.category === "International"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
            }`}
          >
            {archive.category}
          </span>
          <span className="ml-auto text-[10px] text-emerald-400 font-medium uppercase tracking-wide">
            {archive.status}
          </span>
        </div>

        {/* Match Title */}
        <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors relative z-10">
          {archive.match_title}
        </h3>

        {/* Round */}
        {archive.round && (
          <p className="text-xs text-sky-200/70 mb-3 relative z-10">
            {archive.round}
          </p>
        )}

        {/* Scores */}
        <div className="space-y-2 mb-4 relative z-10">
          <div className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2 border border-white/5">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                {archive.home_team_logo && !homeImageError ? (
                  <img
                    src={archive.home_team_logo || "/placeholder.svg"}
                    alt={archive.home_team}
                    className="w-10 h-10 rounded-full object-cover bg-gray-800 border-2 border-gray-700"
                    loading="lazy"
                    onError={() => setHomeImageError(true)}
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {archive.home_team
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase() || "??"}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-white truncate">
                {archive.home_team}
              </span>
            </div>
            <span className="text-sm font-bold text-amber-300 ml-2">
              {archive.home_score || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2 border border-white/5">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                {archive.away_team_logo && !awayImageError ? (
                  <img
                    src={archive.away_team_logo || "/placeholder.svg"}
                    alt={archive.away_team}
                    className="w-10 h-10 rounded-full object-cover bg-gray-800 border-2 border-gray-700"
                    loading="lazy"
                    onError={() => setAwayImageError(true)}
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {archive.away_team
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase() || "??"}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-white truncate">
                {archive.away_team}
              </span>
            </div>
            <span className="text-sm font-bold text-amber-300 ml-2">
              {archive.away_score || "N/A"}
            </span>
          </div>
        </div>

        {/* Result */}
        {archive.result && (
          <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 rounded-lg px-3 py-2 mb-3 relative z-10">
            <p className="text-xs text-emerald-200 font-medium">
              {archive.result}
            </p>
          </div>
        )}

        {/* Match Date */}
        <div className="flex items-center justify-between text-xs text-sky-100/60 pt-3 border-t border-white/5 relative z-10">
          <div className="flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5"
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
            {FormatDateToArchive(archive.match_date)}
          </div>
          <div className="flex items-center gap-1 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-medium">View Details</span>
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
