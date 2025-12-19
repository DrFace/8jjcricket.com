// app/gallery/mobile/GalleryMobileClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

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

interface GalleryMobileClientProps {
  categories: GalleryCategory[];
  albumsByCategoryId: Record<string, GalleryAlbum[]>;
  photosByAlbumSlug: Record<string, GalleryPhoto[]>;
}

export default function GalleryMobileClient({
  categories,
  albumsByCategoryId,
  photosByAlbumSlug,
}: GalleryMobileClientProps) {
  const [activeCat, setActiveCat] = useState<string>(categories[0]?.slug || "");
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.trim().toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.slug === activeCat) || categories[0];
  }, [categories, activeCat]);

  const activeAlbums = useMemo(() => {
    if (!activeCategory) return [];
    const list = albumsByCategoryId[String(activeCategory.id)] || [];
    if (!query.trim()) return list;

    const q = query.trim().toLowerCase();
    return list.filter((a) => a.name.toLowerCase().includes(q));
  }, [activeCategory, albumsByCategoryId, query]);

  return (
    <div className="space-y-6">
      {/* Sticky tools (mobile-first) */}
      <div className="sticky top-0 z-20 -mx-4 bg-black/85 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-black/55">
        {/* Category chip scroller */}
        <div className="-mx-4 overflow-x-auto px-4 pb-2">
          <div className="flex w-max items-center gap-2">
            {filteredCategories.map((c) => {
              const isActive = c.slug === activeCat;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.slug)}
                  className={[
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition",
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
        </div>

        {/* Search (full width) */}
        <div className="mt-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories / albums..."
            className="w-full rounded-2xl bg-white/5 px-4 py-2.5 text-sm text-white/90 ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-white/25"
          />
        </div>
      </div>

      {/* Active Category header */}
      {activeCategory && (
        <div className="space-y-1">
          <h2 className="text-lg font-extrabold tracking-tight">
            {activeCategory.name}
          </h2>
          <p className="text-sm text-white/55">
            Albums and photos inside this category.
          </p>
        </div>
      )}

      {/* Albums (single column, mobile cards) */}
      {activeAlbums.length === 0 ? (
        <div className="rounded-2xl bg-white/5 p-6 text-sm text-white/60 ring-1 ring-white/10">
          No albums found for this category.
        </div>
      ) : (
        <div className="space-y-5">
          {activeAlbums.map((album) => {
            const albumPhotos = photosByAlbumSlug[album.slug] || [];

            return (
              <section
                key={album.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              >
                {/* Album header */}
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-extrabold text-white/90">
                      {album.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/55">
                      {albumPhotos.length} photos
                    </p>
                  </div>

                  {/* Optional small count chip */}
                  <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/75 ring-1 ring-white/10">
                    View
                  </span>
                </div>

                {/* Photo grid (bigger touch targets, 2 cols) */}
                {albumPhotos.length === 0 ? (
                  <div className="px-4 pb-4 text-sm text-white/55">
                    No photos in this album.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                    {albumPhotos.slice(0, 8).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setLightbox(p)}
                        className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 hover:ring-white/20"
                        aria-label="Open image"
                      >
                        {/* Use fixed aspect for mobile consistency */}
                        <div
                          className={[
                            "w-full",
                            p.orientation === "portrait"
                              ? "aspect-[3/4]"
                              : "aspect-[4/3]",
                          ].join(" ")}
                        >
                          <img
                            src={p.image_url}
                            alt={p.name || ""}
                            className="h-full w-full object-cover transition hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </div>
                      </button>
                    ))}

                    {albumPhotos.length > 8 && (
                      <div className="col-span-2 rounded-2xl bg-white/5 p-4 text-center text-xs text-white/60 ring-1 ring-white/10">
                        Showing 8 of {albumPhotos.length}. Open more on desktop if
                        needed.
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Lightbox (mobile-safe) */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex h-full flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-black/50">
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
                  Original
                </a>
                <button
                  onClick={() => setLightbox(null)}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/85 ring-1 ring-white/15 hover:bg-white/15"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Image area */}
            <div className="flex flex-1 items-center justify-center p-3">
              <img
                src={lightbox.image_url}
                alt={lightbox.name || ""}
                className="max-h-[85vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
