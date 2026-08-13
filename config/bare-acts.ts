import {
  BookOpen,
  Landmark,
  Building2,
  FileText,
  Globe2,
  Scale,
  Search,
  Hash,
  CalendarDays,
  FolderOpen,
} from "lucide-react";

/* ---------------- Search Methods ---------------- */

export const BARE_ACT_SEARCH_METHODS = [
  {
    title: "Search by",
    value: "Act Name",
    icon: Search,
  },
  {
    title: "Search by",
    value: "Section",
    icon: Scale,
  },
  {
    title: "Search by",
    value: "Year",
    icon: CalendarDays,
  },
  {
    title: "Search by",
    value: "Act Number",
    icon: Hash,
  },
  {
    title: "Search by",
    value: "Subject",
    icon: FolderOpen,
  },
] as const;

/* ---------------- Categories ---------------- */

export const BARE_ACT_CATEGORIES = [
  {
    id: 1,
    title: "Constitution",
    description:
      "The Constitution of India with Articles, Schedules and Amendments.",
    count: "1 Document",
    href: "/bare-acts/constitution",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: 2,
    title: "Central Bare Acts",
    description:
      "Acts enacted by the Parliament of India.",
    count: "700+ Acts",
    href: "/bare-acts/central",
    icon: Landmark,
    color: "bg-green-50 text-green-700",
  },
  {
    id: 3,
    title: "State Bare Acts",
    description:
      "Acts enacted by State Legislatures.",
    count: "1200+ Acts",
    href: "/bare-acts/state",
    icon: Building2,
    color: "bg-orange-50 text-orange-700",
  },
  {
    id: 4,
    title: "Rules & Regulations",
    description:
      "Rules, Regulations, Notifications and subordinate legislation.",
    count: "5000+ Documents",
    href: "/bare-acts/rules",
    icon: FileText,
    color: "bg-violet-50 text-violet-700",
  },
  {
    id: 5,
    title: "International Law",
    description:
      "Treaties, Conventions and International Instruments related to India.",
    count: "1100+ Documents",
    href: "/bare-acts/international",
    icon: Globe2,
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    id: 6,
    title: "Compare Laws",
    description:
      "Compare corresponding provisions across different legislations.",
    count: "Coming Soon",
    href: "/compare",
    icon: Scale,
    color: "bg-amber-50 text-amber-700",
  },
] as const;

/* ---------------- Recent Acts ---------------- */

export const RECENT_BARE_ACTS = [
  "Bharatiya Nyaya Sanhita, 2023",
  "Bharatiya Nagarik Suraksha Sanhita, 2023",
  "Bharatiya Sakshya Adhiniyam, 2023",
  "Code of Civil Procedure, 1908",
  "Indian Contract Act, 1872",
] as const;