"use client";

import { useState } from "react";
import useSWR from "swr";

import type { Fixture } from "@/types/fixture";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import MobileLiveGrid from "@/components/mobile/MobileLiveGrid";
import { CRICKET_CATEGORIES } from "@/lib/constant";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import MobileRecentCard from "@/components/mobile/MobileRecentCard";
import MobileCricketCategory from "@/components/mobile/MobileCricketCatgory";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function LivescoreClient() {
  const [selected, setSelected] = useState<string>("All");

  const {
    data: recentData,
    error: recentError,
    isLoading: recentLoading,
  } = useSWR("/api/recent", fetcher);

  const recentFixtures: Fixture[] = recentData?.data ?? [];

  const navTabs = [
    { label: "Live", href: "livescore", active: true },
    { label: "Upcoming", href: "upcoming", active: false },
    { label: "Recent", href: "recent", active: false },
  ];

  return (
    <div className="min-h-screen">
      <main className="w-[99%]  mx-auto py-1">
        <div className="flex flex-col space-y-4">
          <div className="flex  items-center ">
            <h1 className="m-h">Live Score</h1>
          </div>
          <span className="text-xs text-sky-100/70">
            Live matches and recent results.
          </span>
          <MobileTabBar tabs={navTabs} />
          <MobileCricketCategory
            selected={selected}
            setSelected={setSelected}
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between py-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-300 ">
              Live Now
            </h2>
          </div>

          <div>
            <MobileLiveGrid filter={selected} />
          </div>
        </div>

        <div className="mt-8">
          <div className="pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-300">
              Recent Results
            </h2>
          </div>

          <div className="space-y-3">
            {recentError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200 text-center">
                Failed to load recent matches.
              </div>
            )}

            {recentLoading && !recentError && (
              <LoadingSkeleton num={1} col={1} />
            )}

            {!recentLoading && !recentError && recentFixtures.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-sky-100/60">
                No recent matches found.
              </div>
            )}

            {!recentLoading && !recentError && recentFixtures.length > 0 && (
              <div className="space-y-3">
                {recentFixtures.slice(0, 5).map((f) => (
                  <MobileRecentCard key={f.id} f={f} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
