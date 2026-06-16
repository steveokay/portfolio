/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#111111',
        border: '#1e1e1e',
        muted: '#2a2a2a',
        fg: {
          DEFAULT: '#e2e2e2',
          secondary: '#888888',
          muted: '#808080',
        },
        accent: {
          DEFAULT: '#ffb000',
          dim: '#cc8c00',
          subtle: 'rgba(255, 176, 0, 0.12)',
        },
        ok: '#22c55e',
        warn: '#f59e0b',
        error: '#ef4444',
        unknown: '#6b7280',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'status-pulse': 'status-pulse 2.4s ease-in-out infinite',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'status-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
