"use client";

import * as React from "react";
import {
  Search,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type DictionaryEntry = {
  s_no: number;
  word: string;
  meaning: string;
};

const PAGE_SIZE = 50;

const dictionarySupabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function DictionaryPage() {
  const [search, setSearch] = React.useState("");
  const [searchedTerm, setSearchedTerm] = React.useState("");

  const [entries, setEntries] = React.useState<DictionaryEntry[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);

  const [page, setPage] = React.useState(1);

  const [loading, setLoading] = React.useState(true);
  const [searching, setSearching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(
    null
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const sortEntries = React.useCallback(
    (data: DictionaryEntry[]) =>
      [...data].sort(
        (a, b) => Number(a.s_no) - Number(b.s_no)
      ),
    []
  );

  const fetchDictionary = React.useCallback(
    async (pageNumber: number, term: string) => {
      const from = (pageNumber - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const query = dictionarySupabase
        .from("dictionary")
        .select("s_no, word, meaning", {
          count: "exact",
        })
        .order("s_no", {
          ascending: true,
        })
        .range(from, to);

      if (term) {
        query.ilike("word", `%${term}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Dictionary load error:", error);

        setError(
          `Unable to load the legal dictionary. ${
            error.message || ""
          }`
        );
        setEntries([]);
        setTotalCount(0);
        return;
      }

      setEntries(
        sortEntries((data ?? []) as DictionaryEntry[])
      );

      setTotalCount(count ?? 0);
    },
    [sortEntries]
  );

  const loadDictionary = React.useCallback(
    async (pageNumber = 1, term = "") => {
      setLoading(true);
      setError(null);

      await fetchDictionary(pageNumber, term);

      setLoading(false);
    },
    [fetchDictionary]
  );

  React.useEffect(() => {
    void loadDictionary(1, "");
  }, [loadDictionary]);

  const searchDictionary = async () => {
    const term = search.trim();

    setSelectedIndex(null);
    setPage(1);
    setSearchedTerm(term);

    setSearching(true);
    setError(null);

    await fetchDictionary(1, term);

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
    setSelectedIndex(null);
    setPage(1);

    await loadDictionary(1, "");
  };

  const changePage = async (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === page
    ) {
      return;
    }

    setSelectedIndex(null);
    setPage(nextPage);

    await loadDictionary(
      nextPage,
      searchedTerm
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openEntry = (index: number) => {
    setSelectedIndex(index);
  };

  const closeEntry = () => {
    setSelectedIndex(null);
  };

  const previousEntry = () => {
    if (
      selectedIndex === null ||
      selectedIndex <= 0
    ) {
      return;
    }

    setSelectedIndex(selectedIndex - 1);
  };

  const nextEntry = () => {
    if (
      selectedIndex === null ||
      selectedIndex >= entries.length - 1
    ) {
      return;
    }

    setSelectedIndex(selectedIndex + 1);
  };

  React.useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeEntry();
      }

      if (event.key === "ArrowLeft") {
        previousEntry();
      }

      if (event.key === "ArrowRight") {
        nextEntry();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [selectedIndex, entries.length]);

  const selectedEntry =
    selectedIndex !== null
      ? entries[selectedIndex]
      : null;

  const firstDisplayedNumber =
    totalCount === 0
      ? 0
      : (page - 1) * PAGE_SIZE + 1;

  const lastDisplayedNumber =
    Math.min(page * PAGE_SIZE, totalCount);

  return (
    <main className="min-h-screen bg-background">
      <section className="container-laws-and-judgments py-10 sm:py-12">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Legal Dictionary
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Legal Dictionary
          </h1>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Explore legal terms and open any term to read
            its meaning.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
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

        {/* Section heading */}
        <div className="mt-8 flex items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {searchedTerm
                ? "Search results"
                : "Dictionary"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {totalCount > 0
                ? `${firstDisplayedNumber}–${lastDisplayedNumber} of ${totalCount} terms`
                : "No terms found"}
            </p>
          </div>

          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <BookOpen className="h-4 w-4" />
            <span>50 terms per page</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Dictionary */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
          {loading ? (
            <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
              {Array.from({ length: 18 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    <div className="h-3 w-8 animate-pulse rounded bg-secondary" />

                    <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                  </div>
                )
              )}
            </div>
          ) : entries.length === 0 && !error ? (
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
          ) : (
            <>
              {/* Column header */}
              <div className="hidden grid-cols-[90px_1fr] border-b border-border bg-secondary/40 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
                <div>S.No.</div>
                <div>Legal Term</div>
              </div>

              {/* Dense multi-column dictionary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map((entry, index) => (
                  <button
                    key={entry.s_no}
                    type="button"
                    onClick={() => openEntry(index)}
                    className="group flex min-h-[58px] items-center gap-3 border-b border-border px-5 py-3 text-left transition-colors hover:bg-secondary/40 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:nth-[2n]:border-r-0 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n+1)]:border-r"
                  >
                    <span className="w-10 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                      {entry.s_no}
                    </span>

                    <span className="min-w-0 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {entry.word}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {firstDisplayedNumber}–{lastDisplayedNumber}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {totalCount}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  void changePage(page - 1)
                }
                disabled={page === 1}
                className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex h-9 min-w-16 items-center justify-center rounded-lg bg-secondary px-3 text-sm font-medium text-foreground">
                {page} / {totalPages}
              </div>

              <button
                type="button"
                onClick={() =>
                  void changePage(page + 1)
                }
                disabled={page === totalPages}
                className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Entry modal */}
        {selectedEntry && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeEntry();
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="dictionary-entry-title"
              className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            >
              {/* Modal header */}
              <div className="flex items-start justify-between gap-5 border-b border-border px-6 py-5">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    Legal Term
                  </p>

                  <h2
                    id="dictionary-entry-title"
                    className="mt-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                  >
                    {selectedEntry.word}
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    S.No. {selectedEntry.s_no}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEntry}
                  aria-label="Close"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Meaning */}
              <div className="overflow-y-auto px-6 py-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Meaning
                </p>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground sm:text-base">
                  {selectedEntry.meaning}
                </p>
              </div>

              {/* Modal navigation */}
              <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-6 py-4">
                <button
                  type="button"
                  onClick={previousEntry}
                  disabled={
                    selectedIndex === 0
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <span className="text-xs text-muted-foreground">
                  {selectedIndex !== null
                    ? `${selectedIndex + 1} of ${entries.length}`
                    : ""}
                </span>

                <button
                  type="button"
                  onClick={nextEntry}
                  disabled={
                    selectedIndex ===
                    entries.length - 1
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}