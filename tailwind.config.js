export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0907', coal: '#12100D', panel: '#1A1713', line: '#2C261E',
        gold: { DEFAULT: '#D4AF37', light: '#F1D78A', deep: '#9C7419', pale: '#E9DDB8' },
        ivory: '#F4EEE2', muted: '#9C9282',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        caps: ['Cinzel', 'serif'],
      },
      letterSpacing: { luxe: '0.32em' },
    },
  },
  plugins: [],
}
