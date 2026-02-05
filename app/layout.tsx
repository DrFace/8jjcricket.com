// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/seo";
import Script from "next/script";

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

  // ✅ Necessary for link previews on X/Twitter and some crawlers
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: ["/og.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    // ✅ Optional, but safe and common
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // ✅ Add manifest (new)
  manifest: "/site.webmanifest",

  // ✅ Use your new favicon set (replace the old 8jjlogo.png icons)
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden bg-gray-950 text-gray-50 antialiased selection:bg-blue-100 selection:text-blue-800">
        {children}

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
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="UpHEbr/a/JxSmmqvOPM52g"
          async
        ></script>
        {/* Google Translate */}
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'hi,bn,ur,pa,ta,te,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              }, 'google_translate_element');
            }
          `}
        </Script>
      </body>
    </html>
  );
}
