import Link from "next/link";
import dynamic from "next/dynamic";
import BannerCarousel from "@/components/BannerCarousel";
import Reveal from "@/components/Reveal";
import NewsListCards from "@/components/NewsListCards";
import SocialBox from "@/components/SocialBox";

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
  created_at?: string;
  updateed_at?: string;
};

const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";
const DEFAULT_API_BASE_VIDEO = "http://72.60.107.98:8001/storage";

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE).replace(
    /\/+$/,
    ""
  );
}

function apiBaseVideo() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL_VIDEO || DEFAULT_API_BASE_VIDEO
  ).replace(/\/+$/, "");
}

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

/**
 * Place files like:
 *  public/homevideo.mp4
 *  public/brands/brands-bg.jpg
 *  public/brands/f168.png
 *  ...
 */
const DOWNLOAD_URL = "https://download.9ipl.vip/normal/";

const BRAND_ITEMS: { name: string; icon: string }[] = [
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

  const videos: Video[] = videosRaw.map((v) => ({
    ...v,
    created_at: v.created_at
      ? new Date(v.created_at).toISOString().slice(0, 10)
      : "",
  }));

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
    const url = `${apiBase()}/home-videos`;
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

  return (
    <>
      {/* Welcome Popup (client-only) */}
      <WelcomePopup />

      {/* HOME VIDEO (Top Hero) */}
      <section className="w-full snap-start scroll-mt-3">
        <Reveal>
          <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="h-[180px] w-full sm:h-[220px]">
              <video
                className="h-full w-full object-cover"
                src={`${apiBaseVideo()}/${videos[0].video_path}`}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-black/10" />
          </div>
        </Reveal>
      </section>

      {/* SOCIALS (under video) */}
      <section className="mt-4 w-full snap-start scroll-mt-3">
        <Reveal>
          <SocialBox />
        </Reveal>
      </section>

      {/* HERO / BANNER */}
      <section className="mt-3 w-full snap-start scroll-mt-3">
        <Reveal>
          <div className="w-full overflow-hidden rounded-xl">
            <BannerCarousel />
          </div>
        </Reveal>
      </section>

      {/* SPONSORS (GRID, no scroll) */}
      <section className="mt-4 w-full snap-start scroll-mt-3">
        <Reveal>
          <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
            {/* Optional background image behind tiles */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "url(/brands/brands-bg.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative px-4 py-3">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <h3 className="text-sm font-semibold text-white">Sponsors</h3>
              </div>

              <div className="grid grid-cols-5 gap-x-3 gap-y-4">
                {BRAND_ITEMS.map((b) => (
                  <a
                    key={b.name}
                    href={DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center transition active:scale-95"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
                      <img
                        src={b.icon}
                        alt={b.name}
                        className="h-9 w-9 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <span className="mt-1 text-[11px] font-medium text-white/90">
                      {b.name}
                    </span>
                  </a>
                ))}

                {Array.from({ length: brandPlaceholders }).map((_, i) => (
                  <div
                    key={`brand-ph-${i}`}
                    className="flex flex-col items-center"
                  >
                    <div className="h-14 w-14 rounded-2xl border border-dashed border-white/25 bg-white/5" />
                    <span className="mt-1 text-[11px] text-transparent">.</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* QUICK GAMES */}
      <section className="mt-5 w-full snap-start scroll-mt-3">
        <Reveal>
          <div className="mb-2 flex w-full items-center justify-between px-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <h2 className="text-sm font-semibold">Hot Minigames</h2>
            </div>

            <Link
              href="/mobile/minigames"
              className="text-xs font-semibold text-sky-400"
            >
              View all →
            </Link>
          </div>

          {(() => {
            const COLS = 5;
            const remainder = GAME_ITEMS.length % COLS;
            const placeholders = remainder === 0 ? 0 : COLS - remainder;

            return (
              <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="grid grid-cols-5 gap-x-3 gap-y-4">
                  {GAME_ITEMS.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/minigames/${encodeURIComponent(g.slug)}`}
                      prefetch={false}
                      className="flex flex-col items-center transition active:scale-95 cursor-pointer"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
                        <img
                          src={g.icon}
                          alt={g.title}
                          className="h-9 w-9 object-contain"
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
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-black"
                >
                  Play Minigames
                </Link>
              </div>
            );
          })()}
        </Reveal>
      </section>

      {/* NEWS */}
      {newsWithImages.length > 0 && (
        <section className="mt-5 w-full snap-start scroll-mt-3">
          <Reveal>
            <h2 className="mb-2 text-sm font-semibold">Latest News</h2>
            <NewsListCards items={newsWithImages} />
          </Reveal>
        </section>
      )}
    </>
  );
}
