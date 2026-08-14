import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { fontDisplay, fontBody, fontMono } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://lawsandjudgments.in"),

  title: {
    default: "Laws & Judgments | Indian Legal Research Platform",
    template: "%s | Laws & Judgments",
  },

  description:
    "India's modern legal research platform for Bare Acts, Judgments, legal drafting, AI-assisted legal research, legal procedures and legal terminology.",

  keywords: [
    "Indian legal research",
    "Indian laws",
    "Bare Acts",
    "Indian Bare Acts",
    "Indian judgments",
    "Supreme Court judgments",
    "High Court judgments",
    "case law",
    "legal research",
    "BNS",
    "BNSS",
    "BSA",
    "legal AI",
    "legal drafts",
    "legal procedures",
    "legal dictionary",
    "law students",
    "lawyers",
  ],

  authors: [
    {
      name: "Laws & Judgments",
    },
  ],

  creator: "Laws & Judgments",
  publisher: "Laws & Judgments",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Laws & Judgments | Indian Legal Research Platform",
    description:
      "Research Indian laws, Bare Acts, judgments, legal procedures, drafts and legal concepts from one unified platform.",
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
    title: "Laws & Judgments | Indian Legal Research Platform",
    description:
      "Research Indian laws, judgments, legal procedures and legal concepts from one unified platform.",
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