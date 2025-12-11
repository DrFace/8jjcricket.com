"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Article = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    published_at: string | null;
};

const SITE_ORIGIN =
    process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

function normalizeImageUrl(url: string | null): string | null {
    if (!url) return null;

    try {
        const u = new URL(url, SITE_ORIGIN);
        let pathname = u.pathname;

        if (!pathname.startsWith("/storage/")) {
            const clean = pathname.replace(/^\/+/, "");
            pathname = `/storage/${clean}`;
        }

        return `${SITE_ORIGIN}${pathname}${u.search}`;
    } catch {
        const clean = String(url).replace(/^\/+/, "");
        return `${SITE_ORIGIN}/storage/${clean}`;
    }
}

type Props = {
    articles: Article[]; // <- same type as your `news`
};

export default function NewsBannerCarousel({ articles }: Props) {
    const items = articles.slice(0, 6);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;
        const timer = setInterval(
            () => setActiveIndex((prev) => (prev + 1) % items.length),
            5000
        );
        return () => clearInterval(timer);
    }, [items.length]);

    if (items.length === 0) return null;

    const active = items[activeIndex];
    const imgSrc = normalizeImageUrl(active.image_url);

    return (
        <section className="w-full bg-gray-900">
            <div className="mx-auto max-w-6xl px-3 pt-4 sm:px-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Latest news
                </p>

                <div className="overflow-hidden rounded-2xl bg-black/50 shadow-md">
                    <Link
                        href={`/news/${active.slug}`}
                        className="relative block h-32 sm:h-40 md:h-52 lg:h-56"
                    >
                        {imgSrc ? (
                            <Image
                                src={imgSrc}
                                alt={active.title}
                                fill
                                priority
                                sizes="(min-width: 1024px) 960px, 100vw"
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-r from-emerald-700 to-emerald-900" />
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />

                        <div className="absolute inset-y-0 left-0 flex items-center">
                            <div className="px-4 sm:px-6">
                                <div className="inline-flex items-center rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                                    Breaking
                                </div>

                                <h2 className="mt-2 max-w-xl text-sm font-semibold text-white sm:text-lg lg:text-xl">
                                    {active.title}
                                </h2>

                                {active.excerpt && (
                                    <p className="mt-1 hidden max-w-lg text-xs text-gray-100/85 sm:block">
                                        {active.excerpt}
                                    </p>
                                )}

                                {active.published_at && (
                                    <p className="mt-1 text-[11px] font-medium text-emerald-200">
                                        {new Date(active.published_at).toLocaleDateString(
                                            undefined,
                                            {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            }
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Link>

                    {items.length > 1 && (
                        <div className="flex items-center justify-end gap-2 px-4 pb-2 pt-1">
                            {items.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-1.5 rounded-full transition-all ${index === activeIndex
                                            ? "w-4 bg-white"
                                            : "w-1.5 bg-white/40"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
