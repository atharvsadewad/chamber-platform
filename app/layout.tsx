import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { fontDisplay, fontBody, fontMono } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://lawsandjudgments.in"),

  title: {
    default: "Laws & Judgments",
    template: "%s | Laws & Judgments",
  },

  description:
    "India's modern legal research platform for Bare Acts, Judgments, Legal Drafting, AI-assisted legal research and legal procedures.",

  keywords: [
    "Bare Acts",
    "Indian Laws",
    "Judgments",
    "Case Law",
    "Supreme Court",
    "High Court",
    "Legal Research",
    "BNS",
    "BNSS",
    "BSA",
    "Legal AI",
    "Legal Drafts",
    "Law Students",
    "Lawyers",
  ],

  authors: [
    {
      name: "Laws & Judgments",
    },
  ],

  creator: "Laws & Judgments",
  publisher: "Laws & Judgments",

  alternates: {
    canonical: "https://lawsandjudgments.in",
  },

  openGraph: {
    title: "Laws & Judgments",
    description:
      "India's modern legal research platform for Acts, Judgments and AI-powered legal assistance.",
    url: "https://lawsandjudgments.in",
    siteName: "Laws & Judgments",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Laws & Judgments",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Laws & Judgments",
    description: "India's modern legal research platform.",
    images: ["/logo.png"],
  },

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}