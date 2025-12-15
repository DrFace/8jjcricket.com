// components/HomeNewsShowcase.tsx
import Link from "next/link";
import NewsListCards from "@/components/NewsListCards";

type Article = {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    image_url: string | null;
    published_at: string | null;

    // Common category shapes (support both)
    category?: {
        id?: number;
        slug?: string | null;
        name?: string | null;
    } | null;

    // If your API uses a simple string category, this will also work
    category_name?: string | null;
};

const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

// Set your Lucky Draw identifiers here
const LUCKY_DRAW_SLUG = "lucky-draw";
const LUCKY_DRAW_NAME = "Lucky Draw";

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

function formatDate(date?: string | null) {
    if (!date) return "";
    return date.slice(0, 10); // YYYY-MM-DD
}

function isLuckyDraw(article: Article): boolean {
    const slug = article.category?.slug?.toLowerCase()?.trim();
    const name = article.category?.name?.toLowerCase()?.trim();
    const categoryName = article.category_name?.toLowerCase()?.trim();

    return (
        slug === LUCKY_DRAW_SLUG ||
        name === LUCKY_DRAW_NAME.toLowerCase() ||
        categoryName === LUCKY_DRAW_NAME.toLowerCase()
    );
}

async function fetchNews(): Promise<Article[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;
    const res = await fetch(`${base.replace(/\/+$/, "")}/news`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
}

export default async function HomeNewsShowcase() {
    const news = await fetchNews();

    // 1) Filter only Lucky Draw
    // 2) Normalize images
    // 3) Keep only items that actually have an image
    const items = news
        .filter(isLuckyDraw)
        .map((n) => ({
            ...n,
            image_url: normalizeImageUrl(n.image_url),
        }))
        .filter((n) => Boolean(n.image_url));

    if (items.length === 0) return null;

    const featured = items[0];

    const listItems = items.slice(1, 5).map((n) => ({
        id: n.id,
        slug: n.slug,
        title: n.title,
        imgSrc: n.image_url!, // safe due to filter above
        date: formatDate(n.published_at),
    }));

    return (
        <div className="mx-auto w-full max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
                {/* LEFT — Featured card */}
                <div className="relative overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-2xl">
                    {/* image */}
                    <div className="relative aspect-[4/3] w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${featured.image_url})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    {/* content */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <span>{formatDate(featured.published_at)}</span>
                        </div>

                        <h3 className="mt-3 line-clamp-2 text-2xl font-extrabold text-white">
                            {featured.title}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm text-white/60">
                            {featured.excerpt || featured.title}
                        </p>
                    </div>

                    {/* bottom button */}
                    <div className="px-6 pb-6">
                        <Link
                            href={`/news/${featured.slug}`}
                            className="block w-full rounded-xl bg-amber-400/15 py-3 text-center text-sm font-semibold text-amber-200 ring-1 ring-amber-300/20 hover:bg-amber-400/20"
                        >
                            View more
                        </Link>
                    </div>
                </div>

                {/* RIGHT — List */}
                <div className="flex flex-col">
                    <NewsListCards items={listItems} />

                    <Link
                        href="/news"
                        className="mt-4 flex items-center justify-center rounded-2xl bg-white/5 py-4 text-sm font-semibold text-white/70 ring-1 ring-white/10 hover:bg-white/10"
                    >
                        View more →
                    </Link>
                </div>
            </div>
        </div>
    );
}
