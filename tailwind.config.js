/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'pop-in': {
          from: { opacity: '0', transform: 'scale(0.97) translateY(-6px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 200ms ease-out',
        'fade-in': 'fade-in 150ms ease-out',
        'pop-in': 'pop-in 160ms ease-out',
      },
    },
  },
  plugins: [],
};
