"use client";

import { useState } from "react";

import { ResearchLayout } from "@/components/research/research-layout";
import { ResearchSidebar } from "@/components/research/research-sidebar";
import {
  ResearchSearch,
  type SearchMode,
} from "@/components/research/research-search";
import {
  ResearchResults,
  type ResearchResult,
} from "@/components/research/research-results";
import { ResearchAIPanel } from "@/components/research/research-ai-panel";
import { ResearchFilters } from "@/components/research/research-filters";

export default function ResearchPage() {
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] =
    useState<SearchMode>("all");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  function handleModeChange(mode: SearchMode) {
    /*
     * "All" is the default universal search mode.
     * If the component ever sends null, fall back to "all"
     * instead of allowing the page state to become invalid.
     */
    setSearchMode(mode ?? "all");
    setError("");
  }

  async function handleSearch(
    searchQuery: string,
    mode: SearchMode,
  ) {
    const trimmedQuery = searchQuery.trim();

    /*
     * Normalize null to universal search.
     */
    const activeMode: Exclude<SearchMode, null> =
      mode ?? "all";

    setSearchMode(activeMode);

    if (!trimmedQuery) {
      setResults([]);
      setQuery("");
      setSearched(false);
      setError("");
      return;
    }

    setQuery(trimmedQuery);
    setSearched(true);
    setLoading(true);
    setError("");
    setResults([]);

    try {
      let response: Response;

      /*
       * -------------------------------------------------------
       * UNIVERSAL SEARCH
       * -------------------------------------------------------
       *
       * Searches across the legal material database without
       * requiring the user to select a category first.
       */
      if (activeMode === "all") {
        response = await fetch(
          `/api/search?q=${encodeURIComponent(
            trimmedQuery,
          )}&mode=all`,
          {
            method: "GET",
            cache: "no-store",
          },
        );
      }

      /*
       * -------------------------------------------------------
       * JUDGMENT SEARCH
       * -------------------------------------------------------
       *
       * Keyword, Party Name and Citation currently use the
       * judgment search service.
       */
      else if (
        activeMode === "keyword" ||
        activeMode === "party" ||
        activeMode === "citation"
      ) {
        response = await fetch(
          `/api/judgments/search?query=${encodeURIComponent(
            trimmedQuery,
          )}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );
      }

      /*
       * -------------------------------------------------------
       * BARE ACT / SECTION SEARCH
       * -------------------------------------------------------
       */
      else {
        const apiMode =
          activeMode === "bare-act"
            ? "act_name"
            : "section";

        response = await fetch(
          `/api/search?q=${encodeURIComponent(
            trimmedQuery,
          )}&mode=${apiMode}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );
      }

      const payload = await response.json();

      if (!response.ok || payload.success === false) {
        throw new Error(
          payload.message ||
            payload.error ||
            "Unable to complete the search.",
        );
      }

      /*
       * -------------------------------------------------------
       * UNIVERSAL SEARCH RESULTS
       * -------------------------------------------------------
       *
       * The backend may return mixed legal material.
       */
      if (activeMode === "all") {
        const universalResults = Array.isArray(
          payload.data,
        )
          ? payload.data
          : Array.isArray(payload.data?.results)
            ? payload.data.results
            : [];

        setResults(
          universalResults.map(
            (
              item: Record<string, unknown>,
              index: number,
            ) => {
              const type = String(
                item.type ??
                  item.result_type ??
                  "act",
              ).toLowerCase();

              return {
                id: String(
                  item.id ??
                    item.document_id ??
                    item.act_id ??
                    index,
                ),

                type:
                  type === "judgment"
                    ? "judgment"
                    : type === "section"
                      ? "section"
                      : "act",

                title: String(
                  item.title ??
                    item.name ??
                    item.act_name ??
                    "Untitled",
                ),

                source: String(
                  item.source ??
                    item.court ??
                    (type === "judgment"
                      ? "Judgment"
                      : type === "section"
                        ? "Section"
                        : "Bare Act"),
                ),

                year: String(
                  item.year ??
                    item.date ??
                    "",
                ),

                summary: String(
                  item.summary ??
                    item.description ??
                    item.content ??
                    item.snippet ??
                    "",
                ),

                tags: item.subject
                  ? [String(item.subject)]
                  : [],

                section: item.section
                  ? String(item.section)
                  : undefined,

                actName: item.act_name
                  ? String(item.act_name)
                  : undefined,

                actNumber: item.act_number
                  ? String(item.act_number)
                  : undefined,
              };
            },
          ),
        );
      }

      /*
       * -------------------------------------------------------
       * JUDGMENT RESULTS
       * -------------------------------------------------------
       */
      else if (
        activeMode === "keyword" ||
        activeMode === "party" ||
        activeMode === "citation"
      ) {
        const judgmentResults = Array.isArray(
          payload.data?.results,
        )
          ? payload.data.results
          : [];

        setResults(
          judgmentResults.map(
            (
              item: Record<string, unknown>,
              index: number,
            ) => ({
              id: String(
                item.id ??
                  item.docid ??
                  item.document_id ??
                  index,
              ),

              type: "judgment",

              title: String(
                item.title ??
                  item.name ??
                  "Untitled judgment",
              ),

              source: String(
                item.court ??
                  item.source ??
                  "Judgment",
              ),

              year: String(
                item.year ??
                  item.date ??
                  "",
              ),

              summary: String(
                item.summary ??
                  item.description ??
                  item.snippet ??
                  "",
              ),

              tags: [],
            }),
          ),
        );
      }

      /*
       * -------------------------------------------------------
       * BARE ACT / SECTION RESULTS
       * -------------------------------------------------------
       */
      else {
        const actResults = Array.isArray(
          payload.data,
        )
          ? payload.data
          : [];

        setResults(
          actResults.map(
            (
              item: Record<string, unknown>,
              index: number,
            ) => ({
              id: String(
                item.id ??
                  item.act_id ??
                  index,
              ),

              type:
                activeMode === "section"
                  ? "section"
                  : "act",

              title: String(
                item.title ??
                  item.act_name ??
                  "Untitled",
              ),

              source:
                activeMode === "section"
                  ? "Section"
                  : "Bare Act",

              year: String(
                item.year ?? "",
              ),

              summary: String(
                item.description ??
                  item.content ??
                  "",
              ),

              tags: item.subject
                ? [String(item.subject)]
                : [],

              section: item.section
                ? String(item.section)
                : undefined,

              actName: item.act_name
                ? String(item.act_name)
                : undefined,

              actNumber: item.act_number
                ? String(item.act_number)
                : undefined,
            }),
          ),
        );
      }
    } catch (searchError) {
      console.error(
        "Research search error:",
        searchError,
      );

      setResults([]);

      setError(
        searchError instanceof Error
          ? searchError.message
          : "Unable to complete the search.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setResults([]);
    setQuery("");
    setSearched(false);
    setError("");

    /*
     * Return the research interface to Universal Search
     * after clearing the current research session.
     */
    setSearchMode("all");
  }

  return (
    <ResearchLayout
      sidebar={<ResearchSidebar />}
      assistant={<ResearchAIPanel />}
      content={
        <div className="space-y-8">
          <ResearchSearch
            query={query}
            searchMode={searchMode}
            onSearch={handleSearch}
            onModeChange={handleModeChange}
            onClear={handleClear}
            loading={loading}
          />

          <ResearchResults
            results={results}
            query={query}
            searchMode={searchMode}
            loading={loading}
            searched={searched}
            error={error}
            onClear={handleClear}
          />

          <ResearchFilters
            visible={
              searched && results.length > 0
            }
          />
        </div>
      }
    />
  );
}