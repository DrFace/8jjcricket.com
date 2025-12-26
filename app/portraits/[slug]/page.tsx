// app/portraits/[slug]/page.tsx
import Header from "@/components/TopNav";
import Footer from "@/components/Footer";
import TopNav from "@/components/TopNav";

const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";

function apiBase() {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE).replace(/\/+$/, "");
}

async function fetchPortraitPage(slug: string) {
    const url = `${apiBase()}/portraits/${encodeURIComponent(slug)}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) return null;
    return res.json();
}

export default async function PortraitDetailsPage({
    params,
}: {
    params: { slug: string };
}) {
    const data = await fetchPortraitPage(params.slug);

    if (!data) {
        return (
            <>
                <Header />
                <main className="mx-auto max-w-6xl px-6 py-16">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/70">
                        Portrait page not found or not published.
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const {
        title,
        subtitle,
        hero_image,
        portrait_image,
        main_portrait_image,
        hover_banner,
        paragraphs = [],
        slider_images = [],
        gallery_images = [],
        embedded_news = [],
        footer_banner,
        other_banners = [],
    } = data;

    const topHero = hero_image || hover_banner || null;
    const mainPortrait = main_portrait_image || portrait_image || null;

    return (
        <>
            <TopNav />

            <main className="mx-auto max-w-6xl px-6 py-10 text-white">
                {/* HERO */}
                {topHero && (
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
                )}

                {/* HEADER (if no hero) */}
                {!topHero && (
                    <section className="mb-10">
                        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
                        {subtitle ? <p className="mt-2 text-white/75">{subtitle}</p> : null}
                    </section>
                )}

                {/* MAIN PORTRAIT + PARAGRAPHS */}
                <section className="grid gap-8 lg:grid-cols-[340px,1fr]">
                    {mainPortrait && (
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                            <img
                                src={mainPortrait}
                                alt={title || "Portrait"}
                                className="h-auto w-full object-cover"
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        {paragraphs.map((p: string, idx: number) => (
                            <p key={idx} className="leading-relaxed text-white/80">
                                {p}
                            </p>
                        ))}
                    </div>
                </section>

                {/* SLIDER IMAGES */}
                {slider_images?.length > 0 && (
                    <section className="mt-12">
                        <h2 className="mb-4 text-lg font-bold text-white/90">Highlights</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {slider_images.map((s: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={s.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                                >
                                    <img
                                        src={s.url}
                                        alt={s.alt || ""}
                                        className="h-52 w-full object-cover transition group-hover:scale-[1.02]"
                                        loading="lazy"
                                    />
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* GALLERY IMAGES */}
                {gallery_images?.length > 0 && (
                    <section className="mt-12">
                        <h2 className="mb-4 text-lg font-bold text-white/90">Gallery</h2>
                        <div className="grid auto-rows-[140px] grid-cols-2 gap-4 sm:grid-cols-3">
                            {gallery_images.map((g: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={g.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                                >
                                    <img
                                        src={g.url}
                                        alt={g.alt || ""}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* EMBEDDED NEWS */}
                {embedded_news?.length > 0 && (
                    <section className="mt-12">
                        <h2 className="mb-4 text-lg font-bold text-white/90">News</h2>
                        <div className="space-y-4">
                            {embedded_news.map((n: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="rounded-3xl border border-white/10 bg-white/5 p-5"
                                >
                                    {n.title ? (
                                        <div className="text-sm font-semibold text-white/90">{n.title}</div>
                                    ) : null}

                                    {n.url ? (
                                        <a
                                            href={n.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 block text-sm text-white/70 underline decoration-white/30 underline-offset-4 hover:text-white"
                                        >
                                            {n.url}
                                        </a>
                                    ) : null}

                                    {n.embed_html ? (
                                        <div
                                            className="mt-4 overflow-hidden rounded-2xl border border-white/10"
                                            dangerouslySetInnerHTML={{ __html: n.embed_html }}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* OTHER BANNERS */}
                {other_banners?.length > 0 && (
                    <section className="mt-12">
                        <h2 className="mb-4 text-lg font-bold text-white/90">More</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {other_banners.map((b: any, idx: number) => {
                                const content = (
                                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                        <img
                                            src={b.image_url}
                                            alt={b.label || ""}
                                            className="h-40 w-full object-cover"
                                            loading="lazy"
                                        />
                                        {(b.label || b.link) && (
                                            <div className="p-4">
                                                {b.label ? (
                                                    <div className="text-sm font-semibold text-white/90">{b.label}</div>
                                                ) : null}
                                                {b.link ? <div className="mt-1 text-xs text-white/60">{b.link}</div> : null}
                                            </div>
                                        )}
                                    </div>
                                );

                                return b.link ? (
                                    <a key={idx} href={b.link} target="_blank" rel="noreferrer">
                                        {content}
                                    </a>
                                ) : (
                                    <div key={idx}>{content}</div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* FOOTER BANNER */}
                {footer_banner && (
                    <section className="mt-12 overflow-hidden rounded-3xl border border-white/10">
                        <img src={footer_banner} alt="Footer banner" className="h-auto w-full object-cover" />
                    </section>
                )}
            </main>

            <Footer />
        </>
    );
}
