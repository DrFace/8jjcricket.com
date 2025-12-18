
"use client";

import { useState } from "react";
import useSWR from "swr";
import ArchhiveCard from "@/components/ArchhiveCard";
import LiveCard from "@/components/LiveCard";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function DesktopScoreClient() {
  const [activeTab, setActiveTab] = useState("Live");
  const { data, error } = useSWR("/api/live", fetcher);

  const liveData = data?.data?.live ?? [];
  const upcomingData = data?.data?.upcoming ?? [];
  const recentData = data?.data?.recent ?? [];

  const tabs = ["Live", "Upcoming", "Recent"];

  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-black/80 pt-4 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-amber-400 text-black shadow"
                  : "bg-black/40 text-white hover:bg-amber-300/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {error && <div className="text-red-400">Failed to load data.</div>}
        {!data && !error && <div className="text-amber-300">Loading…</div>}

        {activeTab === "Live" && (
          <div>
            <h1 className="text-3xl font-extrabold text-amber-400 mb-6">Live Scores</h1>
            {liveData.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveData.map((match: any) => (
                  <ArchhiveCard key={match.id} f={match} />
                ))}
              </div>
            ) : (
              <div className="text-gray-400">No live matches available.</div>
            )}
          </div>
        )}

        {activeTab === "Upcoming" && (
          <div>
            <h1 className="text-3xl font-extrabold text-amber-400 mb-6">Upcoming Matches</h1>
            {upcomingData.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingData.map((fixture: any) => (
                  <ArchhiveCard key={fixture.id} f={fixture} />
                ))}
              </div>
            ) : (
              <div className="text-gray-400">No upcoming matches found.</div>
            )}
          </div>
        )}

        {activeTab === "Recent" && (
          <div>
            <h1 className="text-3xl font-extrabold text-amber-400 mb-6">Recent Results</h1>
            {recentData.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {recentData.slice(0, 6).map((f: any) => (
                 <ArchhiveCard key={f.id} f={f} />
              ))}
              </div>
            ) : (
              <div className="text-gray-400">No recent matches found.</div>
            )}
          </div>
        )}
      </div>
    </div>
   );
}