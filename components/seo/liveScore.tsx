import type { Metadata } from "next";

// 1. The Metadata Object
export const liveScoreMetadata: Metadata = {
  title: "Live Cricket Scores, Ball-by-Ball Commentary & Updates | 8JJ Cricket",
  description:
    "Get the fastest live cricket scores for IPL 2026, Team India, and international matches. Real-time ball-by-ball commentary, full scorecards, and match fixtures.",
  keywords: [
    "Live cricket score",
    "IPL live score",
    "India vs Australia live",
    "fastest cricket score app",
    "ball by ball commentary",
    "cricket scorecard",
    "8jj cricket live",
  ],
  openGraph: {
    title: "Fastest Live Cricket Scores & Commentary",
    description:
      "Track every ball, every wicket, and every boundary in real-time. The fastest scorecard for India and world cricket.",
    url: "https://8jjcricket.com/livescore",
    siteName: "8JJ Cricket",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://8jjcricket.com/og-livescore.jpg", // Make sure this image exists
        width: 1200,
        height: 630,
        alt: "8JJ Cricket Live Scoreboard",
      },
    ],
  },
  alternates: {
    canonical: "https://8jjcricket.com/livescore",
  },
};

// 2. The Schema Markup (JSON-LD)
export const liveScoreJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Live Cricket Scores",
  description:
    "Real-time cricket match results, fixtures, and ball-by-ball commentary.",
  url: "https://8jjcricket.com/livescore",
  publisher: {
    "@type": "Organization",
    name: "8JJ Cricket",
    logo: {
      "@type": "ImageObject",
      url: "https://8jjcricket.com/logo.png",
    },
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Live International Matches" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Live League Matches (IPL, PSL)",
      },
      { "@type": "ListItem", position: 3, name: "Domestic Cricket Scores" },
    ],
  },
};
