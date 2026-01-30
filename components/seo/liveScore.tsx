import type { Metadata } from "next";

// ============================================
// OPTIMIZED FOR "8jjcricket live score" RANKING
// Targets: live score searches + brand queries
// ============================================

export const liveScoreMetadata: Metadata = {
  // ✅ FIXED: Brand first + target keyword
  title: "8jjcricket - Live Cricket Scores & Ball-by-Ball Commentary Today",

  // ✅ IMPROVED: More keyword-rich, includes brand mention
  description:
    "Get real-time cricket scores at 8jjcricket - fastest live updates for IPL 2026, Team India, international matches. Ball-by-ball commentary, full scorecards, and instant match results.",

  // ✅ UPDATED: Brand keyword first, more specific long-tail
  keywords: [
    "8jjcricket live score",
    "live cricket score today",
    "cricket live score",
    "livescore",
    "IPL",
    "u19 world cup live score",
    "IPL 2026 live score",
    "India vs Australia live score",
    "ball by ball commentary",
    "cricket scorecard live",
    "T20 World Cup 2026 live",
    "Asia Cup live score",
    "live cricket match today",
  ],

  openGraph: {
    // ✅ FIXED: Brand consistency + keyword optimization
    title: "8jjcricket - Live Cricket Scores & Ball-by-Ball Updates",
    description:
      "Real-time cricket scores, ball-by-ball commentary, and instant match updates. Follow IPL 2026, Team India, and international cricket live at 8jjcricket.",
    url: "https://8jjcricket.com/livescore",
    siteName: "8jjcricket", // ✅ Exact match, no space
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://8jjcricket.com/og-livescore.jpg",
        width: 1200,
        height: 630,
        alt: "8jjcricket Live Cricket Scoreboard - Real-time Updates",
      },
    ],
  },

  alternates: {
    canonical: "https://8jjcricket.com/livescore",
  },

  // ✅ ADDED: Twitter card for better social sharing
  twitter: {
    card: "summary_large_image",
    title: "8jjcricket - Live Cricket Scores Today",
    description:
      "Fastest live cricket scores, ball-by-ball commentary for IPL 2026, Team India & international matches.",
    images: ["https://8jjcricket.com/og-livescore.jpg"],
    site: "@8jjcricket",
  },

  // ✅ ADDED: Robot directives
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
};

// ============================================
// OPTIMIZED SCHEMA MARKUP (JSON-LD)
// Enhanced for live sports content
// ============================================

export const liveScoreJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Live Cricket Scores | 8jjcricket", // ✅ ADDED: Brand mention
  description:
    "Real-time cricket match scores, ball-by-ball commentary, fixtures, and live updates for IPL 2026, Team India, and international cricket at 8jjcricket.",
  url: "https://8jjcricket.com/livescore",
  inLanguage: "en-IN", // ✅ ADDED
  isPartOf: {
    // ✅ ADDED: Link to parent website
    "@type": "WebSite",
    "@id": "https://8jjcricket.com/#website",
    name: "8jjcricket",
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://8jjcricket.com/#organization", // ✅ ADDED: Reference to org
    name: "8jjcricket", // ✅ FIXED: Consistent brand name
    url: "https://8jjcricket.com",
    logo: {
      "@type": "ImageObject",
      url: "https://8jjcricket.com/logo.png",
      width: 112,
      height: 112,
    },
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Live Cricket Matches", // ✅ IMPROVED: More descriptive
    description:
      "Currently ongoing and upcoming cricket matches with live scores", // ✅ ADDED
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Live International Matches",
        description: "Test, ODI, and T20I matches between national teams", // ✅ ADDED
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Live League Matches - IPL 2026, PSL, BBL",
        description: "Domestic T20 leagues including Indian Premier League", // ✅ ADDED
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Domestic Cricket Scores - Ranji Trophy, Vijay Hazare",
        description: "First-class and List A cricket from around the world", // ✅ ADDED
      },
    ],
  },
  // ✅ ADDED: Breadcrumb for better navigation
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "8jjcricket",
        item: "https://8jjcricket.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Live Scores",
        item: "https://8jjcricket.com/livescore",
      },
    ],
  },
};
