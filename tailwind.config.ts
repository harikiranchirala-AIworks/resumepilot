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
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(37, 99, 235, 0.12), 0 2px 8px -2px rgba(37, 99, 235, 0.08)",
        glow: "0 0 40px -8px rgba(59, 130, 246, 0.45)",
      },
      backgroundImage: {
        "page-gradient":
          "linear-gradient(160deg, #eff6ff 0%, #dbeafe 35%, #f0f9ff 70%, #e0f2fe 100%)",
        "header-gradient":
          "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
