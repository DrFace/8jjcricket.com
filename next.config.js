/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sportmonks.com" },
      { protocol: "https", hostname: "www.onlinegames.io" },
      { protocol: "https", hostname: "cloud.onlinegames.io" },

      // Allow your own domain if backend ever returns absolute URLs
      { protocol: "https", hostname: "8jjcricket.com", pathname: "/storage/**" },
      { protocol: "https", hostname: "www.8jjcricket.com", pathname: "/storage/**" },
    ],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "http://72.60.107.98:8001/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
