import type { Metadata } from "next";

import DraftsPage from "@/components/drafts/drafts-page";

export const metadata: Metadata = {
  title: "Drafts",
  description:
    "Browse and search legal drafts, notices, agreements, petitions and other legal document formats on Laws & Judgments.",

  alternates: {
    canonical: "/drafts",
  },

  openGraph: {
    title: "Drafts | Laws & Judgments",
    description:
      "Browse and search legal drafts, notices, agreements, petitions and other legal document formats.",
    url: "https://lawsandjudgments.in/drafts",
    siteName: "Laws & Judgments",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Drafts | Laws & Judgments",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Drafts | Laws & Judgments",
    description:
      "Browse and search legal drafts, notices, agreements, petitions and other legal document formats.",
    images: ["/logo.png"],
  },
};

export default function DraftsRoute() {
  return <DraftsPage />;
}