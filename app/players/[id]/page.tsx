"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { PlayerRespond } from "@/types/player";
import { PlayerCareerTables } from "@/components/PlayerCareerTables";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import { GetDisplayName } from "@/lib/player";

export default function PlayerDetailPage() {
  const params = useParams();
  const idParam = params?.id;

  const [player, setPlayer] = useState<PlayerRespond | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const playerIdStr = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!playerIdStr) return;

    const playerId = Number(playerIdStr);
    if (!Number.isFinite(playerId)) {
      setError("Invalid player id");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/catalog/${playerId}`, {
          // Use caching (recommended). Change the value as you like.
          next: { revalidate: 300 }, // 5 minutes
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error("Player not found");
          throw new Error("Failed to load player");
        }

        const json = await res.json();

        // Your screenshot shows: { player: {...} }
        const found: PlayerRespond | null = (json?.data ?? json.data) || null;

        if (!found) throw new Error("Player not found");

        if (!cancelled) setPlayer(found);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load player");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [idParam]);

  const careers = useMemo(() => player?.career ?? [], [player]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1">
          {loading ? (
            <div className="space-y-6 2xl:w-[75%] xl:w-[80%] lg:w-[95%] mx-auto h-min-80">
              <LoadingState label="player is loading" />
            </div>
          ) : error || !player ? (
            <div className="space-y-6 2xl:w-[75%] xl:w-[80%] lg:w-[95%] mx-auto h-min-80">
              <ErrorState message={error ?? "Player not found"} />
            </div>
          ) : (
            <div className="space-y-6 2xl:w-[75%] xl:w-[80%] lg:w-[95%] mx-auto h-min-80">
              <div className="flex flex-col items-center gap-8 md:flex-row mt-3 rounded-3xl border border-india-gold/30 bg-gradient-to-br from-india-charcoal via-slate-900 to-india-blue/20 p-8 shadow-2xl backdrop-blur-xl">
                <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-white/5 border border-india-gold/20 shadow-lg">
                  <Image
                    src={player?.image_path || "/placeholder.png"}
                    alt={player ? GetDisplayName(player) : ""}
                    fill
                    className="object-contain"
                  />
                </div>

                <div>
                  <h1 className="text-4xl font-bold text-white india-header-text mb-2">
                    {player ? GetDisplayName(player) : ""}
                  </h1>
                  <p className="text-xl font-bold text-india-gold">
                    {player.country?.name ?? "Unknown Country"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    {player.dateofbirth && (
                      <div className="bg-slate-900/60 rounded-lg px-4 py-2 border border-white/10">
                        <span className="text-india-gold font-semibold">DOB: </span>
                        <span className="text-white">{player.dateofbirth}</span>
                      </div>
                    )}
                    {player.battingstyle && (
                      <div className="bg-slate-900/60 rounded-lg px-4 py-2 border border-white/10">
                        <span className="text-india-gold font-semibold">Batting: </span>
                        <span className="text-white">{player.battingstyle}</span>
                      </div>
                    )}
                    {player.bowlingstyle && (
                      <div className="bg-slate-900/60 rounded-lg px-4 py-2 border border-white/10">
                        <span className="text-india-gold font-semibold">Bowling: </span>
                        <span className="text-white">{player.bowlingstyle}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {careers.length > 0 ? (
                <div className="mt-8">
                  <h2 className="mb-4 text-2xl font-bold text-india-gold india-header-text">
                    Career Statistics
                  </h2>

                  {careers && careers.length > 0 ? (
                    <PlayerCareerTables careers={careers} />
                  ) : null}
                </div>
              ) : (
                <div className="mt-10 rounded-2xl border border-white/15 bg-black/50 p-6 text-sm text-sky-100/70 backdrop-blur-xl text-center">
                  Career statistics not available.
                </div>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
