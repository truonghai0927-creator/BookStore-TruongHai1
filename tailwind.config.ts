import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'auth-gradient':
          'radial-gradient(ellipse at 15% 50%, rgba(124,58,237,.25) 0%, transparent 50%),' +
          'radial-gradient(ellipse at 85% 30%, rgba(99,102,241,.20) 0%, transparent 50%),' +
          'radial-gradient(ellipse at 50% 90%, rgba(167,139,250,.15) 0%, transparent 50%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        violet: { 600: '#7c3aed', 500: '#7c3aed', 400: '#8b5cf6' },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      boxShadow: {
        'auth-card':
          '0 0 0 1px rgba(255,255,255,.5),' +
          '0 20px 40px -12px rgba(0,0,0,.18),' +
          '0 8px 16px -8px rgba(0,0,0,.12)',
        'auth-button': '0 4px 14px 0 rgba(124,58,237,.40), 0 2px 6px rgba(0,0,0,.12)',
        'auth-button-hover': '0 8px 28px 0 rgba(124,58,237,.50), 0 4px 12px rgba(0,0,0,.16)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
export default config;
