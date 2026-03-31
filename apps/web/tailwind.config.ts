import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shit Yellow
        "shit-yellow": "#F4D03F",
        "shit-yellow-dark": "#D4AC0D",
        // Poop Brown
        "shit-brown": "#8B4513",
        "shit-brown-light": "#A0522D",
        // Glitch Red
        "glitch-red": "#FF0000",
        "glitch-red-dark": "#CC0000",
        // Industrial Grey
        "bg-raw": "#1A1A1A",
        "bg-dirty": "#2D2D2D",
        "bg-waste": "#3D3D3D",
        // Crude White
        "text-shit": "#FFFFFF",
        "text-dim": "#CCCCCC",
        // Toxic Green
        "toxic-green": "#39FF14",
        // Cyberpunk Purple
        "cyber-purple": "#BF00FF",
        // Industrial Orange
        "industrial-orange": "#FF6600",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "monospace"],
        accent: ["var(--font-accent)", "cursive"],
      },
      animation: {
        "shit-glitch": "shit-glitch 0.3s infinite",
        "shit-shake": "shit-shake 0.5s",
        "shit-pulse": "shit-pulse 0.2s infinite",
      },
      keyframes: {
        "shit-glitch": {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        "shit-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        "shit-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
