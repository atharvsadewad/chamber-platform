import {
  BookOpen,
  BrainCircuit,
  FileSearch,
  Gavel,
  Library,
  Scale,
} from "lucide-react";

export const FEATURES = [
  {
    title: "Research",
    description:
      "Search across Acts, Judgments, Rules, Notifications and legal references.",
    href: "/research",
    icon: FileSearch,
  },
  {
    title: "Acts",
    description:
      "Browse Central Acts, State Acts, Rules, Amendments and Sections.",
    href: "/acts",
    icon: Library,
  },
  {
    title: "Judgments",
    description:
      "Explore Supreme Court, High Court and Tribunal decisions with intelligent search.",
    href: "/judgments",
    icon: Scale,
  },
  {
    title: "Dictionary",
    description:
      "Understand legal terminology with definitions, explanations and examples.",
    href: "/dictionary",
    icon: BookOpen,
  },
  {
    title: "Procedures",
    description:
      "Step-by-step procedural guides for litigation, compliance and legal practice.",
    href: "/procedures",
    icon: Gavel,
  },
  {
    title: "AI Assistant",
    description:
      "Research faster with Laws & Judgments AI for explanations, summaries and drafting assistance.",
    href: "/ai",
    icon: BrainCircuit,
  },
] as const;