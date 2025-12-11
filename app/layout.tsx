// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import NewsTicker from "@/components/NewsTicker";
import MobileBottomBar from "@/components/MobileBottomBar";

/**
 * Root layout for the 8jjcricket site.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – Live cricket & minigames`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col text-gray-50 selection:bg-blue-100 selection:text-blue-800">
        {/* Fullscreen wallpaper */}
        <div className="fixed inset-0 -z-20">
          <Image
            src="/banner002.png"
            alt="8jjcricket background"
            fill
            priority
            className="object-cover"
          />
          {/* Dark overlay so text is readable */}
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Top promo bar */}
        <div className="w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="container flex items-center gap-4 py-2 text-sm text-sky-100">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-semibold tracking-wide uppercase text-amber-300">
                Latest News
              </span>
            </div>

            <div className="flex-1">
              <NewsTicker />
            </div>
          </div>
        </div>

        {/* Main header */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl shadow-lg">
          <div className="container flex items-center justify-between py-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-white transition-transform duration-200 hover:scale-[1.03]"
            >
              <Image
                src="/8jjlogo.png"
                alt="8jjcricket logo"
                width={44}
                height={44}
                className="object-contain drop-shadow-sm"
                priority
              />
              <span>8jjcricket</span>
            </Link>

            <nav className="hidden gap-6 text-[15px] font-semibold text-sky-100/90 md:flex">
              <Link
                href="/"
                className="group relative transition-all duration-200 hover:scale-105 hover:text-amber-300"
              >
                Home
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-amber-300 to-yellow-400 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/archive"
                className="group relative transition-all duration-200 hover:scale-105 hover:text-amber-300"
              >
                Archive
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-amber-300 to-yellow-400 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/series"
                className="group relative transition-all duration-200 hover:scale-105 hover:text-amber-300"
              >
                Series
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-amber-300 to-yellow-400 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/players"
                className="group relative transition-all duration-200 hover:scale-105 hover:text-amber-300"
              >
                Players
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-amber-300 to-yellow-400 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/minigames"
                className="group relative transition-all duration-200 hover:scale-105 hover:text-amber-300"
              >
                Minigames
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-amber-300 to-yellow-400 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/news"
                className="group relative transition-all duration-200 hover:scale-105 hover:text-amber-300"
              >
                News
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-amber-300 to-yellow-400 transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Team rankings dropdown */}
              <div className="group relative">
                <Link
                  href="/rankings/t20i"
                  className="relative transition-all duration-200 hover:scale-105 hover:text-amber-300"
                >
                  Team Rankings
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-amber-300 to-yellow-400 transition-all duration-300 group-hover:w-full" />
                </Link>

                <div className="absolute left-0 top-full z-40 mt-2 hidden min-w-[8rem] rounded-md border border-white/10 bg-black/80 py-1 text-sm text-sky-100 shadow-2xl backdrop-blur-xl group-hover:block group-focus-within:block">
                  <Link
                    href="/rankings/t20i"
                    className="block whitespace-nowrap px-4 py-2 hover:bg-white/10"
                  >
                    T20I
                  </Link>
                  <Link
                    href="/rankings/odi"
                    className="block whitespace-nowrap px-4 py-2 hover:bg-white/10"
                  >
                    ODI
                  </Link>
                  <Link
                    href="/rankings/test"
                    className="block whitespace-nowrap px-4 py-2 hover:bg-white/10"
                  >
                    Test
                  </Link>
                </div>
              </div>
            </nav>

            {/* Primary actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/minigames"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FACC15] via-[#F97316] to-[#EA580C] px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-amber-500/40 ring-1 ring-white/20 transition hover:brightness-110 active:scale-95"
              >
                <span className="relative">
                  <span
                    className="absolute inset-0 -z-10 animate-[ping_2s_linear_infinite] rounded-full bg-amber-300/40"
                    aria-hidden
                  />
                  Play Now
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main page content – no extra big card here */}
        <main className="container py-6 flex-grow">{children}</main>

        {/* Mobile bottom bar */}
        <MobileBottomBar />

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/70 py-10 backdrop-blur-xl">
          <div className="container grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Image
                  src="/8jjlogo.png"
                  alt="8jjcricket"
                  width={32}
                  height={32}
                />
                <span className="font-semibold text-white">8jjcricket</span>
              </div>
              <p className="text-sm text-sky-100/80">
                Live cricket, instant odds and fast minigames. Play
                responsibly.
              </p>
            </div>
            <div className="text-sm text-sky-100/90">
              <p className="mb-2 font-semibold text-white">Quick Links</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/players" className="hover:text-amber-300">
                  Players
                </Link>
                <Link href="/minigames" className="hover:text-amber-300">
                  Minigames
                </Link>
                <Link href="/recent" className="hover:text-amber-300">
                  Recent
                </Link>
                <Link href="/upcoming" className="hover:text-amber-300">
                  Upcoming
                </Link>
                <Link href="/teams" className="hover:text-amber-300">
                  Teams
                </Link>
                <Link href="/rankings" className="hover:text-amber-300">
                  Rankings
                </Link>
                <Link href="/series" className="hover:text-amber-300">
                  Series
                </Link>
                <Link href="/archive" className="hover:text-amber-300">
                  Archive
                </Link>
              </div>
            </div>
            <div className="text-sm text-sky-100/80">
              <p className="mb-2 font-semibold text-white">
                Trust &amp; Safety
              </p>
              <ul className="space-y-1">
                <li>Play responsibly</li>
                <li>Support: support@8jjcricket.com</li>
              </ul>
            </div>
          </div>
          <p className="container mt-8 text-center text-xs text-sky-100/70">
            © {new Date().getFullYear()} 8jjcricket. All rights reserved.
          </p>
        </footer>

        {/* Floating FAB on desktop */}
        <div className="pointer-events-none fixed bottom-6 right-6 hidden md:block">
          <Link
            href="/minigames"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2 text-sm font-semibold text-black shadow-xl shadow-emerald-500/30 ring-1 ring-white/30 hover:brightness-110 active:scale-95"
          >
            <span aria-hidden className="i-lucide-rocket" />
            Quick Play
          </Link>
        </div>

        {/* Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FBJM2CQHHS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FBJM2CQHHS');
          `}
        </Script>
      </body>
    </html>
  );
}
