"use client";

import { useEffect, useMemo, useState } from "react";

type GalleryCategory = { id: number; name: string; slug: string };
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

export default function GalleryClient({
    categories,
    albumsByCategoryId,
    photosByAlbumSlug,
}: {
    categories: GalleryCategory[];
    albumsByCategoryId: Record<string, GalleryAlbum[]>;
    photosByAlbumSlug: Record<string, GalleryPhoto[]>;
}) {
    const [activeCat, setActiveCat] = useState<string>(categories[0]?.slug || "");
    const [query, setQuery] = useState("");
    const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

    // ESC closes lightbox
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightbox(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const filteredCategories = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter((c) => c.name.toLowerCase().includes(q));
    }, [categories, query]);

    const activeCategory = useMemo(() => {
        return categories.find((c) => c.slug === activeCat) || categories[0];
    }, [categories, activeCat]);

    const activeAlbums = useMemo(() => {
        if (!activeCategory) return [];
        const list = albumsByCategoryId[String(activeCategory.id)] || [];
        const q = query.trim().toLowerCase();
        if (!q) return list;
        return list.filter((a) => a.name.toLowerCase().includes(q));
    }, [activeCategory, albumsByCategoryId, query]);

    return (
        <div className="space-y-8">
            {/* Sticky tools row */}
            <div className="sticky top-0 z-20 -mx-4 bg-black/80 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-black/50">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2">
                        {filteredCategories.map((c) => {
                            const isActive = c.slug === activeCat;
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => setActiveCat(c.slug)}
                                    className={[
                                        "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition",
                                        isActive
                                            ? "bg-white text-black ring-white"
                                            : "bg-white/5 text-white/80 ring-white/10 hover:bg-white/10",
                                    ].join(" ")}
                                >
                                    {c.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search categories / albums..."
                            className="w-full rounded-2xl bg-white/5 px-4 py-2 text-sm text-white/90 ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-white/25 sm:w-72"
                        />
                    </div>
                </div>
            </div>

            {/* Active Category Header */}
            {activeCategory && (
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight">{activeCategory.name}</h2>
                        <p className="mt-1 text-sm text-white/55">Albums and photos inside this category.</p>
                    </div>
                </div>
            )}

            {/* Albums */}
            {activeAlbums.length === 0 ? (
                <div className="rounded-2xl bg-white/5 p-8 text-sm text-white/60 ring-1 ring-white/10">
                    No albums found for this category.
                </div>
            ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                    {activeAlbums.map((album) => {
                        const albumPhotos = photosByAlbumSlug[album.slug] || [];
                        const cover = albumPhotos[0]?.image_url;

                        return (
                            <section
                                key={album.id}
                                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                            >
                                {/* Album header */}
                                <div className="flex items-center justify-between gap-3 p-5">
                                    <div>
                                        <h3 className="text-sm font-extrabold text-white/90">{album.name}</h3>
                                        <p className="mt-1 text-xs text-white/55">{albumPhotos.length} photos</p>
                                    </div>

                                    {cover ? (
                                        <div className="h-12 w-12 overflow-hidden rounded-2xl ring-1 ring-white/10">
                                            <img
                                                src={cover}
                                                alt=""
                                                className="h-full w-full object-cover transition group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : null}
                                </div>

                                {/* Photo grid */}
                                {albumPhotos.length === 0 ? (
                                    <div className="px-5 pb-5 text-sm text-white/55">No photos in this album.</div>
                                ) : (
                                    <div className="grid auto-rows-[110px] grid-cols-2 gap-3 px-5 pb-5 sm:grid-cols-3">
                                        {albumPhotos.slice(0, 12).map((p) => (
                                            <button
                                                key={p.id}
                                                onClick={() => setLightbox(p)}
                                                className={[
                                                    "relative overflow-hidden rounded-2xl ring-1 ring-white/10 hover:ring-white/20",
                                                    p.orientation === "portrait" ? "row-span-2" : "row-span-1",
                                                ].join(" ")}
                                                aria-label="Open image"
                                            >
                                                <img
                                                    src={p.image_url}
                                                    alt=""
                                                    className="h-full w-full object-cover transition hover:scale-[1.02]"
                                                    loading="lazy"
                                                />
                                            </button>
                                        ))}

                                        {albumPhotos.length > 12 ? (
                                            <div className="col-span-2 flex items-center justify-center rounded-2xl bg-white/5 p-4 text-xs text-white/60 ring-1 ring-white/10 sm:col-span-3">
                                                Showing 12 of {albumPhotos.length}.
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            )}

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur"
                    onClick={() => setLightbox(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white/90">
                                    {lightbox.name || "Photo"}
                                </p>
                                <p className="text-xs text-white/50">{lightbox.orientation}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={lightbox.image_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/85 ring-1 ring-white/15 hover:bg-white/15"
                                >
                                    Open Original
                                </a>
                                <button
                                    onClick={() => setLightbox(null)}
                                    className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/85 ring-1 ring-white/15 hover:bg-white/15"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[80vh] overflow-auto">
                            <img src={lightbox.image_url} alt="" className="h-auto w-full object-contain" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
