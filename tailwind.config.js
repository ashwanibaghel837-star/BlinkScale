/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./lib/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050814",
        mist: "#95a4c4",
        line: "rgba(255, 255, 255, 0.08)",
        cyan: {
          50: "#e6f0ff",
          100: "#cce0ff",
          200: "#99c2ff",
          300: "#66a3ff",
          400: "#2d7dff", // Lighter Electric Blue
          500: "#0057ff", // Electric Blue
          600: "#004ecc",
          700: "#003a99",
          800: "#002666",
          900: "#001333",
          950: "#000a1a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 80px rgba(0, 87, 255, 0.26)",
        panel: "0 24px 80px rgba(5, 8, 20, 0.42)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
      animation: {
        "float-slow": "floatSlow 18s ease-in-out infinite",
        "float-slower": "floatSlower 26s ease-in-out infinite",
        "pulse-soft": "pulseSoft 5s ease-in-out infinite",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(20px, -28px, 0) scale(1.04)" },
        },
        floatSlower: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(-24px, 18px, 0) scale(0.96)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
        },
      },
    },
  },
  plugins: [],
};
