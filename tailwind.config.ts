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
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0,0,0.2,1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config