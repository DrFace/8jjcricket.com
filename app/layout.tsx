import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import NewsTicker from "@/components/NewsTicker";

/**
 * Root layout for the 8jjcricket site. This version removes unintended
 * vertical scroll by:
 * - Making the top promo bar non-sticky
 * - Making the main header sticky at top: 0
 * - Constraining background gradient overflow
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
      <body className="min-h-screen flex flex-col bg-gray-50 selection:bg-blue-100 selection:text-blue-800">
        {/* Top promo bar (non-sticky now) */}
        <div className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white">
          <div className="container flex items-center gap-4 py-2 text-sm">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-semibold tracking-wide">Latest News</span>
            </div>

            <div className="flex-1">
              <NewsTicker />
            </div>

            {/* scrolling news titles – right to left */}
          </div>
        </div>

        {/* Main header (sticky at the very top of viewport) */}
        <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur-md shadow-sm transition-shadow duration-300">
          <div className="container flex items-center justify-between py-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl hover:scale-[1.03] transition-transform duration-200"
            >
              <Image
                src="/8jjlogo.png"
                alt="8jjcricket logo"
                width={44}
                height={44}
                className="object-contain drop-shadow-sm"
                priority
              />
              <span className="text-gray-800">8jjcricket</span>
            </Link>

            <nav className="hidden md:flex gap-6 text-[15px] font-semibold text-gray-700">
              {/* Regular links */}
              <Link
                href="/"
                className="relative group transition-all duration-200 hover:text-blue-600 hover:scale-105"
              >
                Home
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/archive"
                className="relative group transition-all duration-200 hover:text-blue-600 hover:scale-105"
              >
                Archive
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/series"
                className="relative group transition-all duration-200 hover:text-blue-600 hover:scale-105"
              >
                Series
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/players"
                className="relative group transition-all duration-200 hover:text-blue-600 hover:scale-105"
              >
                Players
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/minigames"
                className="relative group transition-all duration-200 hover:text-blue-600 hover:scale-105"
              >
                Minigames
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/news"
                className="relative group transition-all duration-200 hover:text-blue-600 hover:scale-105"
              >
                News
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Dropdown for team rankings */}
              <div className="relative group">
                <Link
                  href="/rankings/t20i"
                  className="relative transition-all duration-200 hover:text-blue-600 hover:scale-105"
                >
                  Team Rankings
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                </Link>

                {/* show menu on hover or focus within the group */}
                <div className="absolute left-0 top-full z-40 mt-2 hidden min-w-[8rem] rounded-md border bg-white py-1 text-sm shadow-lg group-hover:block group-focus-within:block">
                  <Link
                    href="/rankings/t20i"
                    className="block px-4 py-2 whitespace-nowrap hover:bg-gray-50"
                  >
                    T20I
                  </Link>
                  <Link
                    href="/rankings/odi"
                    className="block px-4 py-2 whitespace-nowrap hover:bg-gray-50"
                  >
                    ODI
                  </Link>
                  <Link
                    href="/rankings/test"
                    className="block px-4 py-2 whitespace-nowrap hover:bg-gray-50"
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
                className="inline-flex items-center gap-2 rounded-full
             bg-gradient-to-r from-[#4A63D5] via-[#5E78E0] to-[#3F55C2]
             px-4 py-2 text-sm font-semibold text-white shadow-lg
             shadow-blue-600/40 ring-1 ring-white/20 transition
             active:scale-95 hover:brightness-110"
              >
                <span className="relative">
                  <span
                    className="absolute inset-0 -z-10 animate-[ping_2s_linear_infinite]
                 rounded-full bg-[#6F87E8]/40"
                  />
                  Play Now
                </span>
              </Link>


            </div>
          </div>
        </header>

        {/* Gradient ambience (subtle, behind content) */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200 blur-3xl opacity-40" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-200 blur-3xl opacity-40" />
        </div>

        {/* main page content */}
        <main className="container py-6 flex-grow">
          {/* Callouts row intentionally omitted for clarity */}
          {children}
        </main>

        {/* Sticky bottom action bar (mobile focus) */}
        <div className="sticky bottom-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 md:hidden">
          <div className="container grid grid-cols-3 items-center py-2 text-center text-xs">
            <Link href="/recent" className="flex flex-col items-center gap-1">
              <span></span>
              <span className="font-medium">Recent</span>
            </Link>
            <Link href="/minigames" className="-mt-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/30 ring-2 ring-white/60">
                Play
              </span>
            </Link>
            <Link
              href="/upcoming"
              className="flex flex-col items-center gap-1"
            >
              <span>⏰</span>
              <span className="font-medium">Upcoming</span>
            </Link>
          </div>
        </div>

        {/* footer */}
        <footer className="border-t bg-white py-10">
          <div className="container grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Image
                  src="/8jjlogo.png"
                  alt="8jjcricket"
                  width={32}
                  height={32}
                />
                <span className="font-semibold">8jjcricket</span>
              </div>
              <p className="text-sm text-gray-500">
                Live cricket, instant odds and fast minigames. Play
                responsibly.
              </p>
            </div>
            <div className="text-sm">
              <p className="mb-2 font-semibold">Quick Links</p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/players"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Players
                </Link>
                <Link
                  href="/minigames"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Minigames
                </Link>
                <Link
                  href="/recent"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Recent
                </Link>
                <Link
                  href="/upcoming"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Upcoming
                </Link>
                {/* Added links for new pages */}
                <Link
                  href="/teams"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Teams
                </Link>
                <Link
                  href="/rankings"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Rankings
                </Link>
                <Link
                  href="/series"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Series
                </Link>
                <Link
                  href="/archive"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Archive
                </Link>
              </div>
            </div>
            <div className="text-sm">
              <p className="mb-2 font-semibold">Trust &amp; Safety</p>
              <ul className="space-y-1 text-gray-500">
                <li>Play responsibly</li>
                <li>Support: support@8jjcricket.com</li>
              </ul>
            </div>
          </div>
          <p className="container mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} 8jjcricket. All rights reserved.
          </p>
        </footer>

        {/* Floating FAB on desktop */}
        <div className="pointer-events-none fixed bottom-6 right-6 hidden md:block">
          <Link
            href="/minigames"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/20 ring-1 ring-white/30 hover:brightness-110 active:scale-95"
          >
            <span className="i-lucide-rocket" aria-hidden></span>
            Quick Play
          </Link>
        </div>

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
