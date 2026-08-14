"use client";

import * as React from "react";
import { Search, X, BookOpen } from "lucide-react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type DictionaryEntry = {
  s_no: number;
  word: string;
  meaning: string;
};

const INITIAL_LIMIT = 50;
const SEARCH_LIMIT = 100;

// IMPORTANT:
// The dictionary is stored in the Supabase project configured by
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
// Do NOT use chamberSupabase here because that client is used for
// the separate Chamber/BNS database.
const dictionarySupabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function DictionaryPage() {
  const [search, setSearch] = React.useState("");
  const [entries, setEntries] = React.useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searching, setSearching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchedTerm, setSearchedTerm] = React.useState("");

  const sortEntries = React.useCallback((data: DictionaryEntry[]) => {
    return [...data].sort((a, b) => Number(a.s_no) - Number(b.s_no));
  }, []);

  const loadDictionary = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await dictionarySupabase
      .from("dictionary")
      .select("s_no, word, meaning")
      .order("s_no", { ascending: true })
      .range(0, INITIAL_LIMIT - 1);

    if (error) {
      console.error("Dictionary load error:", error);

      setError(
        `Unable to load the legal dictionary. ${error.message || ""}`
      );
      setEntries([]);
    } else {
      setEntries(sortEntries((data ?? []) as DictionaryEntry[]));
    }

    setLoading(false);
  }, [sortEntries]);

  React.useEffect(() => {
    void loadDictionary();
  }, [loadDictionary]);

  const searchDictionary = async () => {
    const term = search.trim();

    if (!term) {
      setSearchedTerm("");
      await loadDictionary();
      return;
    }

    setSearching(true);
    setError(null);

    // Escape characters that can affect PostgREST filter syntax.
    const safeTerm = term
      .replace(/[,%()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const { data, error } = await dictionarySupabase
      .from("dictionary")
      .select("s_no, word, meaning")
      .ilike("word", `%${safeTerm}%`)
      .order("s_no", { ascending: true })
      .limit(SEARCH_LIMIT);

    if (error) {
      console.error("Dictionary search error:", error);

      setError(
        `Unable to search the legal dictionary. ${error.message || ""}`
      );
      setEntries([]);
    } else {
      setEntries(sortEntries((data ?? []) as DictionaryEntry[]));
      setSearchedTerm(term);
    }

    setSearching(false);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void searchDictionary();
    }
  };

  const clearSearch = async () => {
    setSearch("");
    setSearchedTerm("");
    await loadDictionary();
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="container-laws-and-judgments py-10 sm:py-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Legal Dictionary
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Legal Dictionary
          </h1>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Search and understand legal terms and their meanings
            through our structured legal dictionary.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search a legal term..."
              className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-11 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search legal dictionary"
            />

            {search && (
              <button
                type="button"
                onClick={() => void clearSearch()}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => void searchDictionary()}
            disabled={searching}
            className="h-12 rounded-xl bg-primary px-7 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {searchedTerm ? "Search results" : "Dictionary"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {searchedTerm
                ? `${entries.length} ${
                    entries.length === 1 ? "result" : "results"
                  } found for "${searchedTerm}"`
                : "Browse legal terms and their meanings."}
            </p>
          </div>

          {!searchedTerm && (
            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <BookOpen className="h-4 w-4" />
              Legal Terms
            </div>
          )}
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
          <div className="hidden grid-cols-[90px_minmax(180px,0.8fr)_minmax(300px,2fr)] border-b border-border bg-secondary/40 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
            <div>S.No.</div>
            <div>Legal Term</div>
            <div>Meaning</div>
          </div>

          {loading && (
            <div className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="grid gap-3 px-5 py-5 md:grid-cols-[90px_minmax(180px,0.8fr)_minmax(300px,2fr)]"
                >
                  <div className="h-4 w-10 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                </div>
              ))}
            </div>
          )}

          {!loading && entries.length === 0 && !error && (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-foreground">
                No terms found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try searching for another legal term.
              </p>
            </div>
          )}

          {!loading && entries.length > 0 && (
            <div className="divide-y divide-border">
              {entries.map((entry) => (
                <div
                  key={entry.s_no}
                  className="group grid gap-4 px-5 py-5 transition-colors hover:bg-secondary/30 md:grid-cols-[90px_minmax(180px,0.8fr)_minmax(300px,2fr)]"
                >
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-muted-foreground">
                      {entry.s_no}
                    </span>
                  </div>

                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {entry.word}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {entry.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!searchedTerm && !loading && entries.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Showing the first {INITIAL_LIMIT} terms. Use search to find
            specific legal terms.
          </p>
        )}

        {searchedTerm && entries.length === SEARCH_LIMIT && (
          <p className="mt-3 text-xs text-muted-foreground">
            Showing up to {SEARCH_LIMIT} matching results.
          </p>
        )}
      </section>
    </main>
  );
}