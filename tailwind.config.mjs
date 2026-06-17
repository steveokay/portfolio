/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        rule: 'var(--rule)',
        accent: 'var(--accent)',
        warn: 'var(--warn)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Display: clamp(2.25rem, 4.5vw, 3.75rem) — defined in global.css util
        eyebrow: ['11px', { lineHeight: '1.4', letterSpacing: '0.16em' }],
        meta: ['12px', { lineHeight: '1.5', letterSpacing: '0.04em' }],
      },
      maxWidth: {
        measure: '34rem',  // ~68 characters of Inter
        wide: '56rem',     // editorial article width — tight enough to feel centered
      },
      letterSpacing: {
        // For the all-caps eyebrow labels and section meta
        wider: '0.12em',
        widest: '0.18em',
      },
      transitionDuration: {
        '240': '240ms',
      },
      animation: {
        'fade-up': 'fadeUp 240ms ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
