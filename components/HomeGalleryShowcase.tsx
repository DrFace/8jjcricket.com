// components/HomeGalleryShowcase.tsx
import HomeGalleryShowcaseClient from "./HomeGalleryShowcaseClient";

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

    // Landscapes for slideshow (ALL, not sliced)
    const landscapes = photos.filter((p) => p.orientation === "landscape").sort(byNewest);

    if (!portraits.length && !landscapes.length) return null;

    // portraitId -> bannerImageUrl (used for LEFT hover image only)
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
        <HomeGalleryShowcaseClient
            portraits={portraits.map((p) => ({ id: p.id, image_url: p.image_url }))}
            bannerByPortraitId={bannerByPortraitId}
            landscapes={landscapes.map((p) => ({ src: p.image_url }))}
            leftDefaultSrc="/AMD.png"
        />
    );
}
