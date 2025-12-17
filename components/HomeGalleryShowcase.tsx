// components/HomeGalleryShowcase.tsx
import Link from "next/link";
import BrandBannerHoverBlock from "./BrandBannerHoverBlock";

type GalleryPhoto = {
    id: number;
    name: string;
    slug: string;
    orientation: "portrait" | "landscape";
    image_url: string;
    album?: { id: number; name: string; slug: string } | null;
    created_at?: string;
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

async function fetchBrandBanners(): Promise<any[]> {
    const url = `${apiBase()}/brand-banners`;
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data || [];
    } catch {
        return [];
    }
}

function byNewest(a: any, b: any) {
    const da = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
}

export default async function HomeGalleryShowcase() {
    const [brandAlbumSlugs, raw, bannersRaw] = await Promise.all([
        fetchBrandAlbumSlugs(),
        fetchPhotos(),
        fetchBrandBanners(),
    ]);

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

    // Portraits
    const portraits = photos.filter((p) => p.orientation === "portrait").sort(byNewest);

    // Landscapes for fallback slideshow
    const landscapes = photos.filter((p) => p.orientation === "landscape").sort(byNewest).slice(0, 5);

    if (!portraits.length && !landscapes.length) return null;

    // Build map: portraitId -> bannerImageUrl
    // API expected item shape:
    // { banner_image_url: string, portrait_image: { id: number } }
    const bannerByPortraitId: Record<number, string> = {};
    const normalizedBanners = (bannersRaw as any[]).map((b) => {
        const bannerUrl = normalizeImageUrl(b?.banner_image_url) || b?.banner_image_url;
        return { ...b, banner_image_url: bannerUrl };
    });

    for (const b of normalizedBanners) {
        const pid = b?.portrait_image?.id;
        const bannerUrl = b?.banner_image_url;
        if (pid && bannerUrl) bannerByPortraitId[Number(pid)] = String(bannerUrl);
    }

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

            {/* RIGHT content area (1 + 2 controlled together) */}
            <BrandBannerHoverBlock
                portraits={portraits.map((p) => ({ id: p.id, image_url: p.image_url }))}
                bannerByPortraitId={bannerByPortraitId}
                bannersList={normalizedBanners}
                landscapes={landscapes.map((p) => ({ src: p.image_url }))}
            />
        </div>
    );
}
