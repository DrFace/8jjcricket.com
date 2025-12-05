// app/page.tsx
import LiveGrid from "@/components/LiveGrid";
import MinigameCard from "@/components/MinigameCard";
import Link from "next/link";

/* ---- NEWS TYPES + FETCHER (same backend as /news page) ---- */

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
};

const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";

async function getNewsPreview(): Promise<Article[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;
  const url = `${base.replace(/\/+$/, "")}/news`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      // you can add next: { revalidate: 60 } if you want ISR
    });

    if (!res.ok) {
      console.error("Failed to fetch news:", res.status);
      return [];
    }

    const json = await res.json();
    const all = (json.data || []) as Article[];
    return all.slice(0, 4); // just 4 latest for homepage
  } catch (e) {
    console.error("Error fetching news:", e);
    return [];
  }
}

/* ---- MINIGAMES DATA ---- */

const latest = [
  {
    slug: "cricket-legends",
    title: "Cricket Legends",
    desc: "Career mode with levels & characters.",
  },
  {
    slug: "cricket-superover",
    title: "Cricket Super Over",
    desc: "6 balls, pure timing — hit for 6s!",
  },
  { slug: "tictactoe", title: "Tic Tac Toe", desc: "Classic 3×3 duel." },
  { slug: "flappysquare", title: "Flappy Square", desc: "Click to fly!" },
];

const popular = [
  { slug: "numberguess", title: "Number Guess", desc: "Hot or cold 1–100." },
  { slug: "tictactoe", title: "Tic Tac Toe", desc: "Classic 3×3 duel." },
  {
    slug: "cricket-superover",
    title: "Cricket Super Over",
    desc: "6 balls, pure timing — hit for 6s!",
  },
];

/* ---- PAGE ---- */

export default async function HomePage() {
  const news = await getNewsPreview();

  return (
    <div className="space-y-10">
      {/* Match centre + news sidebar (2-col like Cricinfo) */}
      <section className="grid gap-6 lg:grid-cols-[2.2fr,1.3fr]">
        {/* Main match centre */}
        <div className="space-y-4">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Match Centre</h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Live scores, upcoming fixtures and recent results from major
                tours and leagues.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              {["All", "International", "T20", "ODI", "Test", "Leagues"].map(
                (f) => (
                  <button
                    key={f}
                    type="button"
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600"
                  >
                    {f}
                  </button>
                )
              )}
            </div>
          </header>

          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            {/* Tabs row */}
            <div className="flex items-center gap-4 border-b bg-gray-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold">
              <button className="border-b-2 border-blue-500 pb-1 text-blue-600">
                Live
              </button>
              <Link
                href="/upcoming"
                className="pb-1 text-gray-600 hover:text-blue-600"
              >
                Upcoming
              </Link>
              <Link
                href="/recent"
                className="pb-1 text-gray-600 hover:text-blue-600"
              >
                Recent
              </Link>
            </div>

            {/* Live matches list */}
            <div className="px-3 sm:px-4 py-3 sm:py-4">
              <LiveGrid />
            </div>
          </div>
        </div>

        {/* Right column = NEWS (this is what you asked for) */}
        <aside className="space-y-4">
          {/* Latest news */}
          <div className="rounded-xl border bg-slate-950 text-slate-100 shadow-sm">
            <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                Latest News
              </h2>
              <Link
                href="/news"
                className="text-[11px] font-medium text-sky-400 hover:text-sky-300"
              >
                View all
              </Link>
            </div>

            <div className="px-4 py-3 space-y-3 text-sm">
              {news.length === 0 ? (
                <p className="text-slate-400 text-xs">
                  No news found right now.
                </p>
              ) : (
                news.map((a) => (
                  <div
                    key={a.id}
                    className="border-b border-slate-800 pb-2 last:border-none last:pb-0"
                  >
                    <Link
                      href={`/news/${a.slug}`}
                      className="font-semibold text-slate-50 hover:text-sky-400"
                    >
                      {a.title}
                    </Link>
                    {a.published_at && (
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {new Date(a.published_at).toLocaleString()}
                      </p>
                    )}
                    {a.excerpt && (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-300">
                        {a.excerpt}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick links under news */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold tracking-wide text-gray-500">
              QUICK LINKS
            </h2>
            <div className="space-y-2 text-sm">
              <Link
                href="/players"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50"
              >
                <span>Player rankings</span>
                <span className="text-gray-400">›</span>
              </Link>
              <Link
                href="/upcoming"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50"
              >
                <span>Upcoming series</span>
                <span className="text-gray-400">›</span>
              </Link>
              <Link
                href="/recent"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50"
              >
                <span>Recent results</span>
                <span className="text-gray-400">›</span>
              </Link>
              <Link
                href="/news"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50"
              >
                <span>Cricket news</span>
                <span className="text-gray-400">›</span>
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* Minigames section */}
      <section className="space-y-4">
        <header className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Latest Minigames
            </h2>
            <p className="text-sm text-gray-500">
              Take a break between overs and challenge your skills.
            </p>
          </div>
          <Link
            href="/minigames"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all minigames →
          </Link>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((g) => (
            <MinigameCard key={g.slug} {...g} />
          ))}
        </div>
      </section>

      {/* Popular minigames */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Most Popular Minigames
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((g) => (
            <MinigameCard key={g.slug} {...g} />
          ))}
        </div>
      </section>
    </div>
  );
}
