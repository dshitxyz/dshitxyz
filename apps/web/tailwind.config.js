/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'shit-yellow': '#F4D03F',
        'shit-yellow-dark': '#D4AC0D',
        'shit-brown': '#8B4513',
        'shit-brown-light': '#A0522D',
        'glitch-red': '#FF0000',
        'glitch-red-dark': '#CC0000',
        'bg-raw': '#1A1A1A',
        'bg-dirty': '#2D2D2D',
        'bg-waste': '#3D3D3D',
        'text-shit': '#FFFFFF',
        'text-dim': '#CCCCCC',
        'toxic-green': '#39FF14',
        'cyber-purple': '#BF00FF',
        'industrial-orange': '#FF6600',
        'dirty-white': '#E5E5E5',
      },
      fontFamily: {
        'display': ['Bebas Neue', 'sans-serif'],
        'body': ['Space Mono', 'monospace'],
        'accent': ['Permanent Marker', 'cursive'],
      },
    },
  },
  plugins: [],
};
