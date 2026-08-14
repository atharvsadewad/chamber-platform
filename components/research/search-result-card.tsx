"use client";

import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Scale,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { ResearchResult } from "./research-results";

interface SearchResultCardProps {
  result: ResearchResult;
}

export function SearchResultCard({
  result,
}: SearchResultCardProps) {
  const router = useRouter();

  const Icon =
    result.type === "judgment"
      ? Scale
      : BookOpen;

  const typeLabel =
    result.type === "judgment"
      ? "Judgment"
      : result.type === "section"
        ? "Section"
        : "Bare Act";

  function openResult() {
    /*
     * If the backend eventually provides a direct URL,
     * prefer it over constructing a local route.
     */
    if (result.sourceUrl) {
      window.location.href = result.sourceUrl;
      return;
    }

    /*
     * Bare Act
     */
    if (result.type === "act") {
      const id = result.actId || result.id;

      router.push(
        `/research/acts/${encodeURIComponent(id)}`,
      );

      return;
    }

    /*
     * Section
     */
    if (result.type === "section") {
      router.push(
        `/research/sections/${encodeURIComponent(
          result.id,
        )}`,
      );

      return;
    }

    /*
     * Judgment
     */
    router.push(
      `/research/judgments/${encodeURIComponent(
        result.id,
      )}`,
    );
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLElement>,
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openResult();
    }
  }

  return (
    <article
      className="group cursor-pointer rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 sm:p-6"
      onClick={openResult}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`Open ${result.type}: ${result.title}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <Icon className="h-3.5 w-3.5" />
              {typeLabel}
            </span>

            {result.section && (
              <span className="text-xs font-medium text-muted-foreground">
                Section {result.section}
              </span>
            )}
          </div>

          <h3 className="mt-4 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
            {result.title}
          </h3>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {result.source && (
              <span className="flex items-center gap-1.5">
                <Scale className="h-4 w-4" />
                {result.source}
              </span>
            )}

            {result.year && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {result.year}
              </span>
            )}
          </div>
        </div>

        <span
          aria-hidden="true"
          className="shrink-0 rounded-lg p-2 text-muted-foreground transition group-hover:bg-secondary group-hover:text-foreground"
        >
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>

      {result.actName && (
        <p className="mt-3 text-sm font-medium text-primary">
          {result.actName}
        </p>
      )}

      {result.actNumber && (
        <p className="mt-2 text-sm text-muted-foreground">
          Act No. {result.actNumber}
        </p>
      )}

      {result.summary && (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {result.summary}
        </p>
      )}

      {result.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}