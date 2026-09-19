import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Legal Research",

  description:
    "Explore a unified legal research workspace for searching Acts, Sections, Judgments and legal references on Laws & Judgments.",

  alternates: {
    canonical: "/research",
  },

  openGraph: {
    title: "Legal Research | Laws & Judgments",
    description:
      "Explore a unified legal research workspace for searching Acts, Sections, Judgments and legal references.",
    url: "https://lawsandjudgments.in/research",
    siteName: "Laws & Judgments",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Legal Research | Laws & Judgments",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Legal Research | Laws & Judgments",
    description:
      "Explore a unified legal research workspace for searching Acts, Sections, Judgments and legal references.",
    images: ["/logo.png"],
  },
};

export default function ResearchPage() {
  return (
    <ComingSoon
      title="Legal Research"
      description="A unified research workspace for searching Acts, Sections, Judgments and legal references is currently under development."
      icon="research"
    />
  );
}