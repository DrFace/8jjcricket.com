import type { Metadata } from "next";

// ============================================
// OPTIMIZED FOR "cricket series 2026" + "IPL schedule" RANKING
// Targets: schedule searches + tournament queries + brand
// HIGH TRAFFIC POTENTIAL: Series pages rank faster than news
// ============================================

export const seriesMetadata: Metadata = {
  // ✅ FIXED: Brand first + year specificity + high-volume keywords
  title: "8jjcricket - Cricket Series Schedule 2026 | IPL, T20 World Cup & International Fixtures",
  
  // ✅ IMPROVED: More comprehensive, includes brand + specific tournaments
  description:
    "Complete cricket series schedule 2026 at 8jjcricket - IPL fixtures, T20 World Cup dates, international tours, Test series, and domestic tournaments. Get match timings, venues, and squad updates for India, Australia, England & all cricket nations.",
  
  // ✅ UPDATED: High-volume, time-sensitive keywords
  keywords: [
    "8jjcricket series",
    "cricket series schedule 2026",
    "IPL 2026 schedule",
    "T20 World Cup 2026 fixtures",
    "India cricket schedule 2026",
    "cricket tournament calendar",
    "upcoming cricket series",
    "international cricket fixtures",
    "cricket series 2026",
    "Asia Cup 2026 schedule"
  ],
  
  openGraph: {
    // ✅ FIXED: Brand consistency + year + tournaments
    title: "8jjcricket - Cricket Series 2026 | IPL, T20 WC & International Tours",
    description: "Complete schedule for IPL 2026, T20 World Cup, India tours, and all international cricket series. Match dates, venues, and fixtures at 8jjcricket.",
    url: "https://8jjcricket.com/series",
    siteName: "8jjcricket", // ✅ Exact match
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://8jjcricket.com/og-series.jpg",
        width: 1200,
        height: 630,
        alt: "8jjcricket - Cricket Series Schedule 2026 Calendar",
      },
    ],
  },
  
  alternates: {
    canonical: "https://8jjcricket.com/series",
  },
  
  // ✅ ADDED: Twitter card
  twitter: {
    card: "summary_large_image",
    title: "8jjcricket - Cricket Series Schedule 2026",
    description: "IPL, T20 World Cup, and all international cricket series fixtures. Complete match calendar.",
    images: ["https://8jjcricket.com/og-series.jpg"],
    site: "@8jjcricket",
  },
  
  // ✅ ADDED: Robot directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// ============================================
// OPTIMIZED SCHEMA MARKUP (JSON-LD)
// Enhanced for event-based content and schedules
// ============================================

export const seriesJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://8jjcricket.com/series#webpage",
      "name": "Cricket Series Schedule 2026 | 8jjcricket", // ✅ ADDED: Brand + year
      "description": "Comprehensive schedule of international and domestic cricket series for 2026 including IPL, T20 World Cup, Test tours, ODI series, and all major tournaments at 8jjcricket.",
      "url": "https://8jjcricket.com/series",
      "inLanguage": "en-IN", // ✅ ADDED
      "isPartOf": { // ✅ ADDED: Link to parent site
        "@type": "WebSite",
        "@id": "https://8jjcricket.com/#website",
        "name": "8jjcricket"
      },
      "about": { // ✅ ADDED: Topic specification
        "@type": "Thing",
        "name": "Cricket Tournament Schedule",
        "description": "Calendar of cricket tournaments, series, and matches for 2026"
      },
      "publisher": {
        "@type": "Organization",
        "@id": "https://8jjcricket.com/#organization",
        "name": "8jjcricket", // ✅ FIXED: Consistent brand
        "url": "https://8jjcricket.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://8jjcricket.com/logo.png",
          "width": 112,
          "height": 112
        },
        "sameAs": [ // ✅ ADDED: Social profiles
          "https://facebook.com/8jjcricket",
          "https://twitter.com/8jjcricket",
          "https://instagram.com/8jjcricket"
        ]
      },
      // ✅ ADDED: Breadcrumb navigation
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "8jjcricket",
            "item": "https://8jjcricket.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Cricket Series",
            "item": "https://8jjcricket.com/series"
          }
        ]
      },
      "mainEntity": {
        "@type": "ItemList",
        "name": "Cricket Series & Tournaments 2026", // ✅ IMPROVED: Added year
        "description": "Complete list of international and domestic cricket series scheduled for 2026", // ✅ IMPROVED
        "numberOfItems": 3, // ✅ ADDED
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "International Tours & Bilateral Series",
            "description": "Test, ODI, and T20I series between cricket nations including India vs Australia, England tours, and all bilateral fixtures" // ✅ ADDED
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "T20 Franchise Leagues - IPL, PSL, BBL, CPL",
            "description": "Indian Premier League 2026, Pakistan Super League, Big Bash League, Caribbean Premier League and other T20 tournaments" // ✅ ADDED
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "ICC Global Tournaments - T20 World Cup 2026, Asia Cup",
            "description": "ICC T20 World Cup 2026, Asia Cup, Champions Trophy and other multi-nation tournaments" // ✅ ADDED
          }
        ]
      },
      // ✅ ADDED: Update frequency
      "dateModified": new Date().toISOString(),
      "datePublished": "2025-01-01T00:00:00Z"
    },
    // ✅ ADDED: EventSeries schema for tournament calendar
    {
      "@type": "EventSeries",
      "@id": "https://8jjcricket.com/series#eventseries",
      "name": "Cricket Series 2026",
      "description": "Annual calendar of cricket tournaments and series for 2026",
      "startDate": "2026-01-01",
      "endDate": "2026-12-31",
      "location": {
        "@type": "Place",
        "name": "Worldwide Cricket Venues"
      },
      "organizer": {
        "@type": "Organization",
        "name": "International Cricket Council (ICC)"
      }
    },
    // ✅ ADDED: FAQPage for schedule queries
    {
      "@type": "FAQPage",
      "@id": "https://8jjcricket.com/series#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "When does IPL 2026 start?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "IPL 2026 is scheduled to start in March/April 2026. Check the complete IPL 2026 schedule with match dates, venues, and timings at 8jjcricket for the most up-to-date fixtures."
          }
        },
        {
          "@type": "Question",
          "name": "What are the upcoming India cricket series in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "India's cricket schedule for 2026 includes home and away Test series, ODI bilaterals, T20 World Cup 2026, Asia Cup, and IPL. Visit 8jjcricket series page for the complete Team India fixture calendar with dates and venues."
          }
        },
        {
          "@type": "Question",
          "name": "Where can I find T20 World Cup 2026 schedule?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "T20 World Cup 2026 schedule with complete fixtures, match dates, venues, and team groups is available at 8jjcricket. The tournament schedule includes all matches from group stage to finals."
          }
        },
        {
          "@type": "Question",
          "name": "Which cricket series are happening in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Major cricket series in 2026 include IPL, T20 World Cup, Asia Cup, India vs Australia series, Ashes, PSL, BBL, and numerous bilateral Test, ODI, and T20I tours. Check 8jjcricket for the complete 2026 cricket calendar."
          }
        }
      ]
    }
  ]
};

// ============================================
// OPTIONAL: Individual series event schema
// Use this for specific tournament pages (e.g., /series/ipl-2026)
// ============================================

export function generateSeriesEventSchema(series: {
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  teams?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": series.name,
    "description": series.description,
    "url": `https://8jjcricket.com/series/${series.slug}`,
    "startDate": series.startDate,
    "endDate": series.endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": series.location,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Multiple Countries"
      }
    },
    "organizer": {
      "@type": "SportsOrganization",
      "name": "International Cricket Council",
      "url": "https://www.icc-cricket.com"
    },
    "sport": "Cricket",
    "competitor": series.teams?.map(team => ({
      "@type": "SportsTeam",
      "name": team,
      "sport": "Cricket"
    })) || [],
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "url": `https://8jjcricket.com/series/${series.slug}`
    }
  };
}
