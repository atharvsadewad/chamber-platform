import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Bare Acts",
  description:
    "Browse and search Indian Central Acts, State Acts, Rules, Amendments and section-wise legislation on Laws & Judgments.",

  alternates: {
    canonical: "/bare-acts",
  },

  openGraph: {
    title: "Bare Acts | Laws & Judgments",
    description:
      "Browse and search Indian Central Acts, State Acts, Rules, Amendments and section-wise legislation.",
    url: "https://lawsandjudgments.in/bare-acts",
    siteName: "Laws & Judgments",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Bare Acts | Laws & Judgments",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bare Acts | Laws & Judgments",
    description:
      "Browse and search Indian Central Acts, State Acts, Rules, Amendments and section-wise legislation.",
    images: ["/logo.png"],
  },
};

export default function BareActsPage() {
  return (
    <ComingSoon
      title="Bare Acts"
      description="Browse and search Central Acts, State Acts, Rules, Amendments and section-wise legislation. This module is currently being prepared."
      icon="bare-acts"
    />
  );
}