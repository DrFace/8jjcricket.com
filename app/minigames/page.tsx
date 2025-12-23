import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import MobileMinigameCard from "@/components/mobile/MobileMinigameCard";
import { fetchGames, toMinigameCards } from "@/lib/games-api";

export const metadata: Metadata = {
  title: "Minigames",
  description: "Play casual minigames while you follow live cricket.",
};

export default async function MinigamesPage() {
  // If backend is down, do not crash the whole page
  let cards: Array<{ slug: string; title: string; desc: string; icon: string }> =
    [];

  try {
    const games = await fetchGames();
    cards = toMinigameCards(games);
  } catch {
    cards = [];
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />

      <main className="flex-1 space-y-4 m-1">
        <h1 className="text-2xl font-bold">Minigames</h1>

        {cards.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            No games found. Please add games in the backend admin panel.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((g) => (
              <MobileMinigameCard key={g.slug} {...g} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
