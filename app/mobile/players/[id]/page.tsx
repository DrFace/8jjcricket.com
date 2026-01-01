"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import MobileBackButton from "@/components/mobile/MobileBackButton";

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

  // Laravel
  careers?: LaravelCareerRow[];

  // SportMonks
  career?: SportMonksCareerRow[];
};

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

export default function PlayerDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/players/${slug}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch player");

        const json = await res.json();
        setPlayer(json.data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load player");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  const careers = useMemo(
    () => (player ? normalizeCareers(player) : []),
    [player]
  );

  if (loading) {
    return (
      <>
        <title>Loading Player | 8jjcricket</title>
        <meta name="description" content="Loading player profile." />
        <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
          Loading player details...
          <div className="mt-4 h-6 w-6 animate-spin rounded-full border-4 border-amber-400 border-t-transparent mx-auto"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <title>Player Error | 8jjcricket</title>
        <meta name="description" content={error} />
        <div>
          <MobileBackButton />
          <div className="rounded-2xl border border-red-500/30 bg-black/70 p-6 text-sm text-red-300 backdrop-blur-xl mt-6 text-center">
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
        <meta name="description" content="Player not found." />
        <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
          Player not found.
        </div>
      </>
    );
  }

  const fullname = getDisplayName(player);

  return (
    <>
      <title>{fullname} | Player Profile | 8jjcricket</title>
      <meta
        name="description"
        content={`View ${fullname}'s player profile, stats and information on 8jjcricket.`}
      />

      <div className="mx-auto px-4 pb-5 max-w-3xl">
        <MobileBackButton />

        <div className="flex flex-col md:flex-row gap-8 items-center w-full">
          <div className="relative h-40 w-40 overflow-hidden rounded-full bg-slate-900 shadow-md bg-amber-300/10 border border-amber-400/30 flex-shrink-0">
            <Image
              src={player.image_path || "/placeholder.png"}
              alt={fullname}
              fill
              className="object-contain"
            />
          </div>

          <div className="w-full">
            <h1 className="text-3xl font-bold text-white">{fullname}</h1>
            <p className="text-amber-300">
              {player.country?.name ?? "Unknown Country"}
            </p>

            <div className="mt-3 space-y-1 text-sm text-sky-100/70">
              {player.dateofbirth && (
                <div className="flex items-center justify-between">
                  <p>
                    <strong>DOB:</strong>
                  </p>
                  <p>{player.dateofbirth}</p>
                </div>
              )}
              {player.battingstyle && (
                <div className="flex items-center justify-between">
                  <p>
                    <strong>Batting Style:</strong>
                  </p>
                  <p>{player.battingstyle}</p>
                </div>
              )}
              {player.bowlingstyle && (
                <div className="flex items-center justify-between">
                  <p>
                    <strong>Bowling Style:</strong>
                  </p>
                  <p>{player.bowlingstyle}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {careers.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Career Statistics
            </h2>

            <div className="overflow-x-auto rounded-xl border border-white/15 bg-black/50 backdrop-blur-xl">
              <table className="min-w-full text-sm text-left text-sky-100/70">
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
          <div className="mt-10 rounded-2xl border border-white/15 bg-black/50 p-6 text-sm text-sky-100/70 backdrop-blur-xl">
            Career statistics not available.
          </div>
        )}
      </div>
    </>
  );
}
