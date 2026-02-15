import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'india-maroon': '#800000',
        'india-charcoal': '#1A1A2E', // Deep dark blue/charcoal for contrast
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