import type { Metadata } from "next";

import DictionaryPage from "@/components/dictionary/dictionary-page";

export const metadata: Metadata = {
  title: "Legal Dictionary",

  description:
    "Search and explore Indian legal terms, definitions and legal terminology on the Laws & Judgments legal dictionary.",

  alternates: {
    canonical: "/dictionary",
  },

  openGraph: {
    title: "Legal Dictionary | Laws & Judgments",
    description:
      "Search and explore Indian legal terms, definitions and legal terminology.",
    url: "https://lawsandjudgments.in/dictionary",
    siteName: "Laws & Judgments",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Legal Dictionary | Laws & Judgments",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Legal Dictionary | Laws & Judgments",
    description:
      "Search and explore Indian legal terms, definitions and legal terminology.",
    images: ["/logo.png"],
  },
};

export default function DictionaryRoute() {
  return <DictionaryPage />;
}