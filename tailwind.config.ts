import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
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
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        60: "60",
        100: "100",
        999: "999",
        max: "6000",
      },
      colors: {
        charcoal: "rgb(var(--charcoal) / <alpha-value>)",
        "charcoal-light": "rgb(var(--charcoal-light) / <alpha-value>)",
        parchment: "rgb(var(--parchment) / <alpha-value>)",
        "parchment-dark": "rgb(var(--parchment-dark) / <alpha-value>)",
        rose: "rgb(var(--rose) / <alpha-value>)",
        "rose-dark": "rgb(var(--rose-dark) / <alpha-value>)",
        sage: "rgb(var(--sage) / <alpha-value>)",
        "sage-dark": "rgb(var(--sage-dark) / <alpha-value>)",
        mist: "rgb(var(--mist) / <alpha-value>)",
      },
      borderRadius: {
        "2lg": "10px",
        "1.5xl": "14px",
        "2xl": "16px",
        "3xl": "18px",
        "4xl": "20px",
        "5xl": "22px",
        "6xl": "24px",
        "6.5xl": "26px",
        "7xl": "28px",
        "7.5xl": "30px",
        "8xl": "32px",
        "8.5xl": "34px",
        "9xl": "36px",
        "9.5xl": "38px",
        "10xl": "40px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        3: "3px",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        newsreader: ["var(--font-montserrat)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px / 16px
        "2xs": ["0.8125rem", { lineHeight: "1.125rem" }], // 13px / 18px
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px / 20px
        "2sm": ["0.9375rem", { lineHeight: "1.375rem" }], // 15px / 22px
        base: ["1rem", { lineHeight: "1.5rem" }], // 16px / 24px
        lg: ["1.125rem", { lineHeight: "1.625rem" }], // 18px / 26px
        xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px / 28px
        "1.5xl": ["1.375rem", { lineHeight: "1.875rem" }], // 22px / 30px
        "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px / 32px
        "2.5xl": ["1.75rem", { lineHeight: "2.125rem" }], // 28px / 34px
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px / 36px
        "3.5xl": ["2rem", { lineHeight: "1.875rem" }], // 32px / 40px
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px / 40px
        "5xl": ["3rem", { lineHeight: "1" }], // 48px / 1
        50: ["3.125rem", { lineHeight: "1" }], // 48px / 1
        "5.5xl": ["3.5rem", { lineHeight: "1" }], // 56px / 1
        "6xl": ["3.75rem", { lineHeight: "1" }], // 60px / 1
        "7xl": ["4.5rem", { lineHeight: "1" }], // 72px / 1
        "8xl": ["6rem", { lineHeight: "1" }], // 96px / 1
        "9xl": ["8rem", { lineHeight: "1" }], // 128px / 1
      },
      lineHeight: {
        1: "1",
        1.1: "1.1",
        1.2: "1.2",
        1.3: "1.3",
        1.4: "1.4",
        1.5: "1.5",
        1.6: "1.6",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        floatUp: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        rotateGradient: {
          to: {
            transform: "translate(-50%, -50%) rotate(1turn)",
          },
        },
        "brand-ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "floatUp 3s ease-in-out infinite",
        rotateGradient: "rotateGradient 5s linear infinite",
        "brand-ticker": "brand-ticker 40s linear infinite",
      },
      transitionDuration: {
        DEFAULT: "300ms",
        350: "350ms",
        400: "400ms",
        450: "450ms",
      },
      width: {
        4.5: "18px",
      },
      height: {
        4.5: "18px",
      },
      spacing: {
        4.5: "18px",
        5.5: "22px",
        "half-px": "50px",
        15: "60px",
        18: "72px",
        100: "100px",
        150: "150px",
        200: "200px",
        250: "250px",
        300: "300px",
        section: "1220px",
      },
    },
  },
  plugins: [],
};

export default config;
