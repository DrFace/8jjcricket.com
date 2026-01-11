"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import MobileBackButton from "@/components/mobile/MobileBackButton";

/* ===================== TYPES ===================== */

type LaravelCareerRow = {
  id?: number;
  type: string;
  matches?: number | null;
  innings?: number | null;
  runs_scored?: number | null;
  highest_inning_score?: number | null;
  strike_rate?: string | number | null;
  average?: string | number | null;
  hundreds?: number | null;
  fifties?: number | null;
};

type SportMonksCareerRow = {
  type: string;
  batting?: {
    matches?: number;
    innings?: number;
    runs_scored?: number;
    highest_inning_score?: number;
    strike_rate?: number;
    average?: number;
    hundred?: number;
    hundreds?: number;
    fifty?: number;
    fifties?: number;
  };
};

type Player = {
  id: number;
  name?: string;
  fullname?: string;
  firstname?: string | null;
  lastname?: string | null;
  image_path?: string | null;
  country?: { id?: number; name: string } | null;
  dateofbirth?: string | null;
  battingstyle?: string | null;
  bowlingstyle?: string | null;

  careers?: LaravelCareerRow[]; // Laravel
  career?: SportMonksCareerRow[]; // SportMonks (old)
};

/* ===================== HELPERS ===================== */

function getDisplayName(p: Player): string {
  return (
    p.fullname ??
    p.name ??
    [p.firstname, p.lastname].filter(Boolean).join(" ") ??
    `Player #${p.id}`
  );
}

function normalizeCareers(player: Player): LaravelCareerRow[] {
  if (Array.isArray(player.careers) && player.careers.length > 0) {
    return player.careers.map((c) => ({
      type: c.type,
      matches: c.matches ?? null,
      innings: c.innings ?? null,
      runs_scored: c.runs_scored ?? null,
      highest_inning_score: c.highest_inning_score ?? null,
      average: c.average ?? null,
      strike_rate: c.strike_rate ?? null,
      hundreds: c.hundreds ?? null,
      fifties: c.fifties ?? null,
    }));
  }

  if (Array.isArray(player.career) && player.career.length > 0) {
    return player.career.map((c) => ({
      type: c.type,
      matches: c.batting?.matches ?? null,
      innings: c.batting?.innings ?? null,
      runs_scored: c.batting?.runs_scored ?? null,
      highest_inning_score: c.batting?.highest_inning_score ?? null,
      average: c.batting?.average ?? null,
      strike_rate: c.batting?.strike_rate ?? null,
      hundreds: c.batting?.hundreds ?? c.batting?.hundred ?? null,
      fifties: c.batting?.fifties ?? c.batting?.fifty ?? null,
    }));
  }

  return [];
}

/* ===================== PAGE ===================== */

export default function PlayerDetailPageMobile() {
  const params = useParams();
  const idParam = (params as any)?.id as string | string[] | undefined;

  const [player, setPlayer] = useState<Player | null>(null);
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

    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Match your working code endpoint:
        const res = await fetch(`/api/catalog/${playerId}`, {
          signal: controller.signal,
          next: { revalidate: 300 }, // 5 minutes
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error("Player not found");
          throw new Error("Failed to load player");
        }

        const json = await res.json();

        // Match your working code response handling:
        // supports { player: {...} } OR direct object
        // (optional: keep json.data too, if you sometimes return that)
        const found: Player | null =
          (json?.player ?? json?.data ?? json) || null;

        if (!found) throw new Error("Player not found");

        setPlayer(found);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setError(e?.message ?? "Failed to load player");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [idParam]);

  const careers = useMemo(
    () => (player ? normalizeCareers(player) : []),
    [player]
  );

  /* ===================== UI STATES ===================== */

  if (loading) {
    return (
      <>
        <title>Loading Player | 8jjcricket</title>

        <div className="mx-auto max-w-3xl px-4 pb-5 pt-4">
          <MobileBackButton />

          <div className="mt-4 rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
            Loading player details...
            <div className="mt-4 mx-auto h-6 w-6 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <title>Player Error | 8jjcricket</title>

        <div className="mx-auto max-w-3xl px-4 pb-5 pt-4">
          <MobileBackButton />

          <div className="mt-4 rounded-2xl border border-red-500/30 bg-black/70 p-6 text-center text-sm text-red-300 backdrop-blur-xl">
            {error}
          </div>
        </div>
      </>
    );
  }

  if (!player) {
    return (
      <>
        <title>Player Not Found | 8jjcricket</title>

        <div className="mx-auto max-w-3xl px-4 pb-5 pt-4">
          <MobileBackButton />

          <div className="mt-4 rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
            Player not found.
          </div>
        </div>
      </>
    );
  }

  /* ===================== MAIN RENDER ===================== */

  const fullname = getDisplayName(player);

  return (
    <>
      <title>{fullname} | Player Profile | 8jjcricket</title>

      <div className="mx-auto max-w-3xl px-4 pb-5 pt-4">
        <MobileBackButton />

        <div className="mt-4 flex flex-col items-center gap-6 md:flex-row md:items-center">
          <div className="relative h-36 w-36 overflow-hidden rounded-2xl bg-slate-900 shadow-md">
            <Image
              src={player.image_path || "/placeholder.png"}
              alt={fullname}
              fill
              sizes="144px"
              className="object-contain"
              // Remove `unoptimized` unless you *need* it
            />
          </div>

          <div className="w-full">
            <h1 className="text-2xl font-bold text-white">{fullname}</h1>
            <p className="text-amber-300">
              {player.country?.name ?? "Unknown Country"}
            </p>

            <div className="mt-3 space-y-2 text-sm text-sky-100/70">
              {player.dateofbirth && (
                <div className="flex items-start justify-between gap-3">
                  <strong className="shrink-0">DOB:</strong>
                  <span className="text-right">{player.dateofbirth}</span>
                </div>
              )}

              {player.battingstyle && (
                <div className="flex items-start justify-between gap-3">
                  <strong className="shrink-0">Batting Style:</strong>
                  <span className="text-right">{player.battingstyle}</span>
                </div>
              )}

              {player.bowlingstyle && (
                <div className="flex items-start justify-between gap-3">
                  <strong className="shrink-0">Bowling Style:</strong>
                  <span className="text-right">{player.bowlingstyle}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {careers.length > 0 ? (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Career Statistics
            </h2>

            <div className="overflow-x-auto rounded-xl border border-white/15 bg-black/50 backdrop-blur-xl">
              <table className="min-w-full text-left text-sm text-sky-100/70">
                <thead className="bg-slate-900/80 text-amber-300">
                  <tr>
                    <th className="px-4 py-2">Format</th>
                    <th className="px-4 py-2">Matches</th>
                    <th className="px-4 py-2">Innings</th>
                    <th className="px-4 py-2">Runs</th>
                    <th className="px-4 py-2">HS</th>
                    <th className="px-4 py-2">Avg</th>
                    <th className="px-4 py-2">SR</th>
                    <th className="px-4 py-2">100s</th>
                    <th className="px-4 py-2">50s</th>
                  </tr>
                </thead>

                <tbody>
                  {careers.map((c, idx) => (
                    <tr
                      key={`${c.type}-${idx}`}
                      className="border-t border-white/10"
                    >
                      <td className="px-4 py-2 font-semibold text-amber-300">
                        {c.type}
                      </td>
                      <td className="px-4 py-2">{c.matches ?? "-"}</td>
                      <td className="px-4 py-2">{c.innings ?? "-"}</td>
                      <td className="px-4 py-2">{c.runs_scored ?? "-"}</td>
                      <td className="px-4 py-2">
                        {c.highest_inning_score ?? "-"}
                      </td>
                      <td className="px-4 py-2">{c.average ?? "-"}</td>
                      <td className="px-4 py-2">{c.strike_rate ?? "-"}</td>
                      <td className="px-4 py-2">{c.hundreds ?? "-"}</td>
                      <td className="px-4 py-2">{c.fifties ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/15 bg-black/50 p-6 text-sm text-sky-100/70 backdrop-blur-xl">
            Career statistics not available.
          </div>
        )}
      </div>
    </>
  );
}
