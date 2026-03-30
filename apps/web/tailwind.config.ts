import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'shit-yellow': '#F4D03F',
        'shit-brown': '#8B4513',
        'glitch-red': '#FF0000',
        'toxic-green': '#39FF14',
        'cyber-purple': '#BF00FF',
        'industrial-orange': '#FF6600',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Space Mono', 'monospace'],
        accent: ['Permanent Marker', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;
