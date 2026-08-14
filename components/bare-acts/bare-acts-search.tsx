"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { BARE_ACT_SEARCH_METHODS } from "@/config/bare-acts";

type SearchMode =
  | "act_name"
  | "section"
  | "year"
  | "act_number"
  | "subject";

type SearchResult = {
  id: number;
  act_id?: number;
  section?: string;
  title?: string;
  content?: string;
  description?: string;

  act_name?: string;
  short_name?: string;
  year?: number;
  act_number?: string;
  subject?: string;
};

const MODE_MAP: Record<string, SearchMode> = {
  "Act Name": "act_name",
  Section: "section",
  Year: "year",
  "Act Number": "act_number",
  Subject: "subject",
};

export function BareActsSearch() {
  const [query, setQuery] = useState("");
  const [selectedMode, setSelectedMode] =
    useState<SearchMode | null>(null);

  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleModeSelect = (mode: SearchMode) => {
    setSelectedMode((current) =>
      current === mode ? null : mode
    );

    // Clear previous search when changing filter
    setResults([]);
    setSearched(false);
    setError("");
  };

  const handleSearch = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setSearched(false);
      setError("Please enter something to search.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const params = new URLSearchParams();

      params.set("q", trimmedQuery);

      if (selectedMode) {
        params.set("mode", selectedMode);
      }

      const response = await fetch(
        `/api/search?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data.data || []);
    } catch (err) {
      console.error("Search error:", err);

      setResults([]);

      setError(
        "Unable to perform search. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setError("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const selectedModeLabel =
    BARE_ACT_SEARCH_METHODS.find(
      (item) =>
        MODE_MAP[item.value] === selectedMode
    )?.value;

  return (
    <section className="space-y-6">

      {/* Search Bar */}
      <div className="flex flex-col gap-4 lg:flex-row">

        <div className="relative flex-1">

          <Search
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder={
              selectedMode
                ? `Search by ${selectedModeLabel}...`
                : "Search Bare Acts, Rules, Sections, Notifications..."
            }
            className="h-14 w-full rounded-xl border border-border bg-card pl-14 pr-12 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="h-14 rounded-xl bg-primary px-8 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>

      </div>

      {/* Search Methods */}
      {!searched && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {BARE_ACT_SEARCH_METHODS.map((item) => {
            const Icon = item.icon;

            const mode = MODE_MAP[item.value];
            
            if (!mode) return null;
            
            const isSelected = selectedMode === mode;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  handleModeSelect(mode)
                }
                className={`group rounded-xl border bg-card p-5 text-left transition-all ${
                  isSelected
                    ? "border-primary shadow-md"
                    : "border-border hover:border-primary hover:shadow-md"
                }`}
              >

                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg transition ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {item.title}
                </p>

                <h3 className="mt-1 font-semibold">
                  {item.value}
                </h3>

              </button>
            );
          })}

        </div>
      )}

      {/* Selected Filter */}
      {selectedMode && !searched && (
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">

          <p className="text-sm text-muted-foreground">
            Searching by{" "}
            <span className="font-semibold text-foreground">
              {selectedModeLabel}
            </span>
          </p>

          <button
            type="button"
            onClick={() => setSelectedMode(null)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Remove filter
          </button>

        </div>
      )}

      {/* Search Results */}
      {searched && (
        <div className="space-y-5">

          {/* Result Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="text-sm text-muted-foreground">

              {loading ? (
                "Searching..."
              ) : (
                <>
                  {results.length} result
                  {results.length === 1 ? "" : "s"} found
                  {selectedModeLabel && (
                    <>
                      {" "}
                      by{" "}
                      <span className="font-medium text-foreground">
                        {selectedModeLabel}
                      </span>
                    </>
                  )}
                  {" for "}
                  <span className="font-medium text-foreground">
                    "{query}"
                  </span>
                </>
              )}

            </div>

            {!loading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-sm font-medium text-primary hover:underline"
              >
                Clear
              </button>
            )}

          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* No Results */}
          {!loading &&
            !error &&
            results.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">

                <Search className="mx-auto h-8 w-8 text-muted-foreground" />

                <h3 className="mt-4 text-lg font-semibold">
                  No results found
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different{" "}
                  {selectedModeLabel
                    ? selectedModeLabel.toLowerCase()
                    : "search term"}
                  .
                </p>

              </div>
            )}

          {/* Result Cards */}
          {!loading &&
            !error &&
            results.map((result) => (
              <article
                key={`${result.id}-${result.act_id ?? "act"}`}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
              >

                <div className="flex items-center justify-between gap-4">

                  {result.section && (
                    <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      Section {result.section}
                    </span>
                  )}

                  {result.short_name && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {result.short_name}
                    </span>
                  )}

                </div>

                <h3 className="mt-5 text-xl font-semibold leading-snug">
                  {result.title ||
                    result.act_name ||
                    "Untitled"}
                </h3>

                {result.act_name && result.title && (
                  <p className="mt-2 text-sm font-medium text-primary">
                    {result.act_name}
                  </p>
                )}

                {result.year && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Year: {result.year}
                  </p>
                )}

                {result.act_number && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Act Number: {result.act_number}
                  </p>
                )}

                {result.subject && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Subject: {result.subject}
                  </p>
                )}

                {result.description && (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {result.description}
                  </p>
                )}

                {result.content && (
                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted-foreground">
                    {result.content}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-between">

                  {result.act_id ? (
                    <span className="text-xs text-muted-foreground">
                      Act ID: {result.act_id}
                    </span>
                  ) : (
                    <span />
                  )}

                  {result.act_id &&
                    result.section && (
                      <button
                        type="button"
                        className="text-sm font-medium text-primary transition hover:underline"
                      >
                        View Section →
                      </button>
                    )}

                </div>

              </article>
            ))}

        </div>
      )}

    </section>
  );
}