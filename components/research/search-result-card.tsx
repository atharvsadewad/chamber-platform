"use client";

import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  CalendarDays,
  Check,
  Scale,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { ResearchResult } from "./research-results";

import {
  isBookmarked,
  toggleBookmark,
} from "@/lib/workspace/bookmarks";

interface SearchResultCardProps {
  result: ResearchResult;
  onOpen: (result: ResearchResult) => void;
}

export function SearchResultCard({
  result,
  onOpen,
}: SearchResultCardProps) {
  const [saved, setSaved] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSavedState() {
      const value =
        await isBookmarked(
          result.id,
          result.type,
        );

      if (!cancelled) {
        setSaved(value);
      }
    }

    void loadSavedState();

    function handleChange() {
      void loadSavedState();
    }

    window.addEventListener(
      "lawsandjudgments:bookmarks-changed",
      handleChange,
    );

    return () => {
      cancelled = true;

      window.removeEventListener(
        "lawsandjudgments:bookmarks-changed",
        handleChange,
      );
    };
  }, [
    result.id,
    result.type,
  ]);

  async function handleBookmark() {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const next =
        await toggleBookmark({
          id: result.id,
          type: result.type,
          title: result.title,
          source: result.source,
          year: result.year,
          summary: result.summary,
          section: result.section,
          actName: result.actName,
          actNumber: result.actNumber,
        });

      setSaved(next);
    } finally {
      setSaving(false);
    }
  }

  const Icon =
    result.type === "judgment"
      ? Scale
      : result.type === "section"
        ? BookOpen
        : BookOpen;

  const typeLabel =
    result.type === "judgment"
      ? "Judgment"
      : result.type === "section"
        ? "Section"
        : "Bare Act";

  return (
    <article className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => onOpen(result)}
          className="min-w-0 flex-1 text-left"
        >
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
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() =>
              void handleBookmark()
            }
            disabled={saving}
            aria-label={
              saved
                ? `Remove ${result.title} from saved items`
                : `Save ${result.title}`
            }
            title={
              saved
                ? "Saved"
                : "Save"
            }
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:cursor-wait disabled:opacity-60 ${
              saved
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpen(result)}
            aria-label={`Open ${result.title}`}
            title="View"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowUpRight className="h-5 w-5" />
          </button>
        </div>
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

      <button
        type="button"
        onClick={() => onOpen(result)}
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        View details
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </article>
  );
}