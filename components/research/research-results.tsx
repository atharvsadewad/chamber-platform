"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

import { SearchResultCard } from "./search-result-card";
import { ResearchResultDrawer } from "./research-result-drawer";

export type ResearchResult = {
  id: string;
  type: "judgment" | "act" | "section";
  title: string;
  source: string;
  year: string;
  summary: string;
  tags: string[];

  section?: string;
  actName?: string;
  actNumber?: string;
  actId?: string;
  sourceUrl?: string;
};

interface ResearchResultsProps {
  results: ResearchResult[];
  query: string;
  searchMode: string;
  loading: boolean;
  searched: boolean;
  error: string;
  onClear: () => void;
}

const MODE_LABELS: Record<string, string> = {
  all: "All",
  keyword: "Keyword",
  party: "Party Name",
  citation: "Citation",
  "bare-act": "Bare Act",
  section: "Section",
};

export function ResearchResults({
  results,
  query,
  searchMode,
  loading,
  searched,
  error,
  onClear,
}: ResearchResultsProps) {
  const [selectedResult, setSelectedResult] =
    useState<ResearchResult | null>(null);

  if (!searched) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>

        <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight">
          Start your legal research
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Search Indian legal material using keywords, party names,
          citations, Bare Acts or sections.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section>
        <div className="mb-5">
          <div className="h-7 w-44 animate-pulse rounded bg-secondary" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-secondary" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="h-5 w-28 animate-pulse rounded bg-secondary" />
              <div className="mt-4 h-6 w-2/3 animate-pulse rounded bg-secondary" />
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-secondary" />
              <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-secondary" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              Search Results
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {results.length}{" "}
              {results.length === 1 ? "result" : "results"} for{" "}
              <span className="font-medium text-foreground">
                “{query}”
              </span>{" "}
              · {MODE_LABELS[searchMode] ?? searchMode}
            </p>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {results.length === 0 && !error ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-14 text-center">
            <Search className="mx-auto h-7 w-7 text-muted-foreground" />

            <h3 className="mt-4 font-serif text-xl font-semibold">
              No results found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try another search term or search mode.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <SearchResultCard
                key={`${result.type}-${result.id}`}
                result={result}
                onOpen={setSelectedResult}
              />
            ))}
          </div>
        )}
      </section>

      <ResearchResultDrawer
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />
    </>
  );
}