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

export default function BannerCarouselNew() {
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
      className="relative w-full overflow-hidden rounded-2xl shadow h-full"
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
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out rounded-2xl"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((imageUrl, i) => (
            <div
              key={i}
              className="relative h-full w-full flex-shrink-0 rounded-2xl"
            >
              <Image
                src={normalizeCarouselUrl(imageUrl)}
                alt={`Slide ${i + 1}`}
                fill
                className="object-cover rounded-2xl"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
