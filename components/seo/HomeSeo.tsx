// components/seo/home-data.ts
import type { Metadata } from "next";

// 1. The Metadata Object (Title, Description, OpenGraph)
export const homeMetadata: Metadata = {
  title: 'Live Cricket Scores, India News & Free Games | 8JJ Cricket',
  description: 'The fastest live cricket scores for Team India and South Asia. Read breaking news, track stats, and play free cricket minigames on 8JJ. No download needed.',
  keywords: ['Live cricket scores', 'India cricket news', 'free cricket games', 'fantasy minigames', 'IPL news', 'Asia Cup scores', '8jj cricket', 'online cricket games'],
  openGraph: {
    title: '8JJ Cricket: Live Scores & Free Minigames',
    description: 'Don’t just watch. Play. Get the fastest scores for India, Pakistan, and Sri Lanka matches plus free minigames.',
    url: 'https://8jjcricket.com',
    siteName: '8JJ Cricket',
    images: [
      {
        url: 'https://8jjcricket.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '8JJ Cricket Live Scores & Games',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: 'https://8jjcricket.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: '8JJ Cricket: Live Scores & Free Minigames',
    description: 'Fastest scores for Team India & South Asia. Play free cricket games now.',
    images: ['https://8jjcricket.com/og-image.jpg'],
  },
};

// 2. The Schema Markup (JSON-LD)
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://8jjcricket.com/#organization",
      "name": "8JJ Cricket",
      "url": "https://8jjcricket.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://8jjcricket.com/logo.png",
        "width": 112,
        "height": 112
      },
      "areaServed": [
        { "@type": "Country", "name": "India" },
        { "@type": "Country", "name": "Sri Lanka" },
        { "@type": "Country", "name": "Pakistan" },
        { "@type": "Country", "name": "Bangladesh" }
      ],
      "sameAs": [
        "https://facebook.com/8jjcricket",
        "https://twitter.com/8jjcricket",
        "https://instagram.com/8jjcricket"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://8jjcricket.com/#website",
      "url": "https://8jjcricket.com",
      "name": "8JJ Cricket",
      "description": "Live Cricket Scores and Minigames for India & South Asia",
      "publisher": { "@id": "https://8jjcricket.com/#organization" },
      "inLanguage": "en-IN"
    }
  ]
};