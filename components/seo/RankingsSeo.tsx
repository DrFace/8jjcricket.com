import type { Metadata } from "next";

export const rankingsMetadata: Metadata = {
  title: "ICC Team Rankings | 8jjcricket",
  description:
    "Check official ICC team rankings across Test, ODI, and T20 formats. See current standings, points, and ratings for international cricket teams.",
  openGraph: {
    title: "ICC Cricket Team Rankings - Test, ODI & T20",
    description: "Official team standings for International Cricket.",
    url: "https://8jjcricket.com/rankings",
    siteName: "8JJ Cricket",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://8jjcricket.com/og-rankings.jpg", // Ensure this image exists in your public folder
        width: 1200,
        height: 630,
        alt: "ICC Team Rankings Table",
      },
    ],
  },
  alternates: {
    canonical: "https://8jjcricket.com/rankings",
  },
};

export const rankingsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "ICC Cricket Team Rankings",
  description:
    "Current ICC team rankings for Test, ODI, and T20 International cricket.",
  url: "https://8jjcricket.com/rankings",
  publisher: {
    "@type": "Organization",
    name: "8JJ Cricket",
    logo: {
      "@type": "ImageObject",
      url: "https://8jjcricket.com/logo.png",
    },
  },
};
