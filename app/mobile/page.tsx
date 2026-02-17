import Link from "next/link";
import dynamic from "next/dynamic";
import Reveal from "@/components/Reveal";
import MobileNewsListCards from "@/components/MobileNewsListCards";
import { fetchGames, toMinigameCards } from "@/lib/games-api";
import { ApiBase } from "@/lib/utils";
import { DEFAULT_API_BASE } from "@/lib/constant";
import MobileSocialBox from "@/components/MobileSocialBox";

// --- IMPORT SEO DATA ---
import { homeMetadata } from "@/components/seo/HomeSeo";
import MobileSponsorBar from "@/components/MobileSponsorBar";
import MobilePortraitShowcaseSection from "@/components/mobile/MobilePortraitShowcaseSection";
// --- EXPORT METADATA (This sets the <head> tags) ---
export const metadata = homeMetadata;

const WelcomePopup = dynamic(() => import("@/components/WelcomePopup"), {
  ssr: false,
});

type Article = {
  id: number;
  title: string;
  slug: string;
  image_url: string | null;
  created_at?: string;
};

type Video = {
  id: number;
  title: string;
  slug: string;
  video_path: string;
};

const GAME_ITEMS = [
  {
    slug: "cricket-legends",
    title: "Cricket Legends",
    icon: "/games/cricket-legends.png",
  },
  {
    slug: "cricket-superover",
    title: "Cricket Super Over",
    icon: "/games/cricket-superover.png",
  },
] as const;

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

const BRAND_ITEMS: { name: string; icon: string }[] = [
  { name: "F168", icon: "/brands/f168.png" },
  { name: "FLY88", icon: "/brands/fly88.png" },
  { name: "CM88", icon: "/brands/cm88.png" },
  { name: "OK8386", icon: "/brands/ok8386.png" },
  { name: "SC88", icon: "/brands/sc88.png" },
  { name: "F168", icon: "/brands/f168.png" },
  { name: "FLY88", icon: "/brands/fly88.png" },
  { name: "CM88", icon: "/brands/cm88.png" },
  { name: "OK8386", icon: "/brands/ok8386.png" },
  { name: "SC88", icon: "/brands/sc88.png" },
];

function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    const u = new URL(url, SITE_ORIGIN);
    let pathname = u.pathname;
    if (!pathname.startsWith("/storage/")) {
      pathname = `/storage/${pathname.replace(/^\/+/, "")}`;
    }
    return `${SITE_ORIGIN}${pathname}${u.search}`;
  } catch {
    return `${SITE_ORIGIN}/storage/${String(url).replace(/^\/+/, "")}`;
  }
}

function normalizeVideoUrl(url: string | null): string | null {
  if (!url) return null;
  // Remove '/api' from backend_url if present
  let backend_url = ApiBase().replace(/\/api$/, "");
  try {
    const u = new URL(url, backend_url);
    let pathname = u.pathname;
    if (!pathname.startsWith("/storage/")) {
      pathname = `/storage/${pathname.replace(/^\/+/, "")}`;
    }
    return `${backend_url}${pathname}${u.search}`;
  } catch {
    return `${backend_url}/storage/${String(url).replace(/^\/+/, "")}`;
  }
}

async function getNewsPreview(): Promise<Article[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;
  const url = `${base.replace(/\/+$/, "")}/news`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).slice(0, 5);
  } catch {
    return [];
  }
}

export default async function MobileHomePage() {
  const news = await getNewsPreview();
  const [videosRaw] = await Promise.all([fetchVideos()]);

  const videos: Video[] = (videosRaw || [])
    .map((p: any) => {
      return {
        ...p,
        video_path: normalizeVideoUrl(p.video_path) || p.video_path,
      } as Video;
    })
    .filter((p) => !!p.video_path);

  const newsWithImages = news
    .map((a: any) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      imgSrc: normalizeImageUrl(a.image_url),
      date: a.created_at
        ? new Date(a.created_at).toISOString().slice(0, 10)
        : "",
    }))
    .filter((a) => a.imgSrc) as {
    id: number;
    slug: string;
    title: string;
    imgSrc: string;
  }[];

  async function fetchVideos(): Promise<Video[]> {
    const url = `${ApiBase()}/home-videos`;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json) ? json : json.data || [];
    } catch {
      return [];
    }
  }

  // Sponsors: 5 columns; add placeholders to complete the last row
  const BRAND_COLS = 5;
  const brandRemainder = BRAND_ITEMS.length % BRAND_COLS;
  const brandPlaceholders =
    brandRemainder === 0 ? 0 : BRAND_COLS - brandRemainder;

  // ✅ ONLY CHANGE: Fetch hot minigames from API (first 10)
  let hotGames: { slug: string; title: string; icon: string }[] = [];
  try {
    const apiGames = await fetchGames();
    const cards = toMinigameCards(apiGames);

    hotGames = cards.slice(0, 10).map((g) => ({
      slug: g.slug,
      title: g.title,
      icon: g.icon,
    }));
  } catch {
    hotGames = [];
  }

  return (
    <>
      {/* Welcome Popup (client-only) */}
      <WelcomePopup />

      <section className="w-full snap-start scroll-mt-3">
        <Reveal>
          <div className="relative w-full overflow-hidden rounded-2xl border border-india-gold/20 bg-slate-900/60 backdrop-blur-md shadow-lg">
            <div className="h-[180px] w-full sm:h-[220px]">
              {(() => {
                const raw = videos?.[0]?.video_path ?? "";

                const getSafeVideoUrl = (input: string) => {
                  if (!input) return "";

                  // Relative storage path → HTTPS domain
                  if (input.startsWith("/")) {
                    return `https://8jjcricket.com${input}`;
                  }

                  // IP-based HTTP URL → HTTPS domain
                  if (input.startsWith("http://72.60.107.98:8001/")) {
                    return input.replace(
                      "http://72.60.107.98:8001",
                      "https://8jjcricket.com",
                    );
                  }

                  // Any other http://storage/... → force HTTPS on main domain
                  if (input.startsWith("http://")) {
                    try {
                      const u = new URL(input);
                      if (u.pathname.startsWith("/storage/")) {
                        return `https://8jjcricket.com${u.pathname}${u.search}`;
                      }
                    } catch {}
                  }

                  // Already https or unknown format
                  return input;
                };

                const safeSrc = getSafeVideoUrl(raw);

                return (
                  <video
                    className="h-full w-full object-cover"
                    src={safeSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                );
              })()}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-black/10" />
          </div>
        </Reveal>
      </section>
      {/* SPONSORS (GRID, no scroll) */}
      <section className="mt-4 w-full snap-start scroll-mt-3">
        <Reveal>
          <div className="relative w-full overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "url(/brands/brands-bg.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-black/50" />

            <MobileSponsorBar />
          </div>
        </Reveal>
      </section>

      {/* HERO / BANNER */}
      <section className="mt-3 w-full snap-start scroll-mt-3">
        {/* <Reveal> */}
        <div className="mb-2 flex w-full items-center justify-between px-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-india-gold" />
            <h2 className="text-sm font-bold text-white">Player Portraits</h2>
          </div>

        
        </div>

        <div className="relative w-full rounded-2xl border border-india-gold/20 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
          <MobilePortraitShowcaseSection />
        </div>
        {/* </Reveal> */}
      </section>

      {/* QUICK GAMES */}
      <section className="mt-5 w-full snap-start scroll-mt-3">
        {/* <Reveal> */}
        <div className="mb-2 flex w-full items-center justify-between px-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-india-gold" />
            <h2 className="text-sm font-bold text-white">Hot Minigames</h2>
          </div>

          <Link
            href="/mobile/minigames"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-india-gold hover:text-india-saffron transition-colors"
          >
            View all →
          </Link>
        </div>

        {(() => {
          const COLS = 5;
          const visibleGames = hotGames.slice(0, COLS);
          const remainder = visibleGames.length % COLS;
          const placeholders = remainder === 0 ? 0 : COLS - remainder;

          return (
            <div className="w-full overflow-hidden rounded-2xl border border-india-gold/20 bg-slate-900/60 backdrop-blur-md p-4 shadow-lg">
              {visibleGames.length === 0 ? (
                <div className="text-sm text-white/70">
                  No minigames available right now.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-5 gap-x-3 gap-y-4">
                    {visibleGames.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/mobile/minigames/${encodeURIComponent(g.slug)}`}
                        prefetch={false}
                        className="flex flex-col items-center cursor-pointer active:scale-95"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-transparent overflow-hidden">
                          <img
                            src={g.icon}
                            alt={g.title}
                            className="h-full w-full object-contain rounded-2xl"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                    ))}

                    {Array.from({ length: placeholders }).map((_, i) => (
                      <div
                        key={`game-ph-${i}`}
                        className="flex flex-col items-center"
                      >
                        <div className="h-14 w-14 rounded-2xl border border-dashed border-white/25 bg-white/5" />
                        <span className="mt-1 text-[11px] text-transparent">
                          .
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/mobile/minigames"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-india-saffron to-india-gold px-4 py-2 text-xs font-bold text-black shadow-md hover:shadow-lg transition-all"
                  >
                    Play Minigames
                  </Link>
                </>
              )}
            </div>
          );
        })()}
      </section>

      {/* SOCIALS (under video) */}
      <section className="mt-4 w-full snap-start scroll-mt-3">
        {/* <Reveal> */}
        <div className="mb-2 flex w-full items-center justify-between px-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-india-gold" />
            <h2 className="text-sm font-bold text-white">Follow Us</h2>
          </div>
        </div>
        <MobileSocialBox />
        {/* </Reveal> */}
      </section>
      {/* NEWS */}
      {newsWithImages.length > 0 && (
        <section className="mt-5 w-full snap-start scroll-mt-3">
          {/* <Reveal> */}
          <h2 className="mb-2 text-sm font-bold text-white flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-india-gold" />Latest News</h2>
          <MobileNewsListCards items={newsWithImages} />
          {/* </Reveal> */}
        </section>
      )}
    </>
  );
}
