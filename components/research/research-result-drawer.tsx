"use client";

import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileText,
  Scale,
  X,
} from "lucide-react";

import type { ResearchResult } from "./research-results";

interface ResearchResultDrawerProps {
  result: ResearchResult | null;
  onClose: () => void;
}

export function ResearchResultDrawer({
  result,
  onClose,
}: ResearchResultDrawerProps) {
  if (!result) {
    return null;
  }

  const typeLabel =
    result.type === "judgment"
      ? "Judgment"
      : result.type === "section"
        ? "Section"
        : "Bare Act";

  const Icon =
    result.type === "judgment"
      ? Scale
      : result.type === "section"
        ? BookOpen
        : FileText;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close result viewer"
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {typeLabel}
              </p>

              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                Legal Research
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close result viewer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <Icon className="h-3.5 w-3.5" />
              {typeLabel}
            </span>

            {result.section && (
              <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Section {result.section}
              </span>
            )}
          </div>

          <h1 className="mt-5 font-serif text-3xl font-bold leading-tight tracking-tight text-foreground">
            {result.title}
          </h1>

          {/* Metadata */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {result.source && (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Scale className="h-4 w-4" />
                  Source
                </div>

                <p className="mt-2 text-sm font-medium text-foreground">
                  {result.source}
                </p>
              </div>
            )}

            {result.year && (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Year
                </div>

                <p className="mt-2 text-sm font-medium text-foreground">
                  {result.year}
                </p>
              </div>
            )}
          </div>

          {result.actName && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Act
              </p>

              <p className="mt-2 text-base font-semibold text-foreground">
                {result.actName}
              </p>
            </div>
          )}

          {result.actNumber && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Act Number
              </p>

              <p className="mt-2 text-sm text-foreground">
                {result.actNumber}
              </p>
            </div>
          )}

          {result.tags.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Classification
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main text */}
          {result.summary && (
            <div className="mt-8">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />

                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                  {result.type === "section"
                    ? "Provision"
                    : "Description"}
                </h2>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {result.summary}
                </p>
              </div>
            </div>
          )}

          {result.sourceUrl && (
            <div className="mt-8">
              <a
                href={result.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Open source
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-background px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Close
            <ArrowUpRight className="h-4 w-4 rotate-180" />
          </button>
        </div>
      </aside>
    </div>
  );
}