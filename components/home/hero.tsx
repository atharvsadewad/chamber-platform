"use client";

import Link from "next/link";
import { ArrowRight, Search, Scale, Sparkles } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Eyebrow, Display, Lead } from "@/components/ui/typography";

const SEARCH_OPTIONS = [
  {
    label: "Legal Drafts",
    placeholder: "Search legal drafts, e.g. notice, agreement...",
    href: "/drafts",
  },
  {
    label: "Legal Procedures",
    placeholder: "Search legal procedures, e.g. FIR, bail...",
    href: "/procedures",
  },
  {
    label: "Legal Dictionary",
    placeholder: "Search legal terms, e.g. abetment...",
    href: "/dictionary",
  },
] as const;

const POPULAR_SEARCHES = [
  {
    label: "Legal Notice",
    href: "/drafts?q=Legal%20Notice",
  },
  {
    label: "Rent Agreement",
    href: "/drafts?q=Rent%20Agreement",
  },
  {
    label: "FIR",
    href: "/procedures?q=FIR",
  },
  {
    label: "Affidavit",
    href: "/drafts?q=Affidavit",
  },
  {
    label: "Consumer Complaint",
    href: "/drafts?q=Consumer%20Complaint",
  },
] as const;

export function Hero() {
  const [activeSearch, setActiveSearch] = React.useState(0);
  const [query, setQuery] = React.useState("");

  /*
   * The index is controlled locally and can only be changed
   * by the buttons rendered from SEARCH_OPTIONS.
   *
   * The fallback keeps TypeScript satisfied without changing
   * the actual UI behavior.
   */
  const activeOption =
    SEARCH_OPTIONS[activeSearch] ?? SEARCH_OPTIONS[0];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      window.location.href = activeOption.href;
      return;
    }

    window.location.href = `${activeOption.href}?q=${encodeURIComponent(
      trimmedQuery,
    )}`;
  }

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Subtle background atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_50%_20%,hsl(var(--primary)/0.055),transparent_38%)]
        "
      />

      <div
        className="
          relative mx-auto w-full max-w-[1600px]
          px-5 pb-14 pt-14
          sm:px-8 sm:pb-16 sm:pt-16
          lg:px-12 lg:pb-20 lg:pt-20
          xl:px-16
        "
      >
        <div className="mx-auto w-full max-w-[1280px] text-center">
          {/* Eyebrow */}
          <Eyebrow
            className="
              mx-auto inline-flex items-center gap-2
              rounded-full border border-primary/20
              bg-primary/5 px-4 py-2
            "
          >
            <Scale className="h-4 w-4 text-primary" />
            India's Next-Gen Legal Research Platform
          </Eyebrow>

          {/* Heading */}
          <Display
            className="
              mx-auto mt-7 max-w-[1180px] text-balance
              text-[clamp(3rem,6vw,6rem)]
              leading-[0.94]
              tracking-[-0.04em]
              sm:mt-8
            "
          >
            Every{" "}
            <span className="text-primary">Legal Insight.</span>
            <br />
            One Platform.
          </Display>

          {/* Description */}
          <Lead
            className="
              mx-auto mt-7 max-w-[820px]
              text-base leading-7
              sm:mt-8 sm:text-lg sm:leading-8
              lg:text-xl
            "
          >
            Search Legal Drafts, Procedures, Legal Dictionary and
            AI-powered legal explanations — all from one unified platform.
          </Lead>

          {/* Search */}
          <div className="mx-auto mt-8 w-full max-w-[820px] sm:mt-10">
            <form
              onSubmit={handleSubmit}
              className="
                overflow-hidden rounded-2xl
                border border-border
                bg-card/80
                shadow-[0_12px_40px_hsl(var(--foreground)/0.06)]
                backdrop-blur-xl
                transition-shadow duration-300
                focus-within:shadow-[0_16px_50px_hsl(var(--primary)/0.10)]
                sm:rounded-3xl
              "
            >
              {/* Search input */}
              <div className="flex h-[62px] items-center gap-3 px-4 sm:h-[68px] sm:px-6">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />

                <input
                  type="search"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder={activeOption.placeholder}
                  aria-label={`Search ${activeOption.label}`}
                  className="
                    min-w-0 flex-1
                    bg-transparent
                    text-sm text-foreground
                    outline-none
                    placeholder:text-muted-foreground
                    sm:text-base
                  "
                />

                <button
                  type="submit"
                  className="
                    inline-flex h-10 shrink-0
                    items-center justify-center
                    rounded-xl bg-primary px-5
                    text-sm font-medium
                    text-primary-foreground
                    transition-all duration-200
                    hover:opacity-90
                    active:scale-[0.97]
                    sm:h-11 sm:px-7
                  "
                >
                  <span className="hidden sm:inline">
                    Search
                  </span>

                  <ArrowRight className="h-4 w-4 sm:ml-2" />
                </button>
              </div>

              {/* Search categories */}
              <div
                className="
                  flex gap-2 overflow-x-auto
                  border-t border-border
                  px-4 py-3
                  sm:justify-center sm:px-6
                "
              >
                {SEARCH_OPTIONS.map((option, index) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => {
                      setActiveSearch(index);
                      setQuery("");
                    }}
                    className={`
                      shrink-0 rounded-full border
                      px-4 py-2
                      text-xs font-medium
                      transition-all duration-200
                      sm:text-sm
                      ${
                        activeSearch === index
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-background/70 text-foreground hover:border-primary/40 hover:bg-primary/5"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Popular searches */}
          <div
            className="
              mx-auto mt-6 flex max-w-[1000px]
              items-center justify-center gap-2
              overflow-x-auto pb-1
              sm:mt-7 sm:flex-wrap sm:gap-3
            "
          >
            {POPULAR_SEARCHES.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="
                  shrink-0 rounded-full
                  border border-border
                  bg-background/70
                  px-3.5 py-2
                  text-xs text-muted-foreground
                  backdrop-blur-sm
                  transition-all duration-200
                  hover:border-primary/40
                  hover:bg-primary/5
                  hover:text-primary
                  sm:px-4 sm:text-sm
                "
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div
            className="
              mt-7 flex flex-col
              items-center justify-center gap-3
              sm:mt-9 sm:flex-row
            "
          >
            <Button
              size="lg"
              variant="accent"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/newspaper">
                Explore Legal Newspaper
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/ai">
                <Sparkles className="mr-2 h-4 w-4" />
                Try AI Assistant
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}