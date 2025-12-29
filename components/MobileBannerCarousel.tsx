"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ApiBase } from "@/lib/utils";

type CarouselRow = {
    image?: string | null; // backend returns this field :contentReference[oaicite:3]{index=3}
};

const SITE_ORIGIN =
    process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

/**
 * Normalize backend "image" field into a safe HTTPS URL.
 *
 * Backend stores: "carousel/filename.jpg" (from store('carousel','public')) :contentReference[oaicite:4]{index=4}
 * Public URL should be: https://8jjcricket.com/storage/carousel/filename.jpg
 */
function normalizeStorageUrl(input: string): string {
    if (!input) return "";

    const origin =
        typeof window !== "undefined" ? window.location.origin : SITE_ORIGIN;

    // If backend accidentally returns absolute URLs, normalize bad hosts/schemes.
    if (input.startsWith("http://") || input.startsWith("https://")) {
        try {
            const u = new URL(input);

            // Force storage URLs to your site origin to prevent mixed-content / wrong host
            const badHosts = new Set(["72.60.107.98", "127.0.0.1", "localhost"]);
            if (badHosts.has(u.hostname) || u.port === "8001") {
                return `${origin}${u.pathname}${u.search}`;
            }

            // If it's http on an https site, rewrite to site origin (best effort)
            if (u.protocol === "http:") {
                return `${origin}${u.pathname}${u.search}`;
            }

            // Otherwise keep the absolute https URL
            return input;
        } catch {
            // fall through to relative normalization
        }
    }

    // Strip leading slashes
    const clean = input.replace(/^\/+/, "");

    // If already starts with storage/, just prefix origin
    if (clean.startsWith("storage/")) {
        return `${origin}/${clean}`;
    }

    // Otherwise, treat it as a Laravel public-disk path and map to /storage/<path>
    // Example: "carousel/abc.jpg" -> "/storage/carousel/abc.jpg"
    return `${origin}/storage/${clean}`;
}

function isVideoUrl(u: string): boolean {
    const s = (u || "").toLowerCase();
    return (
        s.endsWith(".mp4") ||
        s.endsWith(".mov") ||
        s.endsWith(".webm") ||
        s.endsWith(".m4v") ||
        s.includes(".mp4?") ||
        s.includes(".mov?") ||
        s.includes(".webm?") ||
        s.includes(".m4v?")
    );
}

export default function MobileBannerCarousel() {
    const [index, setIndex] = useState(0);
    const [items, setItems] = useState<string[]>([]);
    const timer = useRef<number | null>(null);

    const len = items.length;

    const apiUrl = useMemo(() => {
        const base = ApiBase().replace(/\/+$/, "");
        // ApiBase() is expected to be ".../api" based on env usage
        return `${base}/carousels`;
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(apiUrl, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    cache: "no-store",
                });

                if (!res.ok) throw new Error(`GET ${apiUrl} failed: ${res.status}`);

                const json = await res.json();

                // Backend returns array directly :contentReference[oaicite:5]{index=5}
                const arr: CarouselRow[] = Array.isArray(json) ? json : json?.data || [];

                const urls = arr
                    .map((r) => (r?.image ? String(r.image) : ""))
                    .filter(Boolean);

                setItems(urls);
                setIndex(0);
            } catch (e) {
                console.error("Carousel fetch failed:", e);
                setItems([]);
            }
        };

        load();
    }, [apiUrl]);

    // Auto-slide
    useEffect(() => {
        const stop = () => {
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
        };

        const start = () => {
            stop();
            if (len > 1) {
                timer.current = window.setTimeout(() => {
                    setIndex((i) => (i + 1) % len);
                }, 4000);
            }
        };

        start();
        return stop;
    }, [index, len]);

    // Swipe support
    const touchX = useRef<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
        touchX.current = e.touches[0].clientX;
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchX.current === null) return;

        const dx = e.changedTouches[0].clientX - touchX.current;

        if (Math.abs(dx) > 40 && len > 1) {
            setIndex((i) => (dx > 0 ? (i - 1 + len) % len : (i + 1) % len));
        }

        touchX.current = null;
    };

    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl shadow h-[150px] sm:h-[190px] md:h-[230px] lg:h-[270px]"
            onMouseEnter={() => {
                if (timer.current) {
                    clearTimeout(timer.current);
                    timer.current = null;
                }
            }}
            onMouseLeave={() => {
                if (len > 1) {
                    timer.current = window.setTimeout(() => {
                        setIndex((i) => (i + 1) % len);
                    }, 4000);
                }
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="relative h-full">
                <div
                    className="flex h-full w-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {items.map((raw, i) => {
                        const src = normalizeStorageUrl(raw);
                        const video = isVideoUrl(src);

                        return (
                            <div key={i} className="relative h-full w-full flex-shrink-0">
                                {video ? (
                                    <video
                                        className="h-full w-full object-cover"
                                        src={src}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                    />
                                ) : (
                                    <Image
                                        src={src}
                                        alt={`Slide ${i + 1}`}
                                        fill
                                        sizes="100vw"
                                        className="object-cover"
                                        priority={i === 0}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls only if more than 1 item */}
            {len > 1 && (
                <>
                    <button
                        aria-label="previous"
                        onClick={() => setIndex((i) => (i - 1 + len) % len)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-black/40 hover:bg-black/55 backdrop-blur active:scale-95"
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
                        aria-label="next"
                        onClick={() => setIndex((i) => (i + 1) % len)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-black/40 hover:bg-black/55 backdrop-blur active:scale-95"
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
                        {items.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`go to slide ${i + 1}`}
                                className={`h-2.5 w-2.5 rounded-full transition-all ${i === index
                                        ? "scale-110 bg-white"
                                        : "bg-white/50 hover:bg-white/80"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
