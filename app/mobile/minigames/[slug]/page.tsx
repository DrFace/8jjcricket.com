import MobileBackButton from "@/components/mobile/MobileBackButton";
import { fetchGameBySlug } from "@/lib/games-api";
import dynamic from "next/dynamic";

export default async function GamePage({
  params,
}: {
  params: { slug: string };
}) {
  // 1) Try backend first (DB game)
  let dbGame: {
    title: string;
    embed: string;
    description: string | null;
  } | null = null;

  try {
    const g = await fetchGameBySlug(params.slug);
    if (g?.embed) {
      dbGame = { title: g.title, embed: g.embed, description: g.description };
    }
  } catch {
    dbGame = null;
  }

  // 2) If DB game exists -> iframe preview
  if (dbGame) {
    return (
      <div className="min-h-screen">
        <main className="w-[99%]  mx-auto py-1 space-y-4">
          <div className="flex items-center">
            <MobileBackButton />
            <div className="flex  items-center ">
              <h1 className="m-h">{dbGame.title}</h1>
            </div>
          </div>

          {dbGame.description ? (
            <p className="text-sm text-white/80">{dbGame.description}</p>
          ) : null}

          <div className="overflow-hidden rounded-3xl flex items-center justify-center h-full">
            <iframe
              src={dbGame.embed}
              className="w-full"
              style={{ height: "68vh" }}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </main>
      </div>
    );
  }

  // 3) Fallback -> your existing built-in games logic (same slugs)
  // NOTE: We keep dynamic imports exactly like your current code.
  const Comp = (() => {
    switch (params.slug) {
      case "tictactoe":
        return dynamic(() => import("@/components/mobile/games/TicTacToe"));
      case "numberguess":
        return dynamic(() => import("@/components/mobile/games/NumberGuess"));
      case "cricket-superover":
        return dynamic(
          () => import("@/components/mobile/games/CricketSuperOver"),
          {
            ssr: false,
          },
        );
      case "flappysquare":
        return dynamic(() => import("@/components/mobile/games/FlappySquare"), {
          ssr: false,
        });
      case "cricket-legends":
        return dynamic(
          () => import("@/components/mobile/games/CricketLegends"),
          {
            ssr: false,
          },
        );
      case "stickman-quest":
        return dynamic(
          () => import("@/components/mobile/games/StickmanQuest"),
          {
            ssr: false,
          },
        );
      default:
        return () => (
          <div className="flex items-center justify-center">
            Game not found.
          </div>
        );
    }
  })();

  return (
    <div className="min-h-screen">
      <main className="w-[99%]  mx-auto py-1 space-y-4">
        <div className="flex items-center">
          <MobileBackButton />
          <div className="flex  items-center ">
            <h1 className="m-h">{params.slug.replaceAll("-", " ")}</h1>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl flex items-center justify-center h-full">
          <Comp />
        </div>
      </main>
    </div>
  );
}
