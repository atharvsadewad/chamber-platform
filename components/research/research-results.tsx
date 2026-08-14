"use client";

import {
  Search,
  X,
} from "lucide-react";

import type { SearchMode } from "./research-search";
import { SearchResultCard } from "./search-result-card";

export interface ResearchResult {
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
}

interface ResearchResultsProps {
  results: ResearchResult[];
  query: string;
  searchMode: SearchMode;
  loading: boolean;
  searched: boolean;
  error: string;
  onClear: () => void;
}

function getModeLabel(mode: SearchMode) {
  if (mode === null) {
    return "All";
  }

  const labels: Record<
    Exclude<SearchMode, null>,
    string
  > = {
    keyword: "Keyword",
    party: "Party Name",
    citation: "Citation",
    "bare-act": "Bare Act",
    section: "Section",
  };

  return labels[mode];
}

export function ResearchResults({
  results,
  query,
  searchMode,
  loading,
  searched,
  error,
  onClear,
}: ResearchResultsProps) {
  if (!searched) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">
          Start your research
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Search Indian legal material using a keyword,
          party name, citation, Bare Act, or section.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Search Results
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Searching legal sources..."
              : `${results.length} ${
                  results.length === 1
                    ? "result"
                    : "results"
                } for "${query}" · ${getModeLabel(
                  searchMode,
                )}`}
          </p>
        </div>

        {!loading && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-border bg-card p-6"
              >
                <div className="h-5 w-2/3 rounded bg-secondary" />

                <div className="mt-4 h-4 w-1/3 rounded bg-secondary" />

                <div className="mt-5 h-4 w-full rounded bg-secondary" />

                <div className="mt-2 h-4 w-5/6 rounded bg-secondary" />
              </div>
            ),
          )}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <Search className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

            <div>
              <h3 className="font-semibold text-destructive">
                Search unavailable
              </h3>

              <p className="mt-1 text-sm leading-6 text-destructive/80">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading &&
        !error &&
        results.length === 0 && (
          <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
            <Search className="mx-auto h-7 w-7 text-muted-foreground" />

            <h3 className="mt-4 text-lg font-semibold">
              No results found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Try a different search term or choose
              another search type.
            </p>
          </div>
        )}

      {!loading && !error && results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <SearchResultCard
              key={`${result.type}-${result.id}`}
              result={result}
            />
          ))}
        </div>
      )}
    </section>
  );
}