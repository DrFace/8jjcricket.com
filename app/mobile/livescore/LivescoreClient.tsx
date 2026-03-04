"use client";

import { useState } from "react";
import useSWR from "swr";

import type { Fixture } from "@/types/fixture";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import MobileLiveGrid from "@/components/mobile/MobileLiveGrid";
import MobileLiveCard from "@/components/mobile/MobileLiveCard";
import { CRICKET_CATEGORIES } from "@/lib/constant";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import MobileRecentCard from "@/components/mobile/MobileRecentCard";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function LivescoreClient() {
  const [selected, setSelected] = useState<string>("All");

  const {
    data: recentData,
    error: recentError,
    isLoading: recentLoading,
  } = useSWR("/api/recent", fetcher);

  const recentFixtures: Fixture[] = recentData?.data ?? [];
  console.log("recentFixtures", recentFixtures[0]);

  const navTabs = [
    { label: "Live", href: "livescore", active: true },
    { label: "Upcoming", href: "upcoming", active: false },
    { label: "Recent", href: "recent", active: false },
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-extrabold text-white">Live Score</h1>
          <p className="mt-1 text-xs text-sky-100/70">
            Live matches and recent results.
          </p>
        </div>

        <MobileTabBar tabs={navTabs} />
        <div className="w-full flex justify-center mt-2">
          <div className="flex flex-wrap gap-4">
            {CRICKET_CATEGORIES.map((cat) => {
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
      </div>

      <div className="">
        <div className="flex items-center justify-between py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-300 ">
            Live Now
          </h2>
        </div>

        <div className="py-4">
          <MobileLiveGrid filter={selected} />
        </div>
      </div>

      <div className="">
        <div className="pb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Recent Results
          </h2>
        </div>

        <div className="space-y-3">
          {recentError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
              Failed to load recent matches.
            </div>
          )}

          {recentLoading && !recentError && <LoadingSkeleton num={3} col={1} />}

          {!recentLoading && !recentError && recentFixtures.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-sky-100/60">
              No recent matches found.
            </div>
          )}

          {!recentLoading && !recentError && recentFixtures.length > 0 && (
            <div className="space-y-2">
              {recentFixtures.slice(0, 5).map((f) => (
                <MobileRecentCard key={f.id} f={f} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
