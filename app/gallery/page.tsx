// app/gallery/page.tsx
import Link from "next/link";

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
    const [categories, albums, photosRaw] = await Promise.all([fetchCategories(), fetchAlbums(), fetchPhotos()]);

    const photos = photosRaw
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

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight">Gallery</h1>
                        <p className="mt-1 text-sm text-white/60">All images grouped by Categories and Albums</p>
                    </div>

                    <Link
                        href="/"
                        className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80 ring-1 ring-white/15 hover:bg-white/15"
                    >
                        Back Home
                    </Link>
                </div>

                {/* Category quick links */}
                {categories.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {categories.map((c) => (
                            <a
                                key={c.id}
                                href={`#cat-${c.slug}`}
                                className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/10 hover:bg-white/10"
                            >
                                {c.name}
                            </a>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="mt-8 space-y-10">
                    {categories.length === 0 ? (
                        <div className="rounded-2xl bg-white/5 p-8 text-sm text-white/60 ring-1 ring-white/10">
                            No categories found.
                        </div>
                    ) : (
                        categories.map((cat) => {
                            const catAlbums = albumsByCategoryId.get(cat.id) || [];

                            return (
                                <section key={cat.id} id={`cat-${cat.slug}`} className="scroll-mt-24">
                                    {/* Category title */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-lg font-extrabold">{cat.name}</h2>
                                        <a href="#top" className="text-xs text-white/50 hover:text-white/80">
                                            Back to top
                                        </a>
                                    </div>

                                    {catAlbums.length === 0 ? (
                                        <div className="rounded-2xl bg-white/5 p-6 text-sm text-white/60 ring-1 ring-white/10">
                                            No albums in this category.
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {catAlbums.map((album) => {
                                                const albumPhotos = photosByAlbumSlug.get(album.slug) || [];

                                                return (
                                                    <div key={album.id}>
                                                        {/* Album heading */}
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <h3 className="text-sm font-bold text-white/90">{album.name}</h3>
                                                            <span className="text-xs text-white/50">{albumPhotos.length} photos</span>
                                                        </div>

                                                        {albumPhotos.length === 0 ? (
                                                            <div className="rounded-2xl bg-white/5 p-6 text-sm text-white/60 ring-1 ring-white/10">
                                                                No photos in this album.
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                                                {albumPhotos.map((p) => (
                                                                    <a
                                                                        key={p.id}
                                                                        href={p.image_url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 hover:ring-white/20"
                                                                        aria-label="Open image"
                                                                    >
                                                                        <img
                                                                            src={p.image_url}
                                                                            alt=""
                                                                            className="h-48 w-full object-cover transition group-hover:scale-[1.02]"
                                                                            loading="lazy"
                                                                        />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>
                            );
                        })
                    )}
                </div>
            </div>

            {/* anchor for "top" */}
            <div id="top" />
        </main>
    );
}
