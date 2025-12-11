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

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

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
    if (!res.ok) return [];
    const json = await res.json();
    const all = (json.data || []) as Article[];
    return all.slice(0, 5); // GET LATEST 5
  } catch {
    return [];
  }
}

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

const AnimatedText = dynamic(() => import("@/components/AnimatedText"), {
  ssr: false,
});

export default async function HomePage() {
  const news = await getNewsPreview();

  return (
    <main className="min-h-screen bg-gray-100">
      {/* TEXT STRIP */}
      <section className="py-4">
        <div className="flex justify-center">
          <AnimatedText />
        </div>
      </section>

      {/* HERO */}
      <section className="w-full">
        <div className="w-full">
          <BannerCarousel />
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-3 py-4 sm:px-4 sm:py-6 lg:py-8">
        {/* MINIGAMES QUICK PLAY */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
              Minigames • Quick Play
            </h2>
            <Link
              href="/minigames"
              className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((g) => (
              <Link
                key={g.slug}
                href={`/minigames/${g.slug}`}
                className="group flex flex-col items-center justify-center rounded-xl bg-gray-50 p-6 transition hover:bg-gray-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-[10px] font-semibold text-gray-800 shadow-sm transition group-hover:scale-105">
                  {g.title
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()}
                </div>

                <p className="mt-2 text-center text-[13px] font-semibold text-gray-800">
                  {g.title}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED NEWS STRIP */}
        <div
          className="flex gap-3 overflow-x-auto scroll-smooth
             [-ms-overflow-style:none] [scrollbar-width:none]
             [&::-webkit-scrollbar]:hidden p-2 snap-x snap-mandatory"
        >
          {news
            .map((a) => ({
              ...a,
              imgSrc: normalizeImageUrl(a.image_url),
            }))
            .filter((a) => a.imgSrc)
            .map((a) => (
              <Link
                key={a.id}
                href={`/news/${a.slug}`}
                className="relative h-40 min-w-full flex-shrink-0 sm:h-48 snap-center"
              >
                <img
                  src={a.imgSrc as string}
                  alt={a.title}
                  className="h-full w-full rounded-2xl object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-white/95 to-transparent p-3">
                  <p className="line-clamp-1 text-xs font-semibold text-gray-900">
                    {a.title}
                  </p>
                </div>
              </Link>
            ))}
        </div>


        {/* LATEST PROMOTIONS & NEWS */}
        {news.length > 0 && (
          <section className="mt-2 rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                Latest Promotions &amp; News
              </h2>
              <Link
                href="/news"
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {news
                .slice(0, 5) // ENSURE EXACTLY 5 SHOW HERE
                .map((a) => ({
                  ...a,
                  imgSrc: normalizeImageUrl(a.image_url),
                }))
                .map((a) => (
                  <Link
                    key={a.id}
                    href={`/news/${a.slug}`}
                    className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100"
                  >
                    {a.imgSrc && (
                      <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={a.imgSrc}
                          alt={a.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-1 items-center justify-between gap-3">
                      <p className="line-clamp-2 text-xs font-semibold text-gray-900 sm:text-sm">
                        {a.title}
                      </p>

                      {a.published_at && (
                        <span className="whitespace-nowrap text-[10px] text-gray-500 sm:text-xs">
                          {new Date(a.published_at).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* REST OF YOUR PAGE BELOW — MATCH CENTRE, RIGHT SIDEBAR, ETC */}
        {/* <MatchCentre /> */}
        {/* <OddsCard /> */}
        {/* <SocialBox /> */}
      </div>
    </main>
  );
}
