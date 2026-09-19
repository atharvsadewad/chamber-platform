import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Judgments",
  description:
    "Search and explore Indian Supreme Court, High Court and Tribunal judgments with structured legal research tools on Laws & Judgments.",

  alternates: {
    canonical: "/judgments",
  },

  openGraph: {
    title: "Judgments | Laws & Judgments",
    description:
      "Search and explore Indian Supreme Court, High Court and Tribunal judgments with structured legal research tools.",
    url: "https://lawsandjudgments.in/judgments",
    siteName: "Laws & Judgments",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Judgments | Laws & Judgments",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Judgments | Laws & Judgments",
    description:
      "Search and explore Indian Supreme Court, High Court and Tribunal judgments with structured legal research tools.",
    images: ["/logo.png"],
  },
};

export default function JudgmentsPage() {
  return (
    <ComingSoon
      title="Judgments"
      description="Search and explore Supreme Court, High Court and Tribunal decisions with structured legal research tools. This module is coming soon."
      icon="judgments"
    />
  );
}