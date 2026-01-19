"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PlayerRespond } from "@/types/player";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import { GetDisplayName } from "@/lib/player";
import { MobilePlayerCareerTables } from "@/components/mobile/MobilePlayerCareerTables";

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

        const res = await fetch(`/api/players/${playerId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error("Player not found");
          throw new Error("Failed to load player");
        }

        const json = await res.json();
        console.log("player json", json.data);
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
            <div className="space-y-6 w-full">
              <div className="flex flex-col items-center gap-8 md:flex-row mt-3">
                <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-slate-900 shadow-md">
                  <Image
                    src={player?.image_path || "/placeholder.png"}
                    alt={player ? GetDisplayName(player) : ""}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="w-full">
                  <h1 className="text-3xl font-bold text-white text-center">
                    {player ? GetDisplayName(player) : ""}
                  </h1>
                  <p className="text-amber-300 text-center">
                    {player.country?.name ?? "Unknown Country"}
                  </p>

                  <div className="mt-3 space-y-1 text-sm text-sky-100/70 w-full">
                    {player.dateofbirth && (
                      <div className="flex justify-between w-full">
                        <div>DOB:</div>
                        <div> {player.dateofbirth}</div>
                      </div>
                    )}
                    {player.battingstyle && (
                      <div className="flex justify-between w-full">
                        <div>Batting Style:</div>
                        <div>{player.battingstyle}</div>
                      </div>
                    )}
                    {player.bowlingstyle && (
                      <div className="flex justify-between w-full">
                        <div>Bowling Style:</div>
                        <div>{player.bowlingstyle}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {careers.length > 0 ? (
                <div className="mt-10 w-full">
                  <h2 className="mb-4 text-2xl font-semibold text-white">
                    Career Statistics
                  </h2>

                  {careers && careers.length > 0 ? (
                    <MobilePlayerCareerTables careers={careers} />
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
      </div>
    </>
  );
}
