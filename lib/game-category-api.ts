// lib/games-api.ts
export type ApiGameCategory = {
  id: number;
  name: string;
  slug: string;
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

export async function fetchGameCategories(): Promise<ApiGameCategory[]> {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  // Laravel resource collection shape is typically { data: [...] }
  const res = await fetch(`${API_BASE}/game-categories`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch games: ${res.status}`);

  const json = await res.json();

  return json.data ?? [];
}

export async function fetchGameByCategory(
  category: string
): Promise<ApiGameCategory | null> {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const res = await fetch(`${API_BASE}/game-categories/${category}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch game: ${res.status}`);

  const json = await res.json();
  return json.data ?? json;
}
