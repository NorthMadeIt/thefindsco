import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F8FA',
        ink: '#14161A',
        surface: '#FFFFFF',
        muted: '#6B7280',
        line: '#E6E8EC',
        accent: {
          DEFAULT: '#0F9D8E',
          dark: '#0B7D71',
          light: '#E4F5F2',
        },
        ember: {
          DEFAULT: '#FF6B4A',
          light: '#FFE9E2',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,22,26,0.04), 0 8px 24px -12px rgba(20,22,26,0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config
