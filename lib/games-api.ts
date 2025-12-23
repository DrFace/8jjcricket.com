// lib/games-api.ts
export type ApiGame = {
  id: number;
  title: string;
  slug: string;

  // Your backend resource maps:
  // embed_url -> embed
  // image_url -> image
  embed: string;
  image: string | null;

  description: string | null;
  tags: string[];

  category?: { id: number; name: string; slug: string } | null;
  game_category_id?: number | null;
};

export type MinigameCardModel = {
  slug: string;
  title: string;
  desc: string;
  icon: string;
};

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim();
  if (!base) return "";

  // Accept both:
  //  - http://host:port/api
  //  - http://host:port
  if (base.endsWith("/api")) return base;
  if (base.endsWith("/api/")) return base.replace(/\/+$/, "");
  return base.replace(/\/+$/, "") + "/api";
}

const API_BASE = normalizeApiBase(process.env.NEXT_PUBLIC_API_BASE_URL);

export async function fetchGames(): Promise<ApiGame[]> {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  // Laravel resource collection shape is typically { data: [...] }
  const res = await fetch(`${API_BASE}/games?paginate=0`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch games: ${res.status}`);

  const json = await res.json();
  return json.data ?? [];
}

export async function fetchGameBySlug(slug: string): Promise<ApiGame | null> {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const res = await fetch(`${API_BASE}/games/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch game: ${res.status}`);

  const json = await res.json();
  return json.data ?? json;
}

export function toMinigameCards(games: ApiGame[]): MinigameCardModel[] {
  return games.map((g) => ({
    slug: g.slug,
    title: g.title,
    desc: (g.description || "Tap to play.").trim(),
    icon: g.image || "/games/default-game.png",
  }));
}
