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
        // Admin studio + storefront motion
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "60%": { transform: "scale(1.015)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        sheetUp: {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        kenburns: {
          "0%": { transform: "scale(1) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.08) translate3d(0,-1.2%,0)" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(63,74,46,0.35)" },
          "70%": { boxShadow: "0 0 0 10px rgba(63,74,46,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(63,74,46,0)" },
        },
        toastIn: {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 1s ease-out both",
        slowfade: "slowfade 1.6s ease-out both",
        riseIn: "riseIn 0.55s cubic-bezier(0.22,1,0.36,1) both",
        slideInLeft: "slideInLeft 0.45s cubic-bezier(0.22,1,0.36,1) both",
        popIn: "popIn 0.35s cubic-bezier(0.22,1,0.36,1) both",
        sheetUp: "sheetUp 0.4s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 38s linear infinite",
        shimmer: "shimmer 1.8s linear infinite",
        kenburns: "kenburns 18s ease-out both",
        drift: "drift 6s ease-in-out infinite",
        pulseRing: "pulseRing 2s ease-out infinite",
        toastIn: "toastIn 0.35s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
