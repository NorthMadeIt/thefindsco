import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf7f2',
          100: '#f3ebe0',
          200: '#e6d5c0',
          300: '#d4b896',
          400: '#c19a6b',
          500: '#b0834f',
          600: '#9a6d42',
          700: '#7d5638',
          800: '#684732',
          900: '#573c2c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
