import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { ModuleGrid } from "@/components/home/module-grid";
import { AIPreview } from "@/components/home/ai-preview";
import { Stats } from "@/components/home/stats";

export const metadata: Metadata = {
  title: "Laws & Judgments | Indian Legal Research Platform",

  description:
    "Search Indian Bare Acts, judgments, legal drafts, legal procedures and legal terminology on Laws & Judgments, a unified legal research platform.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Laws & Judgments | Indian Legal Research Platform",
    description:
      "Search Indian Bare Acts, judgments, legal drafts, legal procedures and legal terminology on Laws & Judgments.",
    url: "https://lawsandjudgments.in/",
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
      "Search Indian Bare Acts, judgments, legal drafts, legal procedures and legal terminology on Laws & Judgments.",
    images: ["/logo.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://lawsandjudgments.in/#website",
      name: "Laws & Judgments",
      url: "https://lawsandjudgments.in/",
      description:
        "Indian legal research platform for Bare Acts, judgments, legal drafts, legal procedures and legal terminology.",
      inLanguage: "en-IN",
    },
    {
      "@type": "Organization",
      "@id": "https://lawsandjudgments.in/#organization",
      name: "Laws & Judgments",
      url: "https://lawsandjudgments.in/",
      logo: {
        "@type": "ImageObject",
        url: "https://lawsandjudgments.in/logo.png",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Hero />
      <ModuleGrid />
      <AIPreview />
      <Stats />
    </>
  );
}