/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        chain: {
          50: "#F9E8FC",
          100: "#EEBFF8",
          200: "#E396F3",
          300: "#D86DEE",
          400: "#CE44E9",
          500: "#C31BE4",
          600: "#A016BB",
          700: "#7D1192",
          800: "#5A0C69",
          900: "#3B0845",
          950: "#130317"
        }
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Space Grotesk", "sans-serif"]
      },
      boxShadow: {
        neon: "0 0 20px rgba(195, 27, 228, 0.35)"
      }
    }
  },
  plugins: []
};
