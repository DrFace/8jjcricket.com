// app/page.tsx
import Link from "next/link";
import dynamic from "next/dynamic";
import MatchCentre from "@/components/MatchCentre";
import OddsCard from "@/components/BetButton";
import SocialBox from "@/components/SocialBox";
import BannerCarousel from "@/components/BannerCarousel";
import NewsCarousel from "@/components/NewsCarousel";

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
    return all.slice(0, 5);
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

// fixed bar download target
const DOWNLOAD_URL = "https://download.9ipl.vip/normal/";

const BRAND_ITEMS = [
  "MB66",
  "OK9",
  "78win",
  "QQ88",
  "F168",
  "FLY88",
  "CM88",
  "OK8386",
  "SC88",
  "C168",
  "iP88",
];

export default async function HomePage() {
  const news = await getNewsPreview();

  const newsWithImages = news
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      imgSrc: normalizeImageUrl(a.image_url),
      published_at: a.published_at,
    }))
    .filter((a) => a.imgSrc) as {
      id: number;
      slug: string;
      title: string;
      imgSrc: string;
      published_at: string | null;
    }[];

  return (
    <>
      <main className="min-h-[60vh] space-y-5 pb-16 sm:space-y-6 lg:space-y-8">
        {/* Animated heading strip */}
        <section className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-center shadow-xl backdrop-blur-xl">
          <div className="flex justify-center">
            <AnimatedText />
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-100/80">
            Live cricket · Fast odds · Instant minigames
          </p>
        </section>

        {/* Hero row: banner + quick CTA / promo */}
        <section className="grid gap-4 md:grid-cols-[2fr,1.15fr]">
          {/* Left: Banner carousel */}
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-2xl backdrop-blur-xl">
            <BannerCarousel />
          </div>

          {/* Right: Minigames quick panel styled like promo box */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-amber-400/60 bg-gradient-to-br from-black/70 via-slate-900/80 to-amber-900/40 p-4 shadow-2xl backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-200">
                  Hot Minigames
                </h2>
                <Link
                  href="/minigames"
                  className="text-[11px] font-semibold text-amber-300 hover:text-amber-200"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {latest.slice(0, 2).map((g) => (
                  <Link
                    key={g.slug}
                    href={`/minigames/${g.slug}`}
                    className="group rounded-xl border border-white/15 bg-white/5 p-3 text-xs text-white shadow transition hover:border-amber-300/70 hover:bg-white/10"
                  >
                    <p className="line-clamp-1 text-[11px] font-semibold text-amber-200">
                      {g.title}
                    </p>
                    <p className="mt-1 text-[11px] text-sky-100/80">
                      {g.desc}
                    </p>
                  </Link>
                ))}
              </div>

              <Link
                href="/minigames"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black shadow-lg shadow-amber-500/40 hover:brightness-110 active:scale-95"
              >
                Play Minigames Now
              </Link>
            </div>

            {/* Optional right-side extra (you can later plug in OddsCard / SocialBox) */}
            <div className="hidden rounded-2xl border border-white/15 bg-black/50 p-4 text-sm text-sky-100/90 shadow-xl backdrop-blur-xl md:block">
              <p className="font-semibold text-white">Live Match Centre</p>
              <p className="mt-1 text-xs text-sky-100/80">
                Track scores, odds and more in real time.
              </p>
              {/* <MatchCentre /> */}
            </div>
          </div>
        </section>

        {/* Full minigames quick play row */}
        <section className="rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-sky-100 sm:text-sm">
              Minigames • Quick Play
            </h2>
            <Link
              href="/minigames"
              className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 sm:text-xs"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {latest.map((g) => (
              <Link
                key={g.slug}
                href={`/minigames/${g.slug}`}
                className="group flex flex-col items-center justify-center rounded-xl border border-white/15 bg-white/5 p-4 text-white shadow-lg transition hover:border-amber-300/70 hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-black/50 text-[10px] font-semibold uppercase tracking-wide shadow-sm transition group-hover:scale-105 group-hover:border-amber-300 group-hover:text-amber-300">
                  {g.title
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <p className="mt-2 text-center text-[12px] font-semibold">
                  {g.title}
                </p>
                <p className="mt-1 text-center text-[11px] text-sky-100/80">
                  {g.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured news carousel */}
        {newsWithImages.length > 0 && (
          <section className="rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sky-100 sm:text-sm">
              Featured Promotions
            </h2>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <NewsCarousel
                items={newsWithImages.map((a) => ({
                  id: a.id,
                  slug: a.slug,
                  title: a.title,
                  imgSrc: a.imgSrc,
                }))}
                intervalMs={4000}
              />
            </div>
          </section>
        )}

        {/* Latest promotions & news list */}
        {news.length > 0 && (
          <section className="rounded-2xl border border-white/15 bg-slate-900/80 p-5 text-white shadow-2xl backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-100 sm:text-base">
                Latest Promotions &amp; News
              </h2>
              <Link
                href="/news"
                className="text-xs font-semibold text-amber-300 hover:text-amber-200 sm:text-sm"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              {news
                .slice(0, 5)
                .map((a) => ({
                  ...a,
                  imgSrc: normalizeImageUrl(a.image_url),
                }))
                .map((a) => (
                  <Link
                    key={a.id}
                    href={`/news/${a.slug}`}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 text-white transition hover:border-amber-300/70 hover:bg-black/60"
                  >
                    {a.imgSrc && (
                      <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32">
                        <img
                          src={a.imgSrc}
                          alt={a.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-1 items-center justify-between gap-4">
                      <p className="line-clamp-2 text-sm font-semibold sm:text-base">
                        {a.title}
                      </p>

                      {a.published_at && (
                        <span className="whitespace-nowrap text-xs text-sky-100/80 sm:text-sm">
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

        {/* You can re-enable these inside similar glass cards if you want */}
        {/* <MatchCentre /> */}
        {/* <OddsCard /> */}
        {/* <SocialBox /> */}
      </main>

      {/* FIXED BOTTOM BRAND BAR – like OKVIP */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] pb-2">
        <div className="mx-auto max-w-5xl overflow-x-auto">
          <div className="mx-auto inline-flex min-w-full items-center justify-center rounded-full border border-white/20 bg-black/70 px-3 py-2 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-nowrap items-center gap-2 sm:gap-3">
              {BRAND_ITEMS.map((name) => (
                <a
                  key={name}
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex whitespace-nowrap items-center justify-center rounded-full bg-slate-200/90 px-4 py-1.5 text-xs font-semibold text-slate-900 shadow-md transition hover:bg-white hover:shadow-lg sm:text-sm"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
