import type { Metadata } from "next";

import NewspaperPage from "@/components/newspaper/newspaper-page";

export const metadata: Metadata = {
  title: "Legal Newspaper",
  description:
    "Daily legal news, court developments, legislation, policy and legal developments from across India, published by Laws & Judgments.",

  alternates: {
    canonical: "/newspaper",
  },

  openGraph: {
    title: "Legal Newspaper | Laws & Judgments",
    description:
      "Daily legal news, court developments, legislation, policy and legal developments from across India.",
    url: "https://lawsandjudgments.in/newspaper",
    siteName: "Laws & Judgments",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Legal Newspaper | Laws & Judgments",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Legal Newspaper | Laws & Judgments",
    description:
      "Daily legal news, court developments, legislation, policy and legal developments from across India.",
    images: ["/logo.png"],
  },
};

export default function Page() {
  return <NewspaperPage />;
}