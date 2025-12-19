"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";

interface Country {
  id: number;
  name: string;
  image_path?: string;
}

interface Player {
  id: number;
  fullname: string;
  image_path?: string;
  position?: {
    name: string;
  };
  dateofbirth?: string;
  battingstyle?: string;
  bowlingstyle?: string;
}

interface Team {
  id: number;
  name: string;
  code: string;
  image_path?: string;
  national_team: boolean;
  country?: Country;
  squad?: {
    data?: Player[];
  };
  updated_at?: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR(`/api/teams/${params.id}`, fetcher);

  const teamData: Team = data?.data;

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => window.history.back()}
          className="text-amber-400 hover:text-amber-300 text-sm font-medium"
        >
          ← Back to Teams
        </button>
        <div className="rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-xl p-6 shadow-2xl">
          <p className="text-red-300 font-medium">
            Failed to load team details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-900/80 border border-white/20 rounded w-32 mb-6 backdrop-blur-xl"></div>
          <div className="h-32 bg-slate-900/80 border border-white/20 rounded-3xl mb-6 backdrop-blur-xl"></div>
          <div className="h-64 bg-slate-900/80 border border-white/20 rounded-2xl backdrop-blur-xl"></div>
        </div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => window.history.back()}
          className="text-amber-400 hover:text-amber-300 text-sm font-medium"
        >
          ← Back to Teams
        </button>
        <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl p-6 shadow-2xl">
          <p className="text-white">Team not found</p>
        </div>
      </div>
    );
  }

  const squad = teamData.squad?.data || [];

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium mb-6 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Teams
      </button>

      {/* Team Header */}
      <div className="bg-gradient-to-r from-slate-800/90 via-slate-900/90 to-slate-800/90 rounded-3xl border border-amber-400/30 p-8 mb-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Team Logo */}
          <div className="relative w-32 h-32 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 flex items-center justify-center">
            {teamData.image_path ? (
              <Image
                src={teamData.image_path}
                alt={teamData.name}
                width={96}
                height={96}
                className="object-contain"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-4xl font-black text-slate-900">
                  {teamData.code || teamData.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Team Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {teamData.name}
              </h1>
              {teamData.national_team && (
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold rounded-full">
                  NATIONAL TEAM
                </span>
              )}
            </div>

            {teamData.country && (
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                {teamData.country.image_path && (
                  <Image
                    src={teamData.country.image_path}
                    alt={teamData.country.name}
                    width={24}
                    height={16}
                    className="rounded"
                  />
                )}
                <p className="text-sky-200 text-lg">{teamData.country.name}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <span className="text-amber-300 font-semibold">Code: </span>
                <span className="text-white font-bold">{teamData.code}</span>
              </div>
              {squad.length > 0 && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                  <span className="text-amber-300 font-semibold">Squad: </span>
                  <span className="text-white font-bold">
                    {squad.length} Players
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Squad Section */}
      <div className="bg-slate-900/80 rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-b border-amber-400/30 px-6 py-4">
          <h2 className="text-2xl font-bold text-amber-300">Squad</h2>
        </div>

        {squad.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 text-amber-300/50 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-white font-medium">
              No squad information available
            </p>
            <p className="text-sm text-sky-100/70 mt-2">
              Squad details will appear here when available
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {squad.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.id}`}
                  className="bg-slate-800/60 rounded-xl p-4 border border-white/10 hover:border-amber-400/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(251,191,36,0.2)]"
                >
                  <div className="flex items-center gap-4">
                    {/* Player Avatar */}
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {player.image_path ? (
                        <Image
                          src={player.image_path}
                          alt={player.fullname}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-black text-slate-900">
                          {player.fullname
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}{" "}
                        </span>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm truncate">
                        {player.fullname}
                      </h3>
                      {player.position?.name && (
                        <p className="text-amber-300 text-xs font-medium mt-1">
                          {player.position.name}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {player.battingstyle && (
                          <span className="px-2 py-0.5 bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs rounded">
                            {player.battingstyle}
                          </span>
                        )}
                        {player.bowlingstyle && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs rounded">
                            {player.bowlingstyle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
