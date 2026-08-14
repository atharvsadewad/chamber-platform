import Link from "next/link";

import { Citation } from "@/components/ui/typography";

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/research", label: "Research" },
      { href: "/acts", label: "Bare Acts" },
      { href: "/judgments", label: "Judgments" },
      { href: "/drafts", label: "Legal Drafts" },
    ],
  },
  {
    title: "Legal Tools",
    links: [
      { href: "/procedures", label: "Procedures" },
      { href: "/dictionary", label: "Legal Dictionary" },
      {
        href: "/laws-and-judgments-ai",
        label: "AI Assistant",
      },
      { href: "/research", label: "Legal Search" },
    ],
  },
  {
    title: "Research",
    links: [
      { href: "/research", label: "Search Legal Material" },
      { href: "/acts", label: "Browse Acts" },
      { href: "/judgments", label: "Browse Judgments" },
      { href: "/dictionary", label: "Legal Terms" },
    ],
  },
  {
    title: "Laws & Judgments",
    links: [
      { href: "/", label: "Home" },
      { href: "/research", label: "Research Workspace" },
      {
        href: "/laws-and-judgments-ai",
        label: "AI Assistant",
      },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container-laws-and-judgments grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
        <div className="lg:col-span-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-serif text-lg font-medium tracking-tight"
          >
            <span
              aria-hidden
              className="flex size-7 items-center justify-center rounded-sm bg-primary text-[13px] font-semibold text-primary-foreground"
            >
              L
            </span>

            Laws & Judgments
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A unified legal search and research platform for Acts,
            Judgments, Drafts, Procedures, legal terminology and
            AI-assisted legal research.
          </p>

          <a
            href="mailto:admin@lawsandjudgments.in"
            className="mt-5 inline-block text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            admin@lawsandjudgments.in
          </a>

          <Citation className="mt-4 block">
            Laws & Judgments
          </Citation>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {column.title}
            </h3>

            <ul className="mt-4 flex flex-col gap-3">
              {column.links.map((link) => (
                <li
                  key={`${column.title}-${link.href}-${link.label}`}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-laws-and-judgments flex flex-col-reverse items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Laws & Judgments. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy policy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}