import { Metadata } from "next";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import DesktopMinigamesClient from "@/components/DesktopMinigamesClient";
import { fetchGameCategories } from "@/lib/game-category-api";
import { fetchGames, toMinigameCards } from "@/lib/games-api";

// --- 1. SEO METADATA (Server-Side) ---
export const metadata: Metadata = {
  title: "Play Free Online Cricket Minigames | 8JJ Cricket India",
  description:
    "Play the best free online cricket games and sports minigames. Test your batting skills with instant games like Cricket Legends and Super Over. No download required.",
  keywords: [
    "free cricket games",
    "online cricket minigames",
    "play cricket online",
    "browser games india",
    "html5 cricket games",
    "cricket legends game",
  ],
  openGraph: {
    title: "Free Cricket Minigames Arcade - Play Instantly",
    description: "Bored? Play free cricket minigames now. No install needed.",
    url: "https://8jjcricket.com/minigames",
    siteName: "8JJ Cricket",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://8jjcricket.com/og-games.jpg", // Ensure you have a generic games banner
        width: 1200,
        height: 630,
        alt: "8JJ Cricket Minigames Collection",
      },
    ],
  },
  alternates: {
    canonical: "https://8jjcricket.com/minigames",
  },
};

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

  // --- 2. SCHEMA MARKUP (CollectionPage) ---
  // Tells Google this is a collection of software/games
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Cricket Minigames Arcade",
    description:
      "A curated collection of free-to-play online cricket games and sports minigames.",
    url: "https://8jjcricket.com/minigames",
    publisher: {
      "@type": "Organization",
      name: "8JJ Cricket",
      logo: {
        "@type": "ImageObject",
        url: "https://8jjcricket.com/logo.png",
      },
    },
    about: {
      "@type": "Thing",
      name: "Online Video Games",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Cricket Fans",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Inject Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TopNav />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* H1 is crucial for SEO relevance */}
        <h1 className="text-2xl font-bold mb-5">Free Cricket Minigames</h1>
        <DesktopMinigamesClient cards={cards} categories={gamesCategories} />
      </main>

      <Footer />
    </div>
  );
}
