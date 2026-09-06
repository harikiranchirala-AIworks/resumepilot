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
        dark: {
          950: "#06090F",
          900: "#0B0F17",
          850: "#101622",
          800: "#161F30",
          700: "#1E2B42",
          600: "#2A3B59",
        },
        cyber: {
          indigo: "#6366F1",
          purple: "#8B5CF6",
          cyan: "#06B6D4",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
        brand: {
          50: "#f0fdf4",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
      },
      boxShadow: {
        card: "0 8px 32px 0 rgba(0, 0, 0, 0.36)",
        "glass-sm": "0 2px 8px 0 rgba(0, 0, 0, 0.2)",
        "glow-indigo": "0 0 35px -5px rgba(99, 102, 241, 0.35)",
        "glow-cyan": "0 0 35px -5px rgba(6, 182, 212, 0.35)",
        "glow-emerald": "0 0 35px -5px rgba(16, 185, 129, 0.35)",
        "glow-purple": "0 0 35px -5px rgba(139, 92, 246, 0.35)",
      },
      backgroundImage: {
        "page-gradient": "radial-gradient(ellipse at 50% 0%, #111827 0%, #080C14 70%, #05070B 100%)",
        "header-gradient": "linear-gradient(180deg, rgba(17, 24, 39, 0.8) 0%, rgba(11, 15, 23, 0.6) 100%)",
        "ai-glow": "radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.15), transparent 70%)",
        "card-gradient": "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
