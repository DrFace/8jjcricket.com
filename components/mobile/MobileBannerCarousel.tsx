"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type CarouselItem = { image?: string | null };

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

function normalizeCarouselUrl(input: string): string {
  if (!input) return "";

  // FORCE production origin — images are NOT on localhost
  const origin = "https://8jjcricket.com";

  // Fix Windows-style backslashes returned by API
  const fixed = String(input).replace(/\\/g, "/").replace(/^\/+/, "");

  // Ensure storage prefix
  const finalPath = fixed.startsWith("storage/")
    ? `/${fixed}`
    : `/storage/${fixed}`;

  return `${origin}${finalPath}`;
}

export default function MobileBannerCarousel() {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const timer = useRef<number | null>(null);

  const len = images.length;

  async function fetchImages(): Promise<string[]> {
    try {
      // ✅ Same-origin request to Next.js API proxy (no CORS issues)
      const res = await fetch(`/api/carousels`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`Failed to load images: ${res.status}`);

      const json = await res.json();

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

  useEffect(() => {
    fetchImages()
      .then((urls) => {
        setImages(urls);
        setIndex(0);
      })
      .catch((err) => console.error(err));
  }, []);

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
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === index
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
