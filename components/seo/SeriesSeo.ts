import type { Metadata } from "next";

// 1. The Metadata Object
export const seriesMetadata: Metadata = {
  title: "Cricket Series Schedule 2026 | Upcoming Tournaments & Fixtures | 8JJ Cricket",
  description: "Get the full schedule of upcoming cricket series, T20 leagues, and international tournaments. Follow Team India, IPL, and World Cup fixtures on 8JJ Cricket.",
  keywords: [
    "Cricket Series Schedule",
    "Upcoming Cricket Tournaments",
    "India Cricket Schedule",
    "IPL Schedule",
    "T20 World Cup Fixtures",
    "Live Cricket Series"
  ],
  openGraph: {
    title: "Upcoming Cricket Series & Tournament Schedule",
    description: "Track every series. From International Test matches to T20 Leagues (IPL, PSL, BBL).",
    url: "https://8jjcricket.com/series",
    siteName: "8JJ Cricket",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://8jjcricket.com/og-series.jpg", // Ensure this image exists
        width: 1200,
        height: 630,
        alt: "8JJ Cricket Series Schedule",
      },
    ],
  },
  alternates: {
    canonical: "https://8jjcricket.com/series",
  },
};

// 2. The Schema Markup (JSON-LD)
export const seriesJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Cricket Series & Tournaments",
  "description": "A comprehensive list of ongoing and upcoming international and domestic cricket series.",
  "url": "https://8jjcricket.com/series",
  "publisher": {
    "@type": "Organization",
    "name": "8JJ Cricket",
    "logo": {
      "@type": "ImageObject",
      "url": "https://8jjcricket.com/logo.png"
    }
  },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "International Tours (India, Australia, England)"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "T20 Leagues (IPL, PSL, BBL)"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "ICC Tournaments"
      }
    ]
  }
};