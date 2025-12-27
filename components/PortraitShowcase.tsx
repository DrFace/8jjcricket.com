"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PortraitPage = {
    id: number;
    slug: string;
    title: string;
    subtitle?: string | null;

    hero_image_path?: string | null;
    hero_image_url?: string | null;

    hover_banner_path?: string | null;
    hover_banner_url?: string | null;

    main_portrait_path?: string | null;
    main_portrait_url?: string | null;

    portrait_image_path?: string | null;
    portrait_image_url?: string | null;
};

type CarouselItem = {
    id: number;
    image_url: string | null;
    created_at?: string;
};

const BACKEND_ORIGIN = (process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://72.60.107.98:8001").replace(
    /\/+$/,
    ""
);

function pickFirst<T>(...vals: (T | null | undefined)[]) {
    for (const v of vals) if (v !== null && v !== undefined && String(v).trim() !== "") return v;
    return null;
}

function toStorageUrl(pathOrUrl: string | null): string | null {
    if (!pathOrUrl) return null;

    // already full URL
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

    // normalize windows slashes
    const clean = String(pathOrUrl).replaceAll("\\", "/").replace(/^\/+/, "");
    return `${BACKEND_ORIGIN}/storage/${clean}`;
}

/**
 * Some APIs may return absolute URLs using a different host/domain.
 * If it's already http(s), keep it. If it's relative, convert to /storage/.
 */
function normalizeCarouselUrl(url: string | null): string | null {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    return toStorageUrl(url);
}

function getHero(p: PortraitPage) {
    return toStorageUrl(pickFirst(p.hero_image_url, p.hero_image_path));
}

function getHover(p: PortraitPage) {
    return toStorageUrl(pickFirst(p.hover_banner_url, p.hover_banner_path));
}

function getMainPortrait(p: PortraitPage) {
    return toStorageUrl(
        pickFirst(p.main_portrait_url, p.main_portrait_path, p.portrait_image_url, p.portrait_image_path)
    );
}

export default function PortraitShowcase({ pages }: { pages: PortraitPage[] }) {
    const cleanPages = useMemo(() => (pages || []).filter((p) => !!p?.slug && !!p?.title), [pages]);

    const defaultBig = useMemo(() => {
        const first = cleanPages[0];
        if (!first) return null;
        return getHero(first) || getHover(first) || getMainPortrait(first);
    }, [cleanPages]);

    const [bigImage, setBigImage] = useState<string | null>(defaultBig);

    // -----------------------------
    // Carousel (top-right) state
    // -----------------------------
    const [carousel, setCarousel] = useState<CarouselItem[]>([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const timerRef = useRef<number | null>(null);

    const slides = useMemo(() => {
        const imgs = (carousel || [])
            .map((c) => normalizeCarouselUrl(c.image_url))
            .filter((u): u is string => !!u);
        return imgs;
    }, [carousel]);

    const hasSlides = slides.length > 0;

    const stop = () => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const start = () => {
        stop();
        if (!hasSlides || slides.length <= 1) return;
        timerRef.current = window.setTimeout(() => {
            setCarouselIndex((i) => (i + 1) % slides.length);
        }, 4000);
    };

    useEffect(() => {
        // fetch carousel items from backend
        let cancelled = false;

        async function load() {
            try {
                const res = await fetch(`${BACKEND_ORIGIN}/api/carousels`, { cache: "no-store" });
                if (!res.ok) return;

                const json = await res.json();
                const items = (json?.data || []) as CarouselItem[];
                if (!cancelled) {
                    setCarousel(Array.isArray(items) ? items : []);
                    setCarouselIndex(0);
                }
            } catch {
                // ignore
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        start();
        return stop;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carouselIndex, hasSlides, slides.length]);

    const prevSlide = () => {
        if (!hasSlides) return;
        setCarouselIndex((i) => (i - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        if (!hasSlides) return;
        setCarouselIndex((i) => (i + 1) % slides.length);
    };

    const activeSlide = hasSlides ? slides[carouselIndex] : null;

    return (
        <section className="mx-auto w-full max-w-7xl px-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
                    {/* LEFT BIG IMAGE */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                        {bigImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={bigImage}
                                alt="Portrait preview"
                                className="h-[420px] w-full object-cover sm:h-[520px]"
                            />
                        ) : (
                            <div className="h-[420px] w-full bg-gradient-to-br from-white/10 to-white/5 sm:h-[520px]" />
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col gap-4">
                        {/* TOP RIGHT BIG CARD (NOW: CAROUSEL SLIDESHOW) */}
                        <div
                            className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20"
                            onMouseEnter={stop}
                            onMouseLeave={start}
                        >
                            {activeSlide ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={activeSlide} alt="Carousel banner" className="h-[260px] w-full object-cover" />
                            ) : bigImage ? (
                                // fallback: keep existing behavior if no carousel images yet
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={bigImage} alt="Right preview" className="h-[260px] w-full object-cover" />
                            ) : (
                                <div className="h-[260px] w-full bg-gradient-to-br from-white/10 to-white/5" />
                            )}

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                            {/* controls only when we actually have slides */}
                            {hasSlides && slides.length > 1 ? (
                                <>
                                    <button
                                        type="button"
                                        aria-label="previous"
                                        onClick={prevSlide}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/40 backdrop-blur hover:bg-black/55 active:scale-95"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
                                            <path
                                                d="M15 18l-6-6 6-6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>

                                    <button
                                        type="button"
                                        aria-label="next"
                                        onClick={nextSlide}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/40 backdrop-blur hover:bg-black/55 active:scale-95"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
                                            <path
                                                d="M9 6l6 6-6 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>

                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                                        {slides.map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setCarouselIndex(i)}
                                                aria-label={`go to slide ${i + 1}`}
                                                className={`h-2.5 w-2.5 rounded-full transition-all ${i === carouselIndex ? "scale-110 bg-white" : "bg-white/50 hover:bg-white/80"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : null}
                        </div>

                        {/* BOTTOM RIGHT: MAIN PORTRAITS (hover changes left image) */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {cleanPages.map((p) => {
                                    const thumb = getMainPortrait(p);
                                    const hoverImg = getHover(p) || getHero(p) || thumb;

                                    return (
                                        <a
                                            key={p.id}
                                            href={`/portraits/${p.slug}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group relative w-[150px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                                            onMouseEnter={() => setBigImage(hoverImg)}
                                            onMouseLeave={() => setBigImage(defaultBig)}
                                            title={p.title}
                                        >
                                            {thumb ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={thumb}
                                                    alt={p.title}
                                                    className="h-[190px] w-full object-cover transition group-hover:scale-[1.02]"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="h-[190px] w-full bg-gradient-to-br from-white/10 to-white/5" />
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
