import MobileMinigamesClient from "@/components/mobile/MobileMinigamesClient";
import { fetchGameCategories } from "@/lib/game-category-api";
import { fetchGames, toMinigameCards } from "@/lib/games-api";

export default async function MinigamesPage() {
  let cards: any = [];
  let gamesCategories: any = [];

  try {
    const categoryData = await fetchGameCategories();
    const apiGames = await fetchGames();

    cards = toMinigameCards(apiGames);
    gamesCategories = categoryData.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      id: cat.id,
    }));
  } catch {
    cards = [];
  }

  return (
    <div className="min-h-screen flex flex-col ">
      {/* Header (unchanged) */}

      <main className="flex-1 w-full max-w-2xl px-2">
        <h1 className="text-2xl font-bold mb-5">Minigames</h1>
        <MobileMinigamesClient cards={cards} categories={gamesCategories} />
      </main>
    </div>
  );
}
