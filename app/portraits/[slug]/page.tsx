// app/portraits/[slug]/page.tsx
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

const BACKEND_ORIGIN =
    (process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://72.60.107.98:8001").replace(/\/+$/, "");

function pickFirst<T>(...vals: (T | null | undefined)[]) {
    for (const v of vals) {
        if (v !== null && v !== undefined && String(v).trim() !== "") return v;
    }
    return null;
}

function toStorageUrl(pathOrUrl: string | null): string | null {
    if (!pathOrUrl) return null;

    // Already full URL
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

    // Normalize windows backslashes -> forward slashes
    const clean = String(pathOrUrl).replaceAll("\\", "/").replace(/^\/+/, "");

    // Portrait files are typically stored under Laravel public storage => /storage/<path>
    return `${BACKEND_ORIGIN}/storage/${clean}`;
}

async function fetchPortrait(slug: string) {
    const url = `${BACKEND_ORIGIN}/api/portraits/${encodeURIComponent(slug)}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;

    const json = await res.json();
    return (json?.data ?? json) as any;
}

export default async function PortraitDetailsPage({
    params,
}: {
    params: { slug: string };
}) {
    const data = await fetchPortrait(params.slug);

    if (!data) {
        return (
            <>
                <TopNav />
                <main className="mx-auto max-w-6xl px-6 py-16 text-white">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/70">
                        Portrait page not found or not published.
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const title = data.title || "";
    const subtitle = data.subtitle || null;

    // Your backend returns *_path and *_url fields (as in your screenshot)
    const topHeroRaw = pickFirst(
        data.hero_image_url,
        data.hero_image_path,
        data.hover_banner_url,
        data.hover_banner_path
    );

    const mainPortraitRaw = pickFirst(
        data.main_portrait_url,
        data.main_portrait_path,
        data.portrait_image_url,
        data.portrait_image_path
    );

    const footerBannerRaw = pickFirst(data.footer_banner_url, data.footer_banner_path);

    const topHero = toStorageUrl(topHeroRaw);
    const mainPortrait = toStorageUrl(mainPortraitRaw);
    const footerBanner = toStorageUrl(footerBannerRaw);

    const paragraphs: string[] = Array.isArray(data.paragraphs) ? data.paragraphs : [];
    const slider_images: any[] = Array.isArray(data.slider_images) ? data.slider_images : [];
    const gallery_images: any[] = Array.isArray(data.gallery_images) ? data.gallery_images : [];
    const embedded_news: any[] = Array.isArray(data.embedded_news) ? data.embedded_news : [];
    const other_banners: any[] = Array.isArray(data.other_banners) ? data.other_banners : [];

    return (
        <>
            <TopNav />

            <main className="mx-auto max-w-6xl px-6 py-10 text-white">
                {/* HERO */}
                {topHero ? (
                    <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10">
                        <div
                            className="h-[40vh] min-h-[260px] w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${topHero})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
                            {subtitle ? <p className="mt-2 text-white/75">{subtitle}</p> : null}
                        </div>
                    </section>
                ) : (
                    <section className="mb-10">
                        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
                        {subtitle ? <p className="mt-2 text-white/75">{subtitle}</p> : null}
                    </section>
                )}

                {/* MAIN PORTRAIT + PARAGRAPHS */}
                <section className="grid gap-8 lg:grid-cols-[340px,1fr]">
                    {mainPortrait ? (
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={mainPortrait} alt={title || "Portrait"} className="h-auto w-full object-cover" />
                        </div>
                    ) : null}

                    <div className="space-y-4">
                        {paragraphs.map((p, idx) => (
                            <p key={idx} className="leading-relaxed text-white/80">
                                {p}
                            </p>
                        ))}
                    </div>
                </section>

                {/* SLIDER */}
                {slider_images.length > 0 ? (
                    <section className="mt-12">
                        <h2 className="mb-4 text-lg font-bold text-white/90">Highlights</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {slider_images.map((s, idx) => {
                                const img = toStorageUrl(pickFirst(s?.url, s?.path, s?.image_url));
                                return (
                                    <div key={idx} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                        {img ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={img} alt={s?.alt || ""} className="h-52 w-full object-cover" />
                                        ) : (
                                            <div className="h-52 w-full bg-gradient-to-br from-white/10 to-white/5" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ) : null}

                {/* GALLERY */}
                {gallery_images.length > 0 ? (
                    <section className="mt-12">
                        <h2 className="mb-4 text-lg font-bold text-white/90">Gallery</h2>
                        <div className="grid auto-rows-[140px] grid-cols-2 gap-4 sm:grid-cols-3">
                            {gallery_images.map((g, idx) => {
                                const img = toStorageUrl(pickFirst(g?.url, g?.path, g?.image_url));
                                return (
                                    <div key={idx} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                        {img ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={img} alt={g?.alt || ""} className="h-full w-full object-cover" loading="lazy" />
                                        ) : (
                                            <div className="h-full w-full bg-gradient-to-br from-white/10 to-white/5" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ) : null}

                {/* NEWS */}
                {embedded_news.length > 0 ? (
                    <section className="mt-12">
                        <h2 className="mb-4 text-lg font-bold text-white/90">News</h2>
                        <div className="space-y-4">
                            {embedded_news.map((n, idx) => (
                                <div key={idx} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                    {n?.title ? <div className="text-sm font-semibold text-white/90">{n.title}</div> : null}
                                    {n?.url ? (
                                        <a href={n.url} target="_blank" rel="noreferrer" className="mt-2 block text-sm text-white/70 underline">
                                            {n.url}
                                        </a>
                                    ) : null}
                                    {n?.embed_html ? (
                                        <div
                                            className="mt-4 overflow-hidden rounded-2xl border border-white/10"
                                            dangerouslySetInnerHTML={{ __html: n.embed_html }}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null}

                {/* OTHER BANNERS */}
                {other_banners.length > 0 ? (
                    <section className="mt-12">
                        <h2 className="mb-4 text-lg font-bold text-white/90">More</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {other_banners.map((b, idx) => {
                                const img = toStorageUrl(pickFirst(b?.image_url, b?.path, b?.url));
                                const link = b?.link || null;

                                const content = (
                                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                        {img ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={img} alt={b?.label || ""} className="h-40 w-full object-cover" loading="lazy" />
                                        ) : (
                                            <div className="h-40 w-full bg-gradient-to-br from-white/10 to-white/5" />
                                        )}
                                        {(b?.label || link) && (
                                            <div className="p-4">
                                                {b?.label ? <div className="text-sm font-semibold text-white/90">{b.label}</div> : null}
                                                {link ? <div className="mt-1 text-xs text-white/60">{link}</div> : null}
                                            </div>
                                        )}
                                    </div>
                                );

                                return link ? (
                                    <a key={idx} href={link} target="_blank" rel="noreferrer">
                                        {content}
                                    </a>
                                ) : (
                                    <div key={idx}>{content}</div>
                                );
                            })}
                        </div>
                    </section>
                ) : null}

                {/* FOOTER BANNER */}
                {footerBanner ? (
                    <section className="mt-12 overflow-hidden rounded-3xl border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={footerBanner} alt="Footer banner" className="h-auto w-full object-cover" />
                    </section>
                ) : null}
            </main>

            <Footer />
        </>
    );
}
