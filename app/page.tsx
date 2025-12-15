// app/page.tsx
import Link from "next/link";
import dynamic from "next/dynamic";
import BannerCarousel from "@/components/BannerCarousel";
import NewsCarousel from "@/components/NewsCarousel";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import MatchCentre from "@/components/MatchCentre";
import SmoothScroller from "@/components/SmoothScroller";
import DesktopOnly from "@/components/DesktopOnly";
import BottomNav from "@/components/BottomNav";
import HomeVerticalSwiper from "@/components/HomeVerticalSwiper";
import HomeGalleryShowcase from "@/components/HomeGalleryShowcase";
import HomeNewsShowcase from "@/components/HomeNewsShowcase";


const WelcomePopup = dynamic(() => import("@/components/WelcomePopup"), { ssr: false });
const AnimatedText = dynamic(() => import("@/components/AnimatedText"), { ssr: false });

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
};

const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url, SITE_ORIGIN);
    let pathname = u.pathname;
    if (!pathname.startsWith("/storage/")) pathname = `/storage/${pathname.replace(/^\/+/, "")}`;
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
    return ((json.data || []) as Article[]).slice(0, 5);
  } catch {
    return [];
  }
}

const latest: { slug: string; title: string; desc: string }[] = [
  { slug: "cricket-legends", title: "Cricket Legends", desc: "Career mode with levels & characters." },
  { slug: "cricket-superover", title: "Cricket Super Over", desc: "6 balls, pure timing — hit for 6s!" },
  { slug: "tictactoe", title: "Tic Tac Toe", desc: "Classic 3×3 duel." },
  { slug: "flappysquare", title: "Flappy Square", desc: "Click to fly!" },
];

function gameInitials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

const DOWNLOAD_URL = "https://download.9ipl.vip/normal/";
const BRAND_ITEMS = ["MB66", "OK9", "78win", "QQ88", "F168", "FLY88", "CM88", "OK8386", "SC88", "C168", "iP88"];

export default async function HomePage() {
  const news = await getNewsPreview();

  const newsWithImages = news
    .map((a: Article) => ({ id: a.id, slug: a.slug, title: a.title, imgSrc: normalizeImageUrl(a.image_url) }))
    .filter((a: { id: number; slug: string; title: string; imgSrc: string | null }) => a.imgSrc) as {
      id: number;
      slug: string;
      title: string;
      imgSrc: string;
    }[];

  return (
    <SmoothScroller>
      <DesktopOnly>
        <WelcomePopup />
      </DesktopOnly>

      <BottomNav />
      <TopNav />

      {/* Swiper vertical scroll effect wrapper (no content changes inside) */}
      <HomeVerticalSwiper>
        {/* SLIDE 1 — VIDEO (NO BG IMAGE) */}
        <section data-snap className="SectionScroll sticky top-0 Sh-screen w-full overflow-hidden">
          <video
            src="/homevideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full bg-black object-contain sm:object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="pointer-events-auto absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
            <div className="inline-flex min-w-0 max-w-full items-center justify-center gap-2 overflow-x-auto rounded-full border border-white/20 bg-black/70 px-3 py-2 shadow-2xl backdrop-blur-xl">
              {BRAND_ITEMS.map((name: string) => (
                <a
                  key={name}
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap rounded-full bg-slate-200/90 px-4 py-1.5 text-xs font-semibold text-slate-900 shadow-md transition hover:bg-white sm:text-sm"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </section>

        
        {/* SLIDE — GALLERY SHOWCASE */}
        <section data-snap className="SectionScroll sticky top-0 flex h-screen w-full items-center px-6">
          <div className="relative h-full w-full flex items-center">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/CricketBG.jpg)" }} />
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative w-full rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
              <HomeGalleryShowcase />
            </div>
          </div>
        </section>

        {/* SLIDE — NEWS */}
        <section data-snap className="SectionScroll sticky top-0 flex h-screen w-full items-center px-6">
          <div className="relative h-full w-full flex items-center">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/CricketBG.jpg)" }} />
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative w-full rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
              <HomeNewsShowcase />
            </div>
          </div>
        </section>


        {/* SLIDE 2 */}
        <section data-snap className="SectionScroll sticky top-0 flex h-screen w-full items-center px-6">
          <div className="relative h-full w-full flex items-center">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/CricketBG.jpg)" }} />
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative w-full">
              <div className="mb-8 rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-center shadow-xl backdrop-blur-xl">
                <div className="flex justify-center">
                  <AnimatedText />
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-100/80">
                  Live cricket · Fast odds · Instant minigames
                </p>
              </div>

              <div className="grid w-full gap-6 md:grid-cols-[2fr,1.1fr]">
                <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-2xl backdrop-blur-xl">
                  <BannerCarousel />
                </div>

                <div className="rounded-2xl border border-amber-400/60 bg-gradient-to-br from-black/70 via-slate-900/80 to-amber-900/40 p-4 shadow-2xl backdrop-blur-xl">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-200">Hot Minigames</h2>
                    <Link href="/minigames" className="text-[11px] font-semibold text-amber-300 hover:text-amber-200">
                      View all →
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {latest.slice(0, 2).map((g: { slug: string; title: string; desc: string }) => (
                      <Link
                        key={g.slug}
                        href={`/minigames/${g.slug}`}
                        className="group flex flex-col items-center justify-center rounded-xl border border-white/15 bg-white/5 p-3 text-white shadow transition hover:border-amber-300/70 hover:bg-white/10"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-b from-slate-950/80 to-slate-900/80 shadow-inner">
                          <span className="text-lg font-extrabold tracking-wide text-white/90">{gameInitials(g.title)}</span>
                        </div>
                        <p className="mt-2 text-center text-[11px] font-semibold text-amber-200">{g.title}</p>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/minigames"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black shadow-lg hover:brightness-110 active:scale-95"
                  >
                    Play Minigames Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 3 */}
        <section data-snap className="SectionScroll sticky top-0 flex h-screen w-full items-center px-6">
          <div className="relative h-full w-full flex items-center">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/CricketBG.jpg)" }} />
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative h-full w-full rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
              <MatchCentre />
            </div>
          </div>
        </section>

        {/* SLIDE 4 */}
        {newsWithImages.length > 0 && (
          <section data-snap className="SectionScroll sticky top-0 flex h-screen w-full items-center px-6">
            <div className="relative h-full w-full flex items-center">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/CricketBG.jpg)" }} />
              <div className="absolute inset-0 bg-black/70" />

              <div className="relative w-full rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sky-100 sm:text-sm">
                  Latest News
                </h2>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <NewsCarousel items={newsWithImages} intervalMs={4000} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer as last slide */}
        <div className="relative">
          <Footer />
        </div>
      </HomeVerticalSwiper>
    </SmoothScroller>
  );
}
