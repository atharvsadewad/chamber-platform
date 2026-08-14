"use client";

import { useState } from "react";

import { ResearchLayout } from "@/components/research/research-layout";
import { ResearchSidebar } from "@/components/research/research-sidebar";
import { ResearchSearch, type SearchMode } from "@/components/research/research-search";
import { ResearchResults, type ResearchResult } from "@/components/research/research-results";
import { ResearchAIPanel } from "@/components/research/research-ai-panel";
import { ResearchFilters } from "@/components/research/research-filters";

export default function ResearchPage() {
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("keyword");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(
    searchQuery: string,
    mode: SearchMode,
  ) {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setResults([]);
      setQuery("");
      setSearched(false);
      setError("");
      return;
    }

    setQuery(trimmedQuery);
    setSearchMode(mode);
    setSearched(true);
    setLoading(true);
    setError("");
    setResults([]);

    try {
      let response: Response;

      /*
       * Judgment search is already represented by the existing
       * judgment API. The backend currently returns an empty result
       * set until the Indian Kanoon integration is completed.
       */
      if (
        mode === "keyword" ||
        mode === "party" ||
        mode === "citation"
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
      } else {
        /*
         * Existing Chamber search API.
         *
         * Bare Act / Section and Subject are already supported
         * by /api/search.
         */
        let apiMode: "act_name" | "section" | "subject";

        if (mode === "bare-act") {
          apiMode = "act_name";
        } else if (mode === "section") {
          apiMode = "section";
        } else {
          apiMode = "subject";
        }

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
       * Normalize the two current backend response shapes into
       * the single shape consumed by the Research results UI.
       */
      if (
        mode === "keyword" ||
        mode === "party" ||
        mode === "citation"
      ) {
        const judgmentResults = Array.isArray(
          payload.data?.results,
        )
          ? payload.data.results
          : [];

        setResults(
          judgmentResults.map(
            (item: Record<string, unknown>, index: number) => ({
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
      } else {
        const actResults = Array.isArray(payload.data)
          ? payload.data
          : [];

        setResults(
          actResults.map(
            (
              item: Record<string, unknown>,
              index: number,
            ) => ({
              id: String(item.id ?? index),
              type:
                mode === "section"
                  ? "section"
                  : "act",
              title: String(
                item.title ??
                  item.act_name ??
                  "Untitled",
              ),
              source:
                mode === "section"
                  ? "Section"
                  : "Bare Act",
              year: String(item.year ?? ""),
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
      console.error("Research search error:", searchError);

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
            visible={searched && results.length > 0}
          />
        </div>
      }
    />
  );
}