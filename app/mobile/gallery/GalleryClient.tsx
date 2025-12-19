// app/mobile/gallery/GalleryClient.tsx
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

  // Close lightbox on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prevent background scroll when lightbox is open (mobile scroll fix)
  useEffect(() => {
    if (lightbox) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [lightbox]);

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
    <div className="space-y-5">
      {/* Search */}
      <div className="top-0 z-20 bg-black px-4 py-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories / albums..."
          className="w-full rounded-2xl bg-white/5 px-4 py-2.5 text-sm text-white/90 ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-white/25"
        />
      </div>

      {/* Category chips */}
      <div className="px-4">
        <div className="overflow-x-auto">
          <div className="flex w-max items-center gap-2 pb-2">
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
      </div>

      {/* Active Category Header */}
      {activeCategory && (
        <div className="px-4">
          <h2 className="text-lg font-extrabold tracking-tight">
            {activeCategory.name}
          </h2>
          <p className="mt-1 text-sm text-white/55">
            Albums and photos inside this category.
          </p>
        </div>
      )}

      {/* Albums */}
      <div className="px-4">
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

                    
                  </div>

                  {/* Photo grid */}
                  {albumPhotos.length === 0 ? (
                    <div className="px-4 pb-4 text-sm text-white/55">
                      No photos in this album.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 px-4 pb-4 touch-pan-y">
                      {albumPhotos.slice(0, 8).map((p) => {
                        const isPortrait = p.orientation === "portrait";

                        return (
                          <button
                            key={p.id}
                            onClick={() => setLightbox(p)}
                            className={[
                              "relative overflow-hidden rounded-2xl ring-1 ring-white/10 hover:ring-white/20",
                              isPortrait ? "col-span-1" : "col-span-2",
                            ].join(" ")}
                            aria-label="Open image"
                          >
                            <div
                              className={[
                                "w-full",
                                isPortrait ? "aspect-[3/4]" : "aspect-[16/9]",
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
                        );
                      })}

                      {albumPhotos.length > 8 && (
                        <div className="col-span-2 rounded-2xl bg-white/5 p-4 text-center text-xs text-white/60 ring-1 ring-white/10">
                          Showing 8 of {albumPhotos.length}.
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TOP-RIGHT CLOSE (X) BUTTON */}
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="fixed z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/20 hover:bg-black"
              style={{
                top: "calc(env(safe-area-inset-top) + 60px)",
                right: "12px",
              }}
            >
              ✕
            </button>

            {/* Image */}
            <div className="flex h-full items-center justify-center p-3">
              <img
                src={lightbox.image_url}
                alt={lightbox.name || ""}
                className="max-h-[90vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
