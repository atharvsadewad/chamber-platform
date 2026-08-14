"use client";

import {
  Search,
  UserRound,
  Quote,
  BookOpen,
  Tags,
  X,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

export type SearchMode =
  | "all"
  | "keyword"
  | "party"
  | "citation"
  | "bare-act"
  | "section";

interface ResearchSearchProps {
  query: string;
  searchMode: SearchMode;
  onSearch: (
    query: string,
    mode: SearchMode,
  ) => void;
  onModeChange: (mode: SearchMode) => void;
  onClear: () => void;
  loading: boolean;
}

const SEARCH_TYPES: {
  value: SearchMode;
  label: string;
  icon: typeof Search;
}[] = [
  {
    value: "all",
    label: "All",
    icon: Sparkles,
  },
  {
    value: "keyword",
    label: "Keyword",
    icon: Search,
  },
  {
    value: "party",
    label: "Party Name",
    icon: UserRound,
  },
  {
    value: "citation",
    label: "Citation",
    icon: Quote,
  },
  {
    value: "bare-act",
    label: "Bare Act",
    icon: BookOpen,
  },
  {
    value: "section",
    label: "Section",
    icon: Tags,
  },
];

const PLACEHOLDERS: Record<SearchMode, string> = {
  all: "Search laws, judgments, sections...",
  keyword: "Search laws, judgments, sections...",
  party:
    "Search by party name, e.g. State of Maharashtra...",
  citation:
    "Search by citation, e.g. (2014) 6 SCC 590...",
  "bare-act": "Search a Bare Act by name...",
  section:
    "Search by section number or text...",
};

export function ResearchSearch({
  query,
  searchMode,
  onSearch,
  onModeChange,
  onClear,
  loading,
}: ResearchSearchProps) {
  const [input, setInput] = useState(query);

  useEffect(() => {
    setInput(query);
  }, [query]);

  function submitSearch() {
    onSearch(input, searchMode);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitSearch();
    }
  }

  function handleModeChange(mode: SearchMode) {
    onModeChange(mode);
  }

  return (
    <section>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          Legal Research
        </p>

        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Search Indian legal material
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Search judgments, Bare Acts and sections from one
          research workspace.
        </p>
      </div>

      <div className="mt-7">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDERS[searchMode]}
              disabled={loading}
              className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-11 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Legal research search"
            />

            {input && !loading && (
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  onClear();
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={submitSearch}
            disabled={
              loading || !input.trim()
            }
            className="h-12 rounded-xl bg-primary px-7 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Searching..."
              : "Search"}
          </button>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            Search by
          </div>

          <div className="flex flex-wrap gap-2">
            {SEARCH_TYPES.map((item) => {
              const Icon = item.icon;
              const active =
                searchMode === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    handleModeChange(item.value)
                  }
                  disabled={loading}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                  } ${
                    loading
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {(searchMode === "party" ||
          searchMode === "citation") && (
          <p className="mt-3 text-xs text-muted-foreground">
            This search mode is ready in the interface but
            will use the judgment search service once its
            corresponding backend support is connected.
          </p>
        )}
      </div>
    </section>
  );
}