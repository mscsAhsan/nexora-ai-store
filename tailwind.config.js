/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#FBF9F5",
        card: "#FFFFFF",
        line: "#EDE9E0",
        violet: { brand: "#F3A620" },
        emerald: { brand: "#F3A620" },
        cyan: { brand: "#0EA5E9" },
        pink: { brand: "#DB2777" },
        muted: "#625B6B",
        ink: "#282330",
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        display: ["Inter Tight", "Inter", "Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg,#F3A620 0%,#F4AD33 100%)",
        "cta-gradient": "linear-gradient(135deg,#F3A620 0%,#DB2777 100%)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-18px)" } },
        blob: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(40px,-30px) scale(1.1)" },
          "66%": { transform: "translate(-30px,30px) scale(0.95)" },
        },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
        spinSlow: { to: { transform: "rotate(360deg)" } },
        pulseRing: { "0%": { transform: "scale(.8)", opacity: ".6" }, "100%": { transform: "scale(1.8)", opacity: "0" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        blob: "blob 14s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 6s linear infinite",
        "spin-slow": "spinSlow 40s linear infinite",
        "pulse-ring": "pulseRing 2.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};
