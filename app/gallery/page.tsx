// app/gallery/page.tsx
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import GalleryClient from "./GalleryClient";

type GalleryCategory = {
    id: number;
    name: string;
    slug: string;
};

type GalleryAlbum = {
    id: number;
    name: string;
    slug: string;
    category?: { id: number; name: string; slug: string } | null;
};

type GalleryPhoto = {
    id: number;
    name: string;
    slug: string;
    orientation: "portrait" | "landscape";
    image_url: string;
    album?: { id: number; name: string; slug: string } | null;
};

const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

function apiBase() {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE).replace(/\/+$/, "");
}

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

async function fetchCategories(): Promise<GalleryCategory[]> {
    const url = `${apiBase()}/gallery/categories`;
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data || []) as GalleryCategory[];
    } catch {
        return [];
    }
}

async function fetchAlbums(): Promise<GalleryAlbum[]> {
    const url = `${apiBase()}/gallery/albums`;
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data || []) as GalleryAlbum[];
    } catch {
        return [];
    }
}

async function fetchPhotos(): Promise<GalleryPhoto[]> {
    const url = `${apiBase()}/gallery/photos`;
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data || []) as GalleryPhoto[];
    } catch {
        return [];
    }
}

export default async function GalleryPage() {
    const [categories, albums, photosRaw] = await Promise.all([
        fetchCategories(),
        fetchAlbums(),
        fetchPhotos(),
    ]);

    const photos: GalleryPhoto[] = photosRaw
        .map((p) => ({
            ...p,
            image_url: normalizeImageUrl(p.image_url) || p.image_url,
        }))
        .filter((p) => !!p.image_url);

    // Build maps
    const albumsByCategoryId = new Map<number, GalleryAlbum[]>();
    for (const a of albums) {
        const cid = a.category?.id;
        if (!cid) continue;
        if (!albumsByCategoryId.has(cid)) albumsByCategoryId.set(cid, []);
        albumsByCategoryId.get(cid)!.push(a);
    }

    const photosByAlbumSlug = new Map<string, GalleryPhoto[]>();
    for (const p of photos) {
        const aslug = p.album?.slug;
        if (!aslug) continue;
        if (!photosByAlbumSlug.has(aslug)) photosByAlbumSlug.set(aslug, []);
        photosByAlbumSlug.get(aslug)!.push(p);
    }

    const totalAlbums = albums.length;
    const totalPhotos = photos.length;

    return (
        <>
            <TopNav />

            <main className="min-h-screen bg-black text-white">
                <div className="mx-auto w-full max-w-7xl px-4 py-8">
                    {/* HERO */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 sm:p-10">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-white/70">
                                    8JJ SPORTS • GALLERY
                                </p>
                                <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                    Moments. Matches. Memories.
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-white/65">
                                    Browse images by category and album. Click any photo to view fullscreen.
                                </p>

                                <div className="mt-5 flex flex-wrap gap-3 text-xs">
                                    <span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/10">
                                        {categories.length} Categories
                                    </span>
                                    <span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/10">
                                        {totalAlbums} Albums
                                    </span>
                                    <span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/10">
                                        {totalPhotos} Photos
                                    </span>
                                </div>
                            </div>

                            <Link
                                href="/"
                                className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold text-white/85 ring-1 ring-white/15 hover:bg-white/15"
                            >
                                Back Home
                            </Link>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="mt-8">
                        {categories.length === 0 ? (
                            <div className="rounded-2xl bg-white/5 p-8 text-sm text-white/60 ring-1 ring-white/10">
                                No categories found.
                            </div>
                        ) : (
                            <GalleryClient
                                categories={categories}
                                albumsByCategoryId={Object.fromEntries(
                                    Array.from(albumsByCategoryId.entries()).map(([k, v]) => [String(k), v])
                                )}
                                photosByAlbumSlug={Object.fromEntries(photosByAlbumSlug.entries())}
                            />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
