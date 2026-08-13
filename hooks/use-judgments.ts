"use client";

import { useCallback, useState } from "react";

import { searchJudgments } from "@/services/judgments.service";

import type {
  JudgmentSearchParams,
  JudgmentSearchResponse,
} from "@/types/search";

const INITIAL_FILTERS = {
  query: "",
  court: "",
  fromYear: "",
  toYear: "",
  bench: "",
  sort: "relevance",
};

export function useJudgments() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [data, setData] =
    useState<JudgmentSearchResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const search = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: JudgmentSearchParams = {
        query: filters.query || undefined,
        court: filters.court || undefined,
        bench: filters.bench || undefined,
        sort: filters.sort as
          | "relevance"
          | "newest"
          | "oldest",

        fromYear: filters.fromYear
          ? Number(filters.fromYear)
          : undefined,

        toYear: filters.toYear
          ? Number(filters.toYear)
          : undefined,

        page: 1,
        pageSize: 20,
      };

      const response = await searchJudgments(params);

      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return {
    filters,
    setFilters,

    data,

    loading,

    error,

    search,
  };
}