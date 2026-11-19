import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    // Breakpoints are tuned to the layouts already built on them; change with care.
    screens: {
      xxxs: "391px",
      xxs: "481px",
      xs: "631px",
      sm: "769px",
      md: "883px",
      "2md": "991px",
      lg: "1025px",
      "2lg": "1161px",
      xl: "1221px",
      "2xl": "1281px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      zIndex: {
        999: "999",
      },
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        "paper-2": "rgb(var(--paper-2) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-2": "rgb(var(--ink-2) / <alpha-value>)",
        rose: "rgb(var(--rose) / <alpha-value>)",
        "rose-ink": "rgb(var(--rose-ink) / <alpha-value>)",
        sage: "rgb(var(--sage) / <alpha-value>)",
        "sage-ink": "rgb(var(--sage-ink) / <alpha-value>)",
        mist: "rgb(var(--mist) / <alpha-value>)",
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        "3xl": "18px",
      },
      fontFamily: {
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        lg: ["1.125rem", { lineHeight: "1.625rem" }],
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
