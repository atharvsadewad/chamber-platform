import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        signal: {
          good: "hsl(var(--signal-good))",
          caution: "hsl(var(--signal-caution))",
          bad: "hsl(var(--signal-bad))",
        },

        /* ---------- Brand ---------- */

        brand: {
          DEFAULT: "#6F0F1D",
          dark: "#560B16",
          light: "#8E2031",
        },

        paper: {
          DEFAULT: "#F8F6F2",
          dark: "#EFE9DE",
        },

        gold: {
          DEFAULT: "#C59A3D",
          dark: "#A97C22",
          light: "#E0BC67",
        },

        charcoal: {
          DEFAULT: "#2F3437",
          light: "#4D5358",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      fontFamily: {
        serif: [
          "var(--font-display)",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        sans: [
          "var(--font-body)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },

      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top, rgba(111,15,29,0.12), transparent 60%)",

        "paper-texture":
          "linear-gradient(180deg,#faf8f4 0%,#f6f2ea 100%)",
      },

      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.06)",
        floating: "0 20px 50px rgba(0,0,0,0.10)",
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

        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(12px)",
          },

          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        "pulse-ring": {
          "0%": {
            boxShadow: "0 0 0 0 hsl(var(--signal-good) / 0.35)",
          },

          "100%": {
            boxShadow: "0 0 0 8px hsl(var(--signal-good) / 0)",
          },
        },
      },

      animation: {
        "accordion-down":
          "accordion-down 0.2s ease-out",

        "accordion-up":
          "accordion-up 0.2s ease-out",

        "fade-up":
          "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards",

        "pulse-ring":
          "pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};

export default config;