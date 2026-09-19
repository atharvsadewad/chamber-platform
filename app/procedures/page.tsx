import type { Metadata } from "next";

import ProceduresPage from "@/components/procedures/procedures-page";

export const metadata: Metadata = {
  title: "Legal Procedures",

  description:
    "Browse and search legal procedures, procedural guides and practical legal materials on Laws & Judgments.",

  alternates: {
    canonical: "/procedures",
  },

  openGraph: {
    title: "Legal Procedures | Laws & Judgments",
    description:
      "Browse and search legal procedures, procedural guides and practical legal materials.",
    url: "https://lawsandjudgments.in/procedures",
    siteName: "Laws & Judgments",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Legal Procedures | Laws & Judgments",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Legal Procedures | Laws & Judgments",
    description:
      "Browse and search legal procedures, procedural guides and practical legal materials.",
    images: ["/logo.png"],
  },
};

export default function ProceduresRoute() {
  return <ProceduresPage />;
}