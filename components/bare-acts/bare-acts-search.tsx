"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { BARE_ACT_SEARCH_METHODS } from "@/config/bare-acts";

type SearchResult = {
  id: number;
  act_id: number;
  section: string;
  title: string;
  content: string;
  description: string;
};

export function BareActsSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setSearched(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(trimmedQuery)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data.data || []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setError("Unable to perform search. Please try again.");
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
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search Bare Acts, Rules, Sections, Notifications..."
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

            return (
              <button
                key={item.value}
                type="button"
                className="group rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
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

      {/* Search Results */}
      {searched && (
        <div className="space-y-5">

          {/* Result Header */}
          <div className="flex items-center justify-between">

            <p className="text-sm text-muted-foreground">
              {loading
                ? "Searching..."
                : `${results.length} result${
                    results.length === 1 ? "" : "s"
                  } found for `}
              {!loading && (
                <span className="font-medium text-foreground">
                  "{query}"
                </span>
              )}
            </p>

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
          {!loading && !error && results.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground" />

              <h3 className="mt-4 text-lg font-semibold">
                No results found
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Try searching with a different Act name, section number,
                legal term or keyword.
              </p>
            </div>
          )}

          {/* Result Cards */}
          {!loading &&
            !error &&
            results.map((result) => (
              <article
                key={result.id}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
              >

                <div className="flex items-center justify-between gap-4">

                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    Section {result.section}
                  </span>

                  <span className="text-xs font-medium text-muted-foreground">
                    BNS
                  </span>

                </div>

                <h3 className="mt-5 text-xl font-semibold leading-snug">
                  {result.title}
                </h3>

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

                  <span className="text-xs text-muted-foreground">
                    Act ID: {result.act_id}
                  </span>

                  <button
                    type="button"
                    className="text-sm font-medium text-primary transition hover:underline"
                  >
                    View Section →
                  </button>

                </div>

              </article>
            ))}

        </div>
      )}

    </section>
  );
}