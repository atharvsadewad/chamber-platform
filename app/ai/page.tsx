import type { Metadata } from "next";

import AIPage from "@/components/ai/ai-page";

export const metadata: Metadata = {
  title: "AI Assistant",
  description:
    "Ask questions about Indian laws, legal provisions, judgments and legal concepts with the Laws & Judgments AI Assistant.",

  alternates: {
    canonical: "/ai",
  },

  openGraph: {
    title: "AI Assistant | Laws & Judgments",
    description:
      "Ask questions about Indian laws, legal provisions, judgments and legal concepts with the Laws & Judgments AI Assistant.",
    url: "https://lawsandjudgments.in/ai",
    siteName: "Laws & Judgments",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "AI Assistant | Laws & Judgments",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Assistant | Laws & Judgments",
    description:
      "Ask questions about Indian laws, legal provisions, judgments and legal concepts with the Laws & Judgments AI Assistant.",
    images: ["/logo.png"],
  },
};

export default function AIRoute() {
  return <AIPage />;
}