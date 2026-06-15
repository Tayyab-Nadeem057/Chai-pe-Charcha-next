import type { Config } from "tailwindcss";

// Brand theme — mirrors the current Chai Pe Charcha look (warm orange + cream,
// Playfair Display headings, Inter body).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E8731C",
          light: "#FF9A40",
          soft: "#FBEFE0",
        },
        ink: "#2A1A0F",
        cream: "#FBF4E9",
        sand: "#F1E4CE",
        cocoa: "#3D2817",
        terracotta: "#C4622D",
        coal: "#0C0600",
        surface: "#1B0F05",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brand: "0 8px 26px rgba(255,106,0,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
