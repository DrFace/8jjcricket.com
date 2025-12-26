"use client";

import { useMemo, useState } from "react";

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

const BACKEND_ORIGIN =
    (process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://72.60.107.98:8001").replace(/\/+$/, "");

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

function getHero(p: PortraitPage) {
    return toStorageUrl(pickFirst(p.hero_image_url, p.hero_image_path));
}

function getHover(p: PortraitPage) {
    return toStorageUrl(pickFirst(p.hover_banner_url, p.hover_banner_path));
}

function getMainPortrait(p: PortraitPage) {
    return toStorageUrl(
        pickFirst(
            p.main_portrait_url,
            p.main_portrait_path,
            p.portrait_image_url,
            p.portrait_image_path
        )
    );
}

export default function PortraitShowcase({ pages }: { pages: PortraitPage[] }) {
    const cleanPages = useMemo(
        () => (pages || []).filter((p) => !!p?.slug && !!p?.title),
        [pages]
    );

    const defaultBig = useMemo(() => {
        const first = cleanPages[0];
        if (!first) return null;
        return getHero(first) || getHover(first) || getMainPortrait(first);
    }, [cleanPages]);

    const [bigImage, setBigImage] = useState<string | null>(defaultBig);

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
                        {/* TOP RIGHT BIG CARD */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                            {bigImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={bigImage}
                                    alt="Right preview"
                                    className="h-[260px] w-full object-cover"
                                />
                            ) : (
                                <div className="h-[260px] w-full bg-gradient-to-br from-white/10 to-white/5" />
                            )}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
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
