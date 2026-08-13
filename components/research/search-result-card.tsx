"use client";

import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Scale,
  Sparkles,
} from "lucide-react";

export interface SearchResult {
  id: string;
  title: string;
  source: string;
  year: string;
  summary: string;
  tags: string[];
}

interface SearchResultCardProps {
  result: SearchResult;
}

export function SearchResultCard({
  result,
}: SearchResultCardProps) {
  return (
    <article className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-xl font-semibold transition-colors group-hover:text-primary">

            {result.title}

          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">

            <span className="flex items-center gap-2">

              <Scale className="h-4 w-4" />

              {result.source}

            </span>

            <span className="flex items-center gap-2">

              <CalendarDays className="h-4 w-4" />

              {result.year}

            </span>

          </div>

        </div>

        <button className="rounded-lg p-2 transition hover:bg-secondary">

          <Bookmark className="h-5 w-5" />

        </button>

      </div>

      <p className="mt-6 leading-7 text-muted-foreground">

        {result.summary}

      </p>

      <div className="mt-6 flex flex-wrap gap-2">

        {result.tags.map((tag) => (

          <span
            key={tag}
            className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
          >
            {tag}
          </span>

        ))}

      </div>

      <div className="mt-7 flex items-center justify-between">

        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-xs font-medium text-primary">

          <Sparkles className="h-3.5 w-3.5" />

          AI Summary Available

        </span>

        <button className="flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3">

          Open

          <ArrowUpRight className="h-4 w-4" />

        </button>

      </div>

    </article>
  );
}