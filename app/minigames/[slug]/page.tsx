import DesktopBackButton from "@/components/DesktopBackButton";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { fetchGameBySlug } from "@/lib/games-api";
import dynamic from "next/dynamic";

export default async function GamePage({ params }: { params: { slug: string } }) {
  // 1) Try backend first (DB game)
  let dbGame:
    | {
        title: string;
        embed: string;
        description: string | null;
      }
    | null = null;

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
      <div className="min-h-screen flex flex-col">
        <TopNav />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <DesktopBackButton />
            <h1 className="text-2xl font-bold capitalize">{dbGame.title}</h1>
          </div>

          {dbGame.description ? (
            <p className="text-sm text-white/80">{dbGame.description}</p>
          ) : null}

          <div className="card overflow-hidden">
            <iframe
              src={dbGame.embed}
              className="w-full h-[70vh] lg:h-[80vh]"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 3) Fallback -> built-in games logic
  const Comp = (() => {
    switch (params.slug) {
      case "tictactoe":
        return dynamic(() => import("@/components/games/TicTacToe"));
      case "numberguess":
        return dynamic(() => import("@/components/games/NumberGuess"));
      case "cricket-superover":
        return dynamic(() => import("@/components/games/CricketSuperOver"), { ssr: false });
      case "flappysquare":
        return dynamic(() => import("@/components/games/FlappySquare"), { ssr: false });
      case "cricket-legends":
        return dynamic(() => import("@/components/games/CricketLegends"), { ssr: false });
      case "stickman-quest":
        return dynamic(() => import("@/components/games/StickmanQuest"), { ssr: false });
      default:
        return () => <div className="p-4">Game not found.</div>;
    }
  })();

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-4">
        <div className="flex items-center gap-3">
          <DesktopBackButton />
          <h1 className="text-2xl font-bold capitalize">
            {params.slug.replaceAll("-", " ")}
          </h1>
        </div>

        <div className="card">
          <Comp />
        </div>
      </main>

      <Footer />
    </div>
  );
}