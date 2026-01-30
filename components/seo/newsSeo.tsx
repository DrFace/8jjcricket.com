import type { Metadata } from "next";

// ============================================
// OPTIMIZED FOR "8jjcricket news" + "cricket news" RANKING
// Targets: news searches + brand queries + Google Discover
// ============================================

export const newsMetadata: Metadata = {
  // ✅ FIXED: Brand first + target keywords
  title: "8jjcricket - Latest Cricket News, Updates & Breaking Stories Today",

  // ✅ IMPROVED: More keyword-rich, includes brand + recency signals
  description:
    "Get breaking cricket news at 8jjcricket - latest updates on Team India, IPL 2026, international cricket, player transfers, match reports, and exclusive analysis. Updated daily.",

  // ✅ ADDED: Keywords array for better targeting
  keywords: [
    "8jjcricket news",
    "cricket news today",
    "latest cricket news",
    "India cricket news",
    "IPL 2026 news",
    "cricket breaking news",
    "Team India news",
    "cricket updates today",
    "international cricket news",
    "cricket news India",
  ],

  openGraph: {
    // ✅ FIXED: Brand consistency + urgency
    title: "8jjcricket - Breaking Cricket News & Latest Updates",
    description:
      "Breaking cricket news, match previews, player interviews, and exclusive analysis from India and around the world. Follow 8jjcricket for the latest updates.",
    url: "https://8jjcricket.com/news",
    siteName: "8jjcricket", // ✅ Exact match, no space
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://8jjcricket.com/og-news.jpg",
        width: 1200,
        height: 630,
        alt: "8jjcricket - Latest Cricket News and Updates",
      },
    ],
  },

  alternates: {
    canonical: "https://8jjcricket.com/news",
  },

  // ✅ ADDED: Twitter card for news sharing
  twitter: {
    card: "summary_large_image",
    title: "8jjcricket - Latest Cricket News Today",
    description:
      "Breaking cricket news, match reports, and exclusive analysis from India and around the world.",
    images: ["https://8jjcricket.com/og-news.jpg"],
    site: "@8jjcricket",
  },

  // ✅ ADDED: Robot directives optimized for news
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
// Enhanced for Google News & Discover eligibility
// ============================================

export const newsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://8jjcricket.com/news#webpage",
      name: "Latest Cricket News | 8jjcricket", // ✅ ADDED: Brand mention
      description:
        "Breaking cricket news, match reports, player updates, and exclusive analysis from India and international cricket at 8jjcricket. Updated multiple times daily.", // ✅ IMPROVED
      url: "https://8jjcricket.com/news",
      inLanguage: "en-IN", // ✅ ADDED
      isPartOf: {
        // ✅ ADDED: Link to parent website
        "@type": "WebSite",
        "@id": "https://8jjcricket.com/#website",
        name: "8jjcricket",
      },
      about: {
        // ✅ ADDED: Topic specification
        "@type": "Thing",
        name: "Cricket News",
        description:
          "News and updates about cricket matches, players, and tournaments",
      },
      publisher: {
        "@type": "Organization",
        "@id": "https://8jjcricket.com/#organization", // ✅ ADDED: Reference
        name: "8jjcricket", // ✅ FIXED: Consistent brand name
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
            name: "Cricket News",
            item: "https://8jjcricket.com/news",
          },
        ],
      },
    },
    // ✅ ADDED: Blog/NewsMediaOrganization for Google News
    {
      "@type": "Blog",
      "@id": "https://8jjcricket.com/news#blog",
      name: "8jjcricket Cricket News",
      description:
        "Daily cricket news coverage including match reports, player interviews, tournament updates, and expert analysis",
      url: "https://8jjcricket.com/news",
      inLanguage: "en-IN",
      publisher: {
        "@id": "https://8jjcricket.com/#organization",
      },
      blogPost: {
        // ✅ ADDED: Indicates this is a news/blog section
        "@type": "BlogPosting",
        headline: "Latest Cricket News and Updates",
      },
    },
  ],
};

// ============================================
// OPTIONAL: News-specific schema for Google Discover
// Add this to individual news article pages
// ============================================

// Example function to generate article schema (use in individual article pages)
export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedDate: string;
  modifiedDate: string;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    url: article.url,
    image: {
      "@type": "ImageObject",
      url: article.imageUrl,
      width: 1200,
      height: 630,
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate,
    author: {
      "@type": "Person",
      name: article.authorName,
      url: "https://8jjcricket.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "8jjcricket",
      logo: {
        "@type": "ImageObject",
        url: "https://8jjcricket.com/logo.png",
        width: 112,
        height: 112,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  };
}
