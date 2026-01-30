import type { Metadata } from "next";

// ============================================
// OPTIMIZED FOR "ICC rankings" + "cricket rankings" RANKING
// Targets: ranking searches + comparison queries + brand
// ============================================

export const rankingsMetadata: Metadata = {
  // ✅ FIXED: Brand first + comprehensive keywords
  title:
    "8jjcricket - ICC Cricket Rankings 2026 | Test, ODI & T20I Team Standings",

  // ✅ IMPROVED: More detailed, keyword-rich, includes brand + year
  description:
    "View official ICC cricket rankings 2026 at 8jjcricket - complete Test, ODI, and T20I team standings, player rankings, points tables, and rating changes. Updated after every international match.",

  // ✅ ADDED: Keywords array for ranking queries
  keywords: [
    "8jjcricket rankings",
    "ICC rankings 2026",
    "cricket team rankings",
    "Test cricket rankings",
    "ODI rankings",
    "T20I rankings",
    "India cricket ranking",
    "cricket world rankings",
    "ICC player rankings",
    "cricket rankings today",
  ],

  openGraph: {
    // ✅ FIXED: Brand consistency + year specificity
    title: "8jjcricket - ICC Cricket Rankings 2026 | Test, ODI & T20I",
    description:
      "Official ICC cricket team rankings and standings for Test, ODI, and T20I formats. Track India, Australia, England and all international teams at 8jjcricket.",
    url: "https://8jjcricket.com/rankings",
    siteName: "8jjcricket", // ✅ Exact match, no space
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://8jjcricket.com/og-rankings.jpg",
        width: 1200,
        height: 630,
        alt: "8jjcricket - ICC Cricket Team Rankings 2026 Table",
      },
    ],
  },

  alternates: {
    canonical: "https://8jjcricket.com/rankings",
  },

  // ✅ ADDED: Twitter card
  twitter: {
    card: "summary_large_image",
    title: "8jjcricket - ICC Cricket Rankings 2026",
    description:
      "Official Test, ODI & T20I team rankings. Track all international cricket standings.",
    images: ["https://8jjcricket.com/og-rankings.jpg"],
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
// Enhanced for data-rich content and tables
// ============================================

export const rankingsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://8jjcricket.com/rankings#webpage",
      name: "ICC Cricket Rankings 2026 | 8jjcricket", // ✅ ADDED: Brand + year
      description:
        "Official ICC team rankings for Test, ODI, and T20 International cricket in 2026. View complete standings, points, and rating changes updated after every match.",
      url: "https://8jjcricket.com/rankings",
      inLanguage: "en-IN", // ✅ ADDED
      isPartOf: {
        // ✅ ADDED: Link to parent site
        "@type": "WebSite",
        "@id": "https://8jjcricket.com/#website",
        name: "8jjcricket",
      },
      about: {
        // ✅ ADDED: Topic specification
        "@type": "Thing",
        name: "Cricket Rankings",
        description:
          "International cricket team and player rankings across all formats",
      },
      publisher: {
        "@type": "Organization",
        "@id": "https://8jjcricket.com/#organization",
        name: "8jjcricket", // ✅ FIXED: Consistent brand
        url: "https://8jjcricket.com",
        logo: {
          "@type": "ImageObject",
          url: "https://8jjcricket.com/logo.png",
          width: 112,
          height: 112,
        },
        sameAs: [
          // ✅ ADDED: Social profiles
          "https://facebook.com/8jjcricket",
          "https://twitter.com/8jjcricket",
          "https://instagram.com/8jjcricket",
        ],
      },
      // ✅ ADDED: Breadcrumb navigation
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
            name: "ICC Rankings",
            item: "https://8jjcricket.com/rankings",
          },
        ],
      },
      // ✅ ADDED: Last reviewed date (important for data pages)
      dateModified: new Date().toISOString(),
      datePublished: "2025-01-01T00:00:00Z", // ✅ ADDED: Initial publication
    },
    // ✅ ADDED: Table schema for ranking data
    {
      "@type": "Table",
      "@id": "https://8jjcricket.com/rankings#table",
      about: "ICC Cricket Team Rankings",
      description:
        "Comprehensive ICC rankings across Test, ODI, and T20I formats showing team positions, points, and ratings",
    },
    // ✅ ADDED: FAQPage schema for ranking queries
    {
      "@type": "FAQPage",
      "@id": "https://8jjcricket.com/rankings#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What are the current ICC cricket rankings?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The ICC cricket rankings show the current standings of international cricket teams across Test, ODI, and T20I formats. Rankings are updated after every international match based on team performance and results.",
          },
        },
        {
          "@type": "Question",
          name: "Which team is ranked #1 in Test cricket 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Visit 8jjcricket rankings page to see the latest Test cricket rankings updated in real-time after every international match.",
          },
        },
        {
          "@type": "Question",
          name: "How are ICC rankings calculated?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ICC rankings are calculated based on match results, series outcomes, and the strength of opposition. Points are awarded for wins and deducted for losses, with recent matches weighted more heavily.",
          },
        },
        {
          "@type": "Question",
          name: "Where is India ranked in cricket?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Check India's current cricket rankings across Test, ODI, and T20I formats at 8jjcricket. Rankings are updated after every international match involving Team India.",
          },
        },
      ],
    },
  ],
};

// ============================================
// OPTIONAL: Dynamic ranking data schema
// Use this if you want to add structured data for actual ranking values
// ============================================

export function generateRankingTableSchema(rankings: {
  format: "Test" | "ODI" | "T20I";
  teams: Array<{
    rank: number;
    team: string;
    rating: number;
    points: number;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: `ICC ${rankings.format} Cricket Rankings`,
    sport: "Cricket",
    description: `Official ICC ${rankings.format} team rankings for 2026`,
    memberOf: {
      "@type": "SportsOrganization",
      name: "International Cricket Council (ICC)",
    },
    member: rankings.teams.slice(0, 10).map((team) => ({
      "@type": "SportsTeam",
      name: team.team,
      sport: "Cricket",
      memberOf: {
        "@type": "SportsOrganization",
        name: "ICC",
      },
    })),
  };
}
