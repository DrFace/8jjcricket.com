// app/page.tsx
import MinigameCard from "@/components/MinigameCard";
import Link from "next/link";
import dynamic from "next/dynamic";
import MatchCentre from "@/components/MatchCentre";
import OddsCard from "@/components/BetButton";
import SocialBox from "@/components/SocialBox";
import BannerCarousel from "@/components/BannerCarousel";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
};

const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";

// Same origin constant as in your /news page
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

// Reuse the SAME normalizeImageUrl logic as in /news
function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    const u = new URL(url, SITE_ORIGIN);
    let pathname = u.pathname;

    if (!pathname.startsWith("/storage/")) {
      const clean = pathname.replace(/^\/+/, "");
      pathname = `/storage/${clean}`;
    }

    return `${SITE_ORIGIN}${pathname}${u.search}`;
  } catch {
    const clean = String(url).replace(/^\/+/, "");
    return `${SITE_ORIGIN}/storage/${clean}`;
  }
}

async function getNewsPreview(): Promise<Article[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;
  const url = `${base.replace(/\/+$/, "")}/news`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error("Failed to fetch news:", res.status);
      return [];
    }
    const json = await res.json();
    const all = (json.data || []) as Article[];
    return all.slice(0, 4);
  } catch (e) {
    console.error("Error fetching news:", e);
    return [];
  }
}

// Latest minigames list
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

// Dynamically import AnimatedText (as in original code)
const AnimatedText = dynamic(() => import("@/components/AnimatedText"), {
  ssr: false,
});

export default async function HomePage() {
  const news = await getNewsPreview();

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Centered content similar to FotMob */}
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-3 py-4 sm:px-4 sm:py-6 lg:py-8">
        {/* TOP: BANNER + SOCIAL STRIP */}
        <section className="space-y-3">
          {/* Banner as compact hero, like FotMob's top promo bar */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <BannerCarousel />
          </div>

          {/* Animated ticker / text strip */}
          <div className="flex items-center justify-between gap-3 rounded-full bg-white px-4 py-2 text-xs shadow-sm">
            <div className="font-semibold text-gray-800">
              Live cricket • Scores • Odds • Minigames
            </div>
            <div className="hidden sm:block text-blue-600">
              <AnimatedText />
            </div>
          </div>

          {/* Social row */}
          {/* <div className="flex justify-end">
            <SocialBox />
          </div> */}
        </section>

        {/* MAIN GRID 3-COLUMN ON DESKTOP (FotMob-style) */}
        <section className="grid gap-4 lg:grid-cols-[1.1fr,2.2fr,1.4fr] xl:gap-6">
          {/* LEFT COLUMN: QUICK NAV / ODDS / MINIGAME PROMO */}
          <div className="space-y-4">
            {/* Quick Links */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-xs font-semibold tracking-wide text-gray-500">
                QUICK NAVIGATION
              </h2>
              <div className="space-y-1.5 text-sm">
                <Link
                  href="/recent"
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50"
                >
                  <span>Live & recent matches</span>
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
                  href="/rankings"
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50"
                >
                  <span>Team rankings</span>
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

            {/* Odds widget card (kept subtle, like FotMob’s betting box) */}
            {/* <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
              <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500">
                ODDS & OFFERS
              </h2>
              <OddsCard />
            </div> */}

            {/* Small minigame teaser */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">
                Quick Minigame
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Waiting for the next over? Jump into a fast game.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {latest.slice(0, 2).map((g) => (
                  <Link
                    key={g.slug}
                    href={`/minigames/${g.slug}`}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs hover:bg-gray-50"
                  >
                    <div className="font-semibold text-gray-900">
                      {g.title}
                    </div>
                    <div className="mt-0.5 text-[11px] text-gray-500">
                      {g.desc}
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/minigames"
                className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all minigames →
              </Link>
            </div>
          </div>

          {/* CENTER COLUMN: MAIN MATCH CENTRE (FotMob-style strongest column) */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div className="space-y-0.5">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Match Centre
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Live scores, upcoming fixtures and results.
                  </p>
                </div>
                {/* You can later replace this area with tabs (Live / Upcoming / Finished) for a more FotMob feel */}
                <div className="flex items-center gap-2 rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                  <span className="rounded-full bg-white px-2 py-0.5 shadow-sm">
                    Live
                  </span>
                  <span>Upcoming</span>
                  <span>Results</span>
                </div>
              </div>

              <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-4">
                <MatchCentre />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LATEST NEWS (like FotMob’s side content) */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  Latest News
                </h2>
                <Link
                  href="/news"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-2 p-3">
                {news.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    No news found right now.
                  </p>
                ) : (
                  news.map((a) => {
                    const imgSrc = normalizeImageUrl(a.image_url);

                    return (
                      <Link
                        key={a.id}
                        href={`/news/${a.slug}`}
                        className="flex gap-3 rounded-xl p-2 hover:bg-gray-50 transition"
                      >
                        {imgSrc && (
                          <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgSrc}
                              alt={a.title || "News image"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 line-clamp-2">
                            {a.title}
                          </p>
                          {a.excerpt && (
                            <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-2">
                              {a.excerpt}
                            </p>
                          )}
                          {a.published_at && (
                            <p className="mt-1 text-[10px] font-medium text-blue-600">
                              {new Date(a.published_at).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </aside>
        </section>

        {/* BOTTOM: FULL-WIDTH MINIGAMES GRID (kept simple) */}
        <section className="space-y-3">
          <header className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Latest Minigames
              </h2>
              <p className="text-xs text-gray-500">
                Take a break between overs and challenge your skills.
              </p>
            </div>
            <Link
              href="/minigames"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>
          </header>

          <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((g) => (
                <MinigameCard key={g.slug} {...g} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
