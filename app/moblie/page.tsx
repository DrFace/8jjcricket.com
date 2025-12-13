// app/moblie/page.tsx
import Link from "next/link";
import dynamic from "next/dynamic";
import BannerCarousel from "@/components/BannerCarousel";
import NewsCarousel from "@/components/NewsCarousel";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import MatchCentre from "@/components/MatchCentre";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const WelcomePopup = dynamic(() => import("@/components/WelcomePopup"), { ssr: false });

type Article = {
  id: number;
  title: string;
  slug: string;
  image_url: string | null;
};

const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

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

const latest = [
  { slug: "cricket-legends", title: "Cricket Legends" },
  { slug: "cricket-superover", title: "Cricket Super Over" },
];

export default async function MobileHomePage() {
  const news = await getNewsPreview();

  const newsWithImages = news
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      imgSrc: normalizeImageUrl(a.image_url),
    }))
    .filter((a) => a.imgSrc) as { id: number; slug: string; title: string; imgSrc: string }[];

  return (
    <div className="min-h-screen w-screen max-w-none overflow-x-hidden bg-black text-white">
      {/* Welcome Popup (client-only) */}
      <WelcomePopup />

      {/* If TopNav/BottomNav are fixed in their own components, this still works.
          If they are NOT fixed, this layout keeps them above the scroll container. */}
      <div className="w-full max-w-none">
        <TopNav />
      </div>

      {/* Scroll container (only main content scrolls) */}
      <main
        className="
          h-[calc(100vh-56px)]
          w-full max-w-none
          overflow-y-auto overflow-x-hidden
          px-3 pb-8 pt-3
          snap-y snap-mandatory
          [scrollbar-width:none] [-ms-overflow-style:none]
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* HERO / BANNER */}
        <section className="w-full max-w-none snap-start scroll-mt-3">
          <Reveal>
            <div className="w-full max-w-none overflow-hidden rounded-xl">
              <BannerCarousel />
            </div>
          </Reveal>
        </section>

        {/* QUICK GAMES */}
        <section className="mt-5 w-full max-w-none snap-start scroll-mt-3">
          <Reveal>
            <div className="mb-2 flex w-full items-center justify-between">
              <h2 className="text-sm font-semibold">Hot Minigames</h2>
              <Link href="/minigames" className="text-xs font-semibold text-sky-400">
                View all →
              </Link>
            </div>

            <div className="grid w-full grid-cols-2 gap-3">
              {latest.map((g) => (
                <Link
                  key={g.slug}
                  href={`/minigames/${g.slug}`}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-center text-xs font-semibold"
                >
                  {g.title}
                </Link>
              ))}
            </div>

            <Link
              href="/minigames"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-black"
            >
              Play Minigames
            </Link>
          </Reveal>
        </section>

        {/* MATCH CENTRE */}
        <section className="mt-5 w-full max-w-none snap-start scroll-mt-3">
          <Reveal>
            <div className="w-full max-w-none overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2">
              <MatchCentre />
            </div>
          </Reveal>
        </section>

        {/* NEWS */}
        {newsWithImages.length > 0 && (
          <section className="mt-5 w-full max-w-none snap-start scroll-mt-3">
            <Reveal>
              <h2 className="mb-2 text-sm font-semibold">Latest News</h2>
              <div className="w-full max-w-none overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <NewsCarousel items={newsWithImages} intervalMs={4000} />
              </div>
            </Reveal>
          </section>
        )}

        {/* FOOTER */}
        <section className="mt-8 w-full max-w-none snap-start scroll-mt-3">
          <Reveal>
            <Footer />
          </Reveal>
        </section>
      </main>

      {/* BottomNav pinned under scroll area */}
      <div className="w-full max-w-none">
        <BottomNav />
      </div>
    </div>
  );
}
