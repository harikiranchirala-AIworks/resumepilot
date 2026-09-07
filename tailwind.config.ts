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
        light: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        cyber: {
          indigo: "#4F46E5",
          purple: "#7C3AED",
          cyan: "#0891B2",
          emerald: "#059669",
          amber: "#D97706",
          rose: "#E11D48",
        },
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },
      },
      boxShadow: {
        "2xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        xs: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
        "glass-sm": "0 2px 8px 0 rgba(0, 0, 0, 0.05)",
        "glow-indigo": "0 0 25px -5px rgba(79, 70, 229, 0.25)",
        "glow-cyan": "0 0 25px -5px rgba(8, 145, 178, 0.25)",
        "glow-emerald": "0 0 25px -5px rgba(5, 150, 105, 0.25)",
        "glow-purple": "0 0 25px -5px rgba(124, 58, 237, 0.25)",
      },
      backgroundImage: {
        "page-gradient": "radial-gradient(ellipse at 50% 0%, #EEF2FF 0%, #F8FAFC 70%, #F1F5F9 100%)",
        "header-gradient": "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)",
        "ai-glow": "radial-gradient(circle at 50% -20%, rgba(79, 70, 229, 0.08), transparent 70%)",
        "card-gradient": "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
