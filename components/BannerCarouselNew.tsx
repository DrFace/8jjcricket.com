"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ApiBase } from "@/lib/utils";

type CarouselItem = { image?: string | null };

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

/**
 * Always return a SAME-ORIGIN https URL pointing to Laravel public storage.
 *
 * Backend commonly stores: "carousel/abc.jpg"
 * Public URL should be:    https://8jjcricket.com/storage/carousel/abc.jpg
 */
function normalizeCarouselUrl(input: string): string {
  if (!input) return "";

  const origin =
    typeof window !== "undefined" ? window.location.origin : SITE_ORIGIN;

  // Build a URL relative to the site origin (this also handles absolute input URLs)
  let pathname = "";

  try {
    const u = new URL(input, origin);
    pathname = u.pathname;
  } catch {
    pathname = input;
  }

  // Remove accidental leading slashes
  const clean = String(pathname).replace(/^\/+/, "");

  // If already storage/..., keep it; else force /storage/<clean>
  const finalPath = clean.startsWith("storage/")
    ? `/${clean}`
    : `/storage/${clean}`;

  return `${origin}${finalPath}`;
}

export default function BannerCarouselNew() {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const timer = useRef<number | null>(null);

  const len = images.length;

  async function fetchImages(): Promise<string[]> {
    try {
      const apiBase = ApiBase().replace(/\/+$/, ""); // should be https://8jjcricket.com/api
      const res = await fetch(`${apiBase}/carousels`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`Failed to load images: ${res.status}`);

      const json = await res.json();

      // Support both: [] and { data: [] }
      const arr: CarouselItem[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
          ? json.data
          : [];

      return arr
        .map((item) => (item?.image ? String(item.image) : ""))
        .filter(Boolean);
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  }

  // Initial load
  useEffect(() => {
    fetchImages()
      .then((urls) => {
        setImages(urls);
        setIndex(0);
      })
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto slide
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
          {images.map((imageUrl, i) => (
            <div key={i} className="relative h-full w-full flex-shrink-0">
              <Image
                src={normalizeCarouselUrl(imageUrl)}
                alt={`Slide ${i + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls only if > 1 */}
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
            {images.map((_, i) => (
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
