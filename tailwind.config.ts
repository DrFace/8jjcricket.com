import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'india-saffron': '#FF9933',
        'india-green': '#138808',
        'india-gold': '#FFD700',
        'india-red': '#DA251D',
        'india-blue': '#000080',
        'vibrant-pink': '#FF007F',
        'vibrant-orange': '#FF5E0E',
      },
    },
  },
  plugins: [],
} satisfies Config