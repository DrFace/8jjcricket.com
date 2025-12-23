/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // ✅ EXISTING (UNCHANGED)
      { protocol: 'https', hostname: 'cdn.sportmonks.com' },

      // ✅ ADDED (for games images)
      { protocol: 'https', hostname: 'www.onlinegames.io' },
      { protocol: 'https', hostname: 'cloud.onlinegames.io' },
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
