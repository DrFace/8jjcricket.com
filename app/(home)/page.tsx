// // app/(home)/page.tsx
// import Link from "next/link";
// import dynamic from "next/dynamic";
// import BannerCarousel from "@/components/BannerCarousel";
// import NewsCarousel from "@/components/NewsCarousel";
// import TopNav from "@/components/TopNav";
// import Footer from "@/components/Footer";

// type Article = {
//     id: number;
//     title: string;
//     slug: string;
//     excerpt: string | null;
//     image_url: string | null;
//     published_at: string | null;
// };

// const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";
// const SITE_ORIGIN =
//     process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

// function normalizeImageUrl(url: string | null): string | null {
//     if (!url) return null;

//     try {
//         const u = new URL(url, SITE_ORIGIN);
//         let pathname = u.pathname;

//         if (!pathname.startsWith("/storage/")) {
//             pathname = `/storage/${pathname.replace(/^\/+/, "")}`;
//         }

//         return `${SITE_ORIGIN}${pathname}${u.search}`;
//     } catch {
//         return `${SITE_ORIGIN}/storage/${String(url).replace(/^\/+/, "")}`;
//     }
// }

// async function getNewsPreview(): Promise<Article[]> {
//     const base = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;
//     const url = `${base.replace(/\/+$/, "")}/news`;

//     try {
//         const res = await fetch(url, { cache: "no-store" });
//         if (!res.ok) return [];
//         const json = await res.json();
//         const all = (json.data || []) as Article[];
//         return all.slice(0, 5);
//     } catch {
//         return [];
//     }
// }

// const latest = [
//     {
//         slug: "cricket-legends",
//         title: "Cricket Legends",
//         desc: "Career mode with levels & characters.",
//     },
//     {
//         slug: "cricket-superover",
//         title: "Cricket Super Over",
//         desc: "6 balls, pure timing — hit for 6s!",
//     },
//     { slug: "tictactoe", title: "Tic Tac Toe", desc: "Classic 3×3 duel." },
//     { slug: "flappysquare", title: "Flappy Square", desc: "Click to fly!" },
// ];

// const AnimatedText = dynamic(() => import("@/components/AnimatedText"), {
//     ssr: false,
// });

// const DOWNLOAD_URL = "https://download.9ipl.vip/normal/";

// const BRAND_ITEMS = [
//     "MB66",
//     "OK9",
//     "78win",
//     "QQ88",
//     "F168",
//     "FLY88",
//     "CM88",
//     "OK8386",
//     "SC88",
//     "C168",
//     "iP88",
// ];

// export default async function HomePage() {
//     const news = await getNewsPreview();

//     const newsWithImages = news
//         .map((a) => ({
//             id: a.id,
//             slug: a.slug,
//             title: a.title,
//             imgSrc: normalizeImageUrl(a.image_url),
//             published_at: a.published_at,
//         }))
//         .filter((a) => a.imgSrc) as {
//             id: number;
//             slug: string;
//             title: string;
//             imgSrc: string;
//             published_at: string | null;
//         }[];

//     return (
//         <>
//             {/* Top bar + header moved OUT of layout and into Home */}
//             <TopNav />

//             {/* IMPORTANT:
//           - NO h-screen here
//           - NO overflow-y-auto / overflow-y-scroll here
//           - Let the document scroll (prevents 2 scrollbars)
//       */}
//             <main className="w-full snap-y snap-proximity scroll-smooth">
//                 {/* SECTION 1 – Hero video */}
//                 <section className="relative w-full h-screen snap-start overflow-hidden">
//                     <video
//                         src="/homevideo.mp4"
//                         autoPlay
//                         loop
//                         muted
//                         playsInline
//                         className="absolute inset-0 w-full h-full object-cover"
//                     />

//                     <div className="absolute inset-0 bg-black/60" />

//                     <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center px-6 pb-32">
//                         <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-300">
//                             Live Cricket &amp; Minigames
//                         </p>

//                         <h1 className="mt-4 max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
//                             Real-time cricket, fast odds and instant minigames – all in one
//                             place.
//                         </h1>

//                         <p className="mt-4 max-w-xl text-sm sm:text-base text-sky-100/80">
//                             Watch, play and win with 8jjcricket — smooth experience and
//                             lightning-fast updates.
//                         </p>

//                         <div className="mt-6 flex gap-4 flex-wrap justify-center">
//                             <Link
//                                 href="/minigames"
//                                 className="rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-orange-500 px-6 py-2 font-semibold text-black shadow-lg hover:brightness-110 active:scale-95"
//                             >
//                                 Play Now
//                             </Link>

//                             <a
//                                 href={DOWNLOAD_URL}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="rounded-full border border-white/30 bg-black/60 px-6 py-2 font-semibold text-sky-100 backdrop-blur hover:border-amber-300 hover:text-amber-300"
//                             >
//                                 Download App
//                             </a>
//                         </div>
//                     </div>

//                     {/* Brand bar */}
//                     <div className="pointer-events-auto absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
//                         <div className="inline-flex min-w-0 max-w-full items-center justify-center gap-2 overflow-x-auto rounded-full border border-white/20 bg-black/70 px-3 py-2 backdrop-blur-xl shadow-2xl">
//                             {BRAND_ITEMS.map((name) => (
//                                 <a
//                                     key={name}
//                                     href={DOWNLOAD_URL}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="whitespace-nowrap rounded-full bg-slate-200/90 px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-900 shadow-md hover:bg-white transition"
//                                 >
//                                     {name}
//                                 </a>
//                             ))}
//                         </div>
//                     </div>
//                 </section>

//                 {/* SECTION 2 – Animated strip + banner + hot minigames */}
//                 <section className="w-full h-screen snap-start flex items-center px-6">
//                     <div className="w-full">
//                         <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-center shadow-xl backdrop-blur-xl mb-8">
//                             <div className="flex justify-center">
//                                 <AnimatedText />
//                             </div>
//                             <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-100/80">
//                                 Live cricket · Fast odds · Instant minigames
//                             </p>
//                         </div>

//                         <div className="grid w-full gap-6 md:grid-cols-[2fr,1.1fr]">
//                             <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-2xl backdrop-blur-xl">
//                                 <BannerCarousel />
//                             </div>

//                             <div className="flex flex-col gap-6">
//                                 <div className="rounded-2xl border border-amber-400/60 bg-gradient-to-br from-black/70 via-slate-900/80 to-amber-900/40 p-4 shadow-2xl backdrop-blur-xl">
//                                     <div className="mb-2 flex items-center justify-between">
//                                         <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-200">
//                                             Hot Minigames
//                                         </h2>
//                                         <Link
//                                             href="/minigames"
//                                             className="text-[11px] font-semibold text-amber-300 hover:text-amber-200"
//                                         >
//                                             View all →
//                                         </Link>
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-3">
//                                         {latest.slice(0, 2).map((g) => (
//                                             <Link
//                                                 key={g.slug}
//                                                 href={`/minigames/${g.slug}`}
//                                                 className="group rounded-xl border border-white/15 bg-white/5 p-3 text-xs text-white shadow transition hover:border-amber-300/70 hover:bg-white/10"
//                                             >
//                                                 <p className="line-clamp-1 text-[11px] font-semibold text-amber-200">
//                                                     {g.title}
//                                                 </p>
//                                                 <p className="mt-1 text-[11px] text-sky-100/80">
//                                                     {g.desc}
//                                                 </p>
//                                             </Link>
//                                         ))}
//                                     </div>

//                                     <Link
//                                         href="/minigames"
//                                         className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black shadow-lg shadow-amber-500/40 hover:brightness-110 active:scale-95"
//                                     >
//                                         Play Minigames Now
//                                     </Link>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* SECTION 3 – Minigames quick play */}
//                 <section className="w-full h-screen snap-start flex items-center px-6">
//                     <div className="w-full rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
//                         <div className="mb-3 flex items-center justify-between">
//                             <h2 className="text-xs font-semibold uppercase tracking-wide text-sky-100 sm:text-sm">
//                                 Minigames • Quick Play
//                             </h2>
//                             <Link
//                                 href="/minigames"
//                                 className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 sm:text-xs"
//                             >
//                                 View all →
//                             </Link>
//                         </div>

//                         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
//                             {latest.map((g) => (
//                                 <Link
//                                     key={g.slug}
//                                     href={`/minigames/${g.slug}`}
//                                     className="group flex flex-col items-center justify-center rounded-xl border border-white/15 bg-white/5 p-4 text-white shadow-lg transition hover:border-amber-300/70 hover:bg-white/10"
//                                 >
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 bg-black/50 text-[10px] font-semibold uppercase tracking-wide shadow-sm transition group-hover:scale-105 group-hover:border-amber-300 group-hover:text-amber-300">
//                                         {g.title
//                                             .split(" ")
//                                             .map((w) => w[0])
//                                             .join("")}
//                                     </div>
//                                     <p className="mt-2 text-center text-[12px] font-semibold">
//                                         {g.title}
//                                     </p>
//                                     <p className="mt-1 text-center text-[11px] text-sky-100/80">
//                                         {g.desc}
//                                     </p>
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>
//                 </section>

//                 {/* SECTION 4 – Featured promos carousel */}
//                 {newsWithImages.length > 0 && (
//                     <section className="w-full h-screen snap-start flex items-center px-6">
//                         <div className="w-full rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
//                             <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sky-100 sm:text-sm">
//                                 Featured Promotions
//                             </h2>
//                             <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
//                                 <NewsCarousel
//                                     items={newsWithImages.map((a) => ({
//                                         id: a.id,
//                                         slug: a.slug,
//                                         title: a.title,
//                                         imgSrc: a.imgSrc,
//                                     }))}
//                                     intervalMs={4000}
//                                 />
//                             </div>
//                         </div>
//                     </section>
//                 )}

//                 {/* SECTION 5 – Latest news list */}
//                 {news.length > 0 && (
//                     <section className="w-full h-screen snap-start flex items-center px-6">
//                         <div className="w-full rounded-2xl border border-white/15 bg-slate-900/80 p-5 text-white shadow-2xl backdrop-blur-2xl">
//                             <div className="mb-4 flex items-center justify-between">
//                                 <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-100 sm:text-base">
//                                     Latest Promotions &amp; News
//                                 </h2>
//                                 <Link
//                                     href="/news"
//                                     className="text-xs font-semibold text-amber-300 hover:text-amber-200 sm:text-sm"
//                                 >
//                                     View all →
//                                 </Link>
//                             </div>

//                             <div className="space-y-4">
//                                 {news
//                                     .slice(0, 5)
//                                     .map((a) => ({ ...a, imgSrc: normalizeImageUrl(a.image_url) }))
//                                     .map((a) => (
//                                         <Link
//                                             key={a.id}
//                                             href={`/news/${a.slug}`}
//                                             className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 text-white transition hover:border-amber-300/70 hover:bg-black/60"
//                                         >
//                                             {a.imgSrc && (
//                                                 <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32">
//                                                     <img
//                                                         src={a.imgSrc}
//                                                         alt={a.title}
//                                                         className="h-full w-full object-cover"
//                                                     />
//                                                 </div>
//                                             )}

//                                             <div className="flex flex-1 items-center justify-between gap-4">
//                                                 <p className="line-clamp-2 text-sm font-semibold sm:text-base">
//                                                     {a.title}
//                                                 </p>

//                                                 {a.published_at && (
//                                                     <span className="whitespace-nowrap text-xs text-sky-100/80 sm:text-sm">
//                                                         {new Date(a.published_at).toLocaleDateString(
//                                                             undefined,
//                                                             { year: "numeric", month: "2-digit", day: "2-digit" }
//                                                         )}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         </Link>
//                                     ))}
//                             </div>
//                         </div>
//                     </section>
//                 )}

//                 {/* Footer at the end (normal flow, not a snap section) */}
//                 <Footer />
//             </main>
//         </>
//     );
// }
