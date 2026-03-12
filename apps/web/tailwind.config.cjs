/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        chain: {
          50: "#FFFFFF",
          100: "#0F172A",
          200: "#1E293B",
          300: "#334155",
          400: "#475569",
          500: "#2563EB",
          600: "#93C5FD",
          700: "#CBD5E1",
          800: "#E2E8F0",
          900: "#F1F5F9",
          950: "#F8FAFC"
        }
      },
      fontFamily: {
        display: ["Segoe UI", "Roboto", "Arial", "sans-serif"],
        body: ["Segoe UI", "Roboto", "Arial", "sans-serif"]
      },
      boxShadow: {
        neon: "0 1px 3px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};
