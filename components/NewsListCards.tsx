"use client";

import Link from "next/link";

type NewsItem = {
    id: number;
    slug: string;
    title: string;
    imgSrc: string;
    date?: string;
};

export default function NewsListCards({ items }: { items: NewsItem[] }) {
    return (
        <div className="space-y-3">
            {items.map((n) => (
                <Link
                    key={n.id}
                    href={`/mobile/news/${n.slug}`}
                    className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition hover:bg-white/10"
                >
                    {/* Thumbnail */}
                    <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-black/40">
                        <img
                            src={n.imgSrc}
                            alt={n.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    {/* Text */}
                    <div className="flex min-w-0 flex-col justify-between">
                        <p className="line-clamp-2 text-sm font-semibold text-white">
                            {n.title}
                        </p>
                        <span className="mt-1 text-xs text-white/60">
                            {n.date ?? ""}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
