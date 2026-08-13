import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";

/**
 * Display serif — carries the editorial, Laws & Judgments-of-the-court
 * authority of the brand. Used sparingly for headings only.
 */
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

/**
 * Body / UI sans — optimized for dense reading and interface text.
 */
export const fontBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/**
 * Monospace — reserved for citations, docket numbers, and case IDs,
 * echoing the fixed-width formatting of legal citation formats.
 */
export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});
