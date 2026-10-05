/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  // One strategy, not two. The previous config set none, so `dark:` compiled to
  // a prefers-color-scheme media query while index.css styled `.dark .card` —
  // and nothing ever added a `.dark` class, so cards stayed white in dark mode.
  // Colour now comes from tokens that flip on [data-theme], so components do not
  // branch on the theme at all; this selector is only here for the rare case.
  darkMode: ['selector', '[data-theme="dark"]'],

  theme: {
    extend: {
      colors: {
        page: 'var(--page)',
        surface: {
          DEFAULT: 'var(--surface)',
          raised: 'var(--surface-raised)',
          sunken: 'var(--surface-sunken)',
        },
        line: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
          subtle: 'var(--ink-subtle)',
          inverse: 'var(--ink-inverse)',
        },
        brand: {
          DEFAULT: 'var(--brand)',
          pressed: 'var(--brand-pressed)',
          soft: 'var(--brand-soft)',
        },
        'on-brand': 'var(--on-brand)',
        success: {
          DEFAULT: 'var(--success)',
          soft: 'var(--success-soft)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          soft: 'var(--danger-soft)',
        },
        warn: {
          DEFAULT: 'var(--warn)',
          soft: 'var(--warn-soft)',
        },
        focus: 'var(--focus)',
        track: 'var(--track)',
        tag: {
          rose: 'var(--tag-rose)',
          'rose-soft': 'var(--tag-rose-soft)',
          indigo: 'var(--tag-indigo)',
          'indigo-soft': 'var(--tag-indigo-soft)',
          amber: 'var(--tag-amber)',
          'amber-soft': 'var(--tag-amber-soft)',
          teal: 'var(--tag-teal)',
          'teal-soft': 'var(--tag-teal-soft)',
        },
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        raised: 'var(--shadow-raised)',
        bar: 'var(--shadow-bar)',
      },
      maxWidth: {
        content: 'var(--content-max)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
      },
    },
  },

  plugins: [],
};
