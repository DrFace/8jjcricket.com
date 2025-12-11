// components/NewsCarousel.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NewsItem = {
    id: number;
    slug: string;
    title: string;
    imgSrc: string;
};

interface NewsCarouselProps {
    items: NewsItem[];
    intervalMs?: number; // autoplay interval
}

export default function NewsCarousel({
    items,
    intervalMs = 4000,
}: NewsCarouselProps) {
    const [index, setIndex] = useState(0);

    const count = items.length;
    const hasItems = count > 0;

    // Autoplay
    useEffect(() => {
        if (!hasItems) return;

        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % count);
        }, intervalMs);

        return () => clearInterval(id);
    }, [count, hasItems, intervalMs]);

    if (!hasItems) return null;

    return (
        <div className="relative w-full overflow-hidden rounded-2xl">
            {/* Slider track */}
            <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {items.map((a) => (
                    <Link
                        key={a.id}
                        href={`/news/${a.slug}`}
                        className="relative h-40 w-full flex-shrink-0 sm:h-48"
                    >
                        <img
                            src={a.imgSrc}
                            alt={a.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/95 to-transparent p-3">
                            <p className="line-clamp-1 text-xs font-semibold text-gray-900">
                                {a.title}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Small dots indicator (optional but helpful) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center gap-1">
                {items.map((_, i) => (
                    <span
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-gray-900/80" : "bg-gray-400/60"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
