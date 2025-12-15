// components/HomeGalleryShowcase.tsx
import Link from "next/link";

type GalleryPhoto = {
    id: number;
    name: string;
    slug: string;
    orientation: "portrait" | "landscape";
    image_url: string;
    album?: { id: number; name: string; slug: string } | null;
};

type GalleryAlbum = {
    id: number;
    name: string;
    slug: string;
    category?: { id: number; name: string; slug: string } | null;
};

const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";
const BRAND_CATEGORY_SLUG = "brand";

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

function apiBase() {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE).replace(/\/+$/, "");
}

async function fetchPhotos(): Promise<any[]> {
    const url = `${apiBase()}/gallery/photos`;
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data || [];
    } catch {
        return [];
    }
}

async function fetchBrandAlbumSlugs(): Promise<Set<string>> {
    const url = `${apiBase()}/gallery/albums?category=${encodeURIComponent(BRAND_CATEGORY_SLUG)}`;
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return new Set();
        const json = (await res.json()) as { data?: GalleryAlbum[] };
        const slugs = (json.data || []).map((a) => a.slug).filter(Boolean);
        return new Set(slugs);
    } catch {
        return new Set();
    }
}

function byNewest(a: any, b: any) {
    const da = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
}

/** Slideshow WITHOUT titles/names */
function Slideshow({ items }: { items: { src: string }[] }) {
    return (
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <div
                className="flex h-full w-full"
                style={{
                    width: `${items.length * 100}%`,
                    animation: items.length > 1 ? `homeGallerySlide ${items.length * 4}s infinite` : undefined,
                }}
            >
                {items.map((it, idx) => (
                    <div key={idx} className="relative h-full" style={{ width: `${100 / items.length}%` }}>
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${it.src})` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    </div>
                ))}
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
          @keyframes homeGallerySlide {
            0% { transform: translateX(0%); }
            18% { transform: translateX(0%); }
            20% { transform: translateX(-20%); }
            38% { transform: translateX(-20%); }
            40% { transform: translateX(-40%); }
            58% { transform: translateX(-40%); }
            60% { transform: translateX(-60%); }
            78% { transform: translateX(-60%); }
            80% { transform: translateX(-80%); }
            98% { transform: translateX(-80%); }
            100% { transform: translateX(0%); }
          }
        `,
                }}
            />
        </div>
    );
}

export default async function HomeGalleryShowcase() {
    const [brandAlbumSlugs, raw] = await Promise.all([fetchBrandAlbumSlugs(), fetchPhotos()]);

    const allPhotos: GalleryPhoto[] = (raw as any[])
        .map((p) => ({
            ...p,
            image_url: normalizeImageUrl(p.image_url) || p.image_url,
        }))
        .filter((p) => !!p.image_url);

    // ONLY Brand category photos
    const photos = allPhotos.filter((p) => {
        const slug = p.album?.slug;
        return slug ? brandAlbumSlugs.has(slug) : false;
    });

    const portraits = photos
        .filter((p) => p.orientation === "portrait")
        .sort(byNewest)
        .slice(0, 4);

    const landscapes = photos.filter((p) => p.orientation === "landscape").slice(0, 5);

    if (!portraits.length && !landscapes.length) return null;

    return (
        <div className="relative mx-auto h-[80vh] w-full max-w-7xl">
            {/* Small "Show all" button in top-right */}
            <div className="absolute right-4 top-4 z-20">
                <Link
                    href="/gallery"
                    className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80 ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                >
                    Show all
                </Link>
            </div>

            {/* Background glass layer */}
            <div className="absolute inset-0 rounded-3xl bg-black/25 backdrop-blur-[2px]" />

            {/* LEFT static image */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[46%]">
                <div
                    className="absolute inset-0 bg-contain bg-left-bottom bg-no-repeat opacity-95"
                    style={{ backgroundImage: "url(/AMD.png)" }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        WebkitMaskImage: "linear-gradient(to right, black 0%, black 75%, transparent 100%)",
                        maskImage: "linear-gradient(to right, black 0%, black 75%, transparent 100%)",
                    }}
                />
            </div>

            {/* RIGHT content area */}
            <div className="relative ml-[46%] flex h-full flex-col gap-6 p-6">
                {/* Landscape slideshow (NO title text) */}
                <div className="h-[62%] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
                    {landscapes.length ? (
                        <Slideshow items={landscapes.map((p) => ({ src: p.image_url }))} />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-white/60">
                            No images
                        </div>
                    )}
                </div>

                {/* Portrait row (NO text labels) */}
                <div className="h-[38%]">
                    <div className="grid h-full grid-cols-4 gap-4">
                        {portraits.map((p) => (
                            <Link
                                key={p.id}
                                href="/gallery"
                                className="group relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10"
                                aria-label="Open gallery"
                            >
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p.image_url})` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            </Link>
                        ))}

                        {portraits.length < 4 &&
                            Array.from({ length: 4 - portraits.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="rounded-3xl bg-white/5 ring-1 ring-white/10" />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
