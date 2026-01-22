import type { Metadata } from "next";

export const newsMetadata: Metadata = {
  title: "Latest Cricket News & Updates | 8jjcricket",
  description:
    "Read the latest cricket news, match reports, player updates, and analysis from around the world. Stay updated with 8jjcricket.",
  openGraph: {
    title: "Latest Cricket News | 8jjcricket",
    description:
      "Breaking cricket news, match previews, and exclusive analysis.",
    url: "https://8jjcricket.com/news",
    siteName: "8JJ Cricket",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://8jjcricket.com/og-news.jpg",
        width: 1200,
        height: 630,
        alt: "8JJ Cricket News",
      },
    ],
  },
  alternates: {
    canonical: "https://8jjcricket.com/news",
  },
};

export const newsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Latest Cricket News",
  description: "A collection of the latest cricket news articles and updates.",
  url: "https://8jjcricket.com/news",
  publisher: {
    "@type": "Organization",
    name: "8JJ Cricket",
    logo: {
      "@type": "ImageObject",
      url: "https://8jjcricket.com/logo.png",
    },
  },
};
