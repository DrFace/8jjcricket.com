/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // ✅ EXISTING (UNCHANGED)
      { protocol: "https", hostname: "cdn.sportmonks.com" },

      // ✅ ADDED (for games images)
      { protocol: "https", hostname: "www.onlinegames.io" },
      { protocol: "https", hostname: "cloud.onlinegames.io" },
      // ✅ LOCAL API for carousel images
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
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
        destination: "http://72.60.107.98:8001/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
