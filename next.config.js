/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sportmonks.com" },
      { protocol: "https", hostname: "www.onlinegames.io" },
      { protocol: "https", hostname: "cloud.onlinegames.io" },

      // Allow your own domain if backend ever returns absolute URLs
      {
        protocol: "https",
        hostname: "8jjcricket.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "www.8jjcricket.com",
        pathname: "/storage/**",
      },

      // ✅ ADDED: localhost dev (only additions)
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "http://8jjcricket.com/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
