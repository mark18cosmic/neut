/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        olive: {
          DEFAULT: "#3F4A2E",
          deep: "#2E3621",
          soft: "#5A6642",
        },
        cream: "#F3EDE2",
        ivory: "#FBF8F1",
        sand: "#E3D5BF",
        clay: "#B79B75",
        chrome: "#171712",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slowfade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeUp: "fadeUp 1s ease-out both",
        slowfade: "slowfade 1.6s ease-out both",
      },
    },
  },
  plugins: [],
};
