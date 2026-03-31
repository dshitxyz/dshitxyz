import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "shit-yellow": "#F4D03F",
        "shit-yellow-dark": "#D4AC0D",
        "shit-brown": "#8B4513",
        "shit-brown-light": "#A0522D",
        "glitch-red": "#FF0000",
        "glitch-red-dark": "#CC0000",
        "bg-raw": "#1A1A1A",
        "bg-dirty": "#2D2D2D",
        "bg-waste": "#3D3D3D",
        "text-shit": "#FFFFFF",
        "text-dim": "#CCCCCC",
        "toxic-green": "#39FF14",
        "cyber-purple": "#BF00FF",
        "industrial-orange": "#FF6600",
        "dirty-white": "#E5E5E5",
      },
      fontFamily: {
        display: ["Bebas Neue", ...defaultTheme.fontFamily.sans],
        body: ["Space Mono", ...defaultTheme.fontFamily.mono],
        accent: ["Permanent Marker", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        h1: "clamp(3rem, 8vw, 8rem)",
        h2: "clamp(2rem, 6vw, 4rem)",
        h3: "clamp(1.5rem, 4vw, 3rem)",
        body: "1rem",
        sm: "0.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
