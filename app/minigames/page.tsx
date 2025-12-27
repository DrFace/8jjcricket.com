import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import DesktopMinigamesClient from "@/components/DesktopMinigamesClient";
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
    gamesCategories = [];
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <h1 className="text-2xl font-bold mb-5">Minigames</h1>
        <DesktopMinigamesClient cards={cards} categories={gamesCategories} />
      </main>

      <Footer />
    </div>
  );
}