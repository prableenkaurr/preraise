import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Off-white canvas, dark-navy ink.
        canvas: "#f7f6f2",
        ink: "#0f1b2d",
        "ink-soft": "#46566b",
        line: "#e4e2da",
        // Per-source accents.
        hn: "#ff6600",
        ph: "#da552f",
        trends: "#4285f4",
        surfaced: "#1554d1",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s infinite linear",
      },
    },
  },
  plugins: [],
};

export default config;
