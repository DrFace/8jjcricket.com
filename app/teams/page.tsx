import { Suspense } from "react";
import TeamsClient from "./TeamsClient";

export const metadata = {
  title: "Cricket Teams - All International & Domestic Teams | 8jjcricket",
  description:
    "Explore cricket teams from around the world. Filter by series and leagues including ODI, T20I, Test, IPL, and more. View international and domestic cricket teams.",
};

function TeamsFallback() {
  return (
    <div className="space-y-6">
      <div className="h-24 bg-slate-900/80 border border-white/20 rounded-3xl animate-pulse backdrop-blur-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-slate-900/80 border border-white/20 rounded-2xl animate-pulse backdrop-blur-xl"
          />
        ))}
      </div>
    </div>
  );
}

export default function TeamsPage() {
  return (
    <Suspense fallback={<TeamsFallback />}>
      <TeamsClient />
    </Suspense>
  );
}
