"use client";

import { useState } from "react";
import useSWR from "swr";

import LiveGrid from "@/components/LiveGrid";
import LiveCard from "@/components/LiveCard";
import BetButton from "@/components/BetButton";
import type { Fixture } from "@/types/fixture";
import MobileTabBar from "@/components/mobile/MobileTabBar";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function LivescoreClient() {
  const [selected, setSelected] = useState<string>("All");

  const {
    data: recentData,
    error: recentError,
    isLoading: recentLoading,
  } = useSWR("/api/recent", fetcher);

  const recentFixtures: Fixture[] = recentData?.data ?? [];

  const categories = ["International", "T20", "ODI", "Test", "Leagues", "All"];

  const navTabs = [
    { label: "Live", href: "livescore", active: true },
    { label: "Upcoming", href: "upcoming", active: false },
    { label: "Recent", href: "recent", active: false },
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-lg font-extrabold text-white">Live Score</h1>
          <p className="mt-1 text-xs text-sky-100/70">
            Live matches and recent results.
          </p>
        </div>

        <MobileTabBar tabs={navTabs} />

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = selected === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelected(cat)}
                className={[
                  "rounded-full px-3 py-1 text-[11px] font-semibold transition",
                  "border backdrop-blur",
                  active
                    ? "border-amber-300/60 bg-amber-300/15 text-amber-200 shadow"
                    : "border-white/15 bg-white/5 text-sky-100/70 hover:border-amber-300/40 hover:text-sky-100",
                ].join(" ")}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* LIVE */}
      <div className="rounded-2xl border border-white/15 bg-black/40 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3">
          {/* text color yellow */}
          <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-300 ">
            Live Now
          </h2>
          <BetButton />
        </div>

        <div className="px-4 py-4">
          <LiveGrid filter={selected} />
        </div>
      </div>

      {/* RECENT */}
      <div className="rounded-2xl border border-white/15 bg-black/40 shadow-2xl backdrop-blur-2xl">
        <div className="border-b border-white/10 bg-black/30 px-4 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Recent Results
          </h2>
        </div>

        <div className="px-4 py-4 space-y-3">
          {recentError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
              Failed to load recent matches.
            </div>
          )}

          {recentLoading && !recentError && (
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-40 rounded bg-white/10" />
              <div className="space-y-2">
                <div className="h-20 rounded bg-white/10" />
                <div className="h-20 rounded bg-white/10" />
                <div className="h-20 rounded bg-white/10" />
              </div>
            </div>
          )}

          {!recentLoading && !recentError && recentFixtures.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-sky-100/60">
              No recent matches found.
            </div>
          )}

          {!recentLoading && !recentError && recentFixtures.length > 0 && (
            <div className="space-y-2">
              {recentFixtures.slice(0, 5).map((f) => (
                <LiveCard key={f.id} f={f} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
