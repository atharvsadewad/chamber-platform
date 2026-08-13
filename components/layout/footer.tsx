import Link from "next/link";

import { Citation } from "@/components/ui/typography";

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/research", label: "Case research" },
      { href: "/signals", label: "Citator signals" },
      { href: "/dockets", label: "Docket tracking" },
      { href: "/briefs", label: "Brief assembly" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions/litigation", label: "Litigation" },
      { href: "/solutions/in-house", label: "In-house counsel" },
      { href: "/solutions/academia", label: "Academic access" },
      { href: "/solutions/government", label: "Government" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/security", label: "Security" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/changelog", label: "Changelog" },
      { href: "/status", label: "System status" },
      { href: "/support", label: "Support" },
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
              C
            </span>
            Laws & Judgments
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Primary-source legal research and citation analysis for counsel
            who cite with precision.
          </p>
          <Citation className="mt-6 block">Laws & Judgments, Inc.</Citation>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {column.title}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.href}>
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
