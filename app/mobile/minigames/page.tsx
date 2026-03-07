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
    <div className="min-h-screen">
      <main className="w-[99%]  mx-auto py-1">
        <div className="flex  items-center mb-4">
          <h1 className="m-h">Minigames</h1>
        </div>
        <MobileMinigamesClient cards={cards} categories={gamesCategories} />
      </main>
    </div>
  );
}
