import Link from "next/link";
import {
  BookOpen,
  Scale,
  Gavel,
  FileText,
  Library,
  Bookmark,
  History,
  Search,
} from "lucide-react";

const ITEMS = [
  {
    title: "Research",
    href: "/research",
    icon: Search,
  },
  {
    title: "Bare Acts",
    href: "/acts",
    icon: BookOpen,
  },
  {
    title: "Judgments",
    href: "/judgments",
    icon: Scale,
  },
  {
    title: "Legal Drafts",
    href: "/drafts",
    icon: FileText,
  },
  {
    title: "Procedures",
    href: "/procedures",
    icon: Gavel,
  },
  {
    title: "Dictionary",
    href: "/dictionary",
    icon: Library,
  },
];

const RECENT = [
  "Article 21",
  "BNS Section 302",
  "Cheque Bounce",
  "GST Act",
];

export function ResearchSidebar() {
  return (
    <div className="space-y-6">

      <div className="rounded-2xl border border-border bg-card p-5">

        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Workspace
        </h2>

        <nav className="space-y-1">

          {ITEMS.map((item) => {

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Icon className="h-4 w-4" />

                {item.title}

              </Link>
            );
          })}

        </nav>

      </div>

      <div className="rounded-2xl border border-border bg-card p-5">

        <div className="mb-4 flex items-center gap-2">

          <History className="h-4 w-4" />

          <h2 className="text-sm font-semibold">
            Recent Searches
          </h2>

        </div>

        <div className="space-y-2">

          {RECENT.map((item) => (

            <button
              key={item}
              className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-secondary"
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      <div className="rounded-2xl border border-border bg-primary p-5 text-primary-foreground">

        <Bookmark className="mb-3 h-5 w-5" />

        <h3 className="font-semibold">
          Saved Research
        </h3>

        <p className="mt-2 text-sm opacity-80">
          Bookmark important Acts, Judgments and AI conversations.
        </p>

      </div>

    </div>
  );
}