// components/seo/home-data.ts
import type { Metadata } from "next";

// ============================================
// OPTIMIZED FOR RANKING "8jjcricket" #1
// Brand-first strategy for maximum SEO impact
// ============================================

export const homeMetadata: Metadata = {
  // ✅ FIXED: Brand first, exact match to domain
  title: "8jjcricket - Live Cricket Scores, News & IPL 2026 Updates",

  // ✅ IMPROVED: More keyword-rich, natural flow
  description:
    "Get real-time cricket scores, ball-by-ball commentary, latest news, IPL 2026 schedule, and player rankings at 8jjcricket. India's fastest cricket platform for Team India, Asia Cup, and international matches.",

  // ✅ UPDATED: Brand keyword first, removed generic terms
  keywords: [
    "8jjcricket",
    "live cricket scores",
    "cricket news India",
    "IPL 2026",
    "cricket live score today",
    "Asia Cup 2026",
    "Team India cricket",
    "cricket rankings",
    "8jj cricket",
    "ball-by-ball commentary",
    "international cricket scores",
  ],

  openGraph: {
    // ✅ FIXED: Brand consistency
    title: "8jjcricket - Live Cricket Scores & IPL 2026 News",
    description:
      "Real-time cricket scores, breaking news, and match updates for India and South Asia. Your trusted cricket companion since 2025.",
    url: "https://8jjcricket.com",
    siteName: "8jjcricket", // ✅ Exact match, no space
    images: [
      {
        url: "https://8jjcricket.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "8jjcricket - Live Cricket Scores and News Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  alternates: {
    canonical: "https://8jjcricket.com",
  },

  twitter: {
    card: "summary_large_image",
    title: "8jjcricket - Live Cricket Scores & IPL 2026",
    description:
      "Fastest live scores for Team India, IPL 2026, and international cricket. Real-time ball-by-ball updates.",
    images: ["https://8jjcricket.com/og-image.jpg"],
    site: "@8jjcricket", // ✅ Added Twitter handle
    creator: "@8jjcricket",
  },

  // ✅ ADDED: Robot directives for better crawling
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ✅ ADDED: Verification tags (optional - add if you have them)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },
};

// ============================================
// OPTIMIZED SCHEMA MARKUP (JSON-LD)
// Enhanced for entity recognition
// ============================================

export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://8jjcricket.com/#organization",
      name: "8jjcricket", // ✅ FIXED: Exact match to domain
      alternateName: ["8JJ Cricket", "8jj cricket"], // ✅ ADDED: Variations listed here
      url: "https://8jjcricket.com",
      logo: {
        "@type": "ImageObject",
        url: "https://8jjcricket.com/logo.png",
        width: 112,
        height: 112,
      },
      description:
        "Live cricket scores, news, match updates, and rankings for India and South Asia", // ✅ ADDED
      foundingDate: "2025", // ✅ ADDED: Establishes credibility
      areaServed: [
        { "@type": "Country", name: "India" },
        { "@type": "Country", name: "Sri Lanka" },
        { "@type": "Country", name: "Pakistan" },
        { "@type": "Country", name: "Bangladesh" },
      ],
      sameAs: [
        "https://facebook.com/8jjcricket",
        "https://twitter.com/8jjcricket",
        "https://instagram.com/8jjcricket",
      ],
      // ✅ ADDED: Contact point for entity verification
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        availableLanguage: ["English", "Hindi"],
        areaServed: "IN",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://8jjcricket.com/#website",
      url: "https://8jjcricket.com",
      name: "8jjcricket", // ✅ FIXED: Consistent naming
      description:
        "Live Cricket Scores, News, Rankings & Ball-by-Ball Commentary for India and South Asia", // ✅ IMPROVED
      publisher: { "@id": "https://8jjcricket.com/#organization" },
      inLanguage: "en-IN",
      // ✅ ADDED: Search action for Google Search Box feature
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://8jjcricket.com/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    // ✅ ADDED: WebPage schema for homepage
    {
      "@type": "WebPage",
      "@id": "https://8jjcricket.com/#webpage",
      url: "https://8jjcricket.com",
      name: "8jjcricket - Live Cricket Scores & News",
      isPartOf: { "@id": "https://8jjcricket.com/#website" },
      about: { "@id": "https://8jjcricket.com/#organization" },
      description:
        "Get real-time cricket scores, ball-by-ball commentary, latest news, IPL 2026 schedule, and player rankings for India and international cricket.",
      inLanguage: "en-IN",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://8jjcricket.com/og-image.jpg",
      },
    },
  ],
};
