"use client";

import React from "react";

type Season = {
  id: number;
  name: string;
  starting_at?: string;
  ending_at?: string;
  is_current?: boolean;
  league_id?: number;
};

type StandingTeam = {
  name?: string;
};

type Standing = {
  id: number;
  played?: number;
  won?: number;
  lost?: number;
  points?: number;
  team?: StandingTeam;
};

type PointsTableProps = {
  seasons: Season[];
  sortedSeasons: Season[];
  seasonId?: number | null;
  onSeasonChange: (seasonId: number) => void;

  standingsData?: { data?: Standing[] } | null;
  isLoading?: boolean;
};

export default function PointsTable({
  seasons,
  sortedSeasons,
  seasonId,
  onSeasonChange,
  standingsData,
  isLoading,
}: PointsTableProps) {
  const rows = standingsData?.data ?? [];

  return (
    <div className="p-6" key={`points-${seasonId}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/90 via-slate-900/90 to-slate-800/90 rounded-t-2xl p-6 mb-0 border border-amber-400/30 border-b-0 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-amber-300 drop-shadow-lg">
              Points Table
            </h2>

            {seasons.length > 0 && (
              <div className="mt-3">
                <select
                  value={seasonId || ""}
                  onChange={(e) => onSeasonChange(Number(e.target.value))}
                  className="bg-slate-900/80 backdrop-blur-sm text-amber-200 border-2 border-amber-400/50 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
                >
                  {sortedSeasons.map((season) => (
                    <option
                      key={season.id}
                      value={season.id}
                      className="bg-slate-900 text-amber-200"
                    >
                      {season.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="bg-amber-400/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-amber-400/30">
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-wide">
              {rows.length > 0 ? "Latest Standings" : "Standings"}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      {isLoading || !standingsData ? (
        <div className="bg-slate-900/80 rounded-b-2xl border border-t-0 border-amber-400/30 p-12 text-center backdrop-blur-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-300/30 border-t-amber-400 mx-auto"></div>
          <p className="text-white mt-4 font-medium">Loading standings...</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-slate-900/80 rounded-b-2xl border border-t-0 border-amber-400/30 p-12 text-center backdrop-blur-xl">
          <svg
            className="w-20 h-20 text-amber-300/50 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-white font-semibold text-lg">
            No standings available
          </p>
          <p className="text-sky-100/70 text-sm mt-2">
            Points table will be updated once matches begin
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/80 rounded-b-2xl border border-t-0 border-amber-400/30 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-b-2 border-amber-400/30">
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 rounded-full flex items-center justify-center text-sm font-black">
                        #
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <div className="flex flex-col items-center">
                      <span>Played</span>
                      <span className="text-sky-200">P</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <div className="flex flex-col items-center">
                      <span>Won</span>
                      <span className="text-emerald-400">W</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <div className="flex flex-col items-center">
                      <span>Lost</span>
                      <span className="text-red-400">L</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <div className="flex flex-col items-center">
                      <span>Points</span>
                      <span className="text-amber-400">PTS</span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {rows.map((standing, index) => {
                  const isTop3 = index < 3;
                  const isLast = index === rows.length - 1;

                  return (
                    <tr
                      key={standing.id}
                      className={`transition-all duration-200 hover:bg-slate-800/60 ${
                        isTop3
                          ? "bg-gradient-to-r from-amber-950/20 to-transparent"
                          : ""
                      } ${isLast ? "bg-red-950/20" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-slate-900 shadow-lg shadow-yellow-500/50"
                                : index === 1
                                ? "bg-gradient-to-br from-gray-300 to-gray-500 text-slate-900 shadow-md shadow-gray-400/50"
                                : index === 2
                                ? "bg-gradient-to-br from-orange-400 to-orange-600 text-slate-900 shadow-md shadow-orange-500/50"
                                : "bg-slate-800/80 text-amber-300 border border-white/20"
                            }`}
                          >
                            {index + 1}
                          </span>

                          {isTop3 && (
                            <svg
                              className="w-5 h-5 text-amber-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-white">
                          {standing.team?.name || "Team"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800/80 border border-sky-400/30 text-sky-200 font-bold text-base">
                          {standing.played || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800/80 border border-emerald-400/30 text-emerald-300 font-bold text-base">
                          {standing.won || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800/80 border border-red-400/30 text-red-300 font-bold text-base">
                          {standing.lost || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="inline-flex items-center justify-center w-16 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-bold text-lg shadow-lg shadow-amber-500/50">
                            {standing.points || 0}
                          </span>

                          {isTop3 && (
                            <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold rounded">
                              Q
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-6 py-4 border-t-2 border-amber-400/30">
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-sm"></div>
                <span className="text-amber-200 font-medium">1st Place</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-amber-200 font-medium">Top 3 Teams</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-bold rounded">
                  Q
                </span>
                <span className="text-amber-200 font-medium">Qualified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
