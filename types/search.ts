import type { Judgment } from "./judgment";

export interface JudgmentSearchParams {
  query?: string;

  court?: string;

  fromYear?: number;

  toYear?: number;

  bench?: string;

  sort?: "relevance" | "newest" | "oldest";

  page?: number;

  pageSize?: number;
}

export interface Pagination {
  page: number;

  pageSize: number;

  totalResults: number;

  totalPages: number;
}

export interface JudgmentSearchResponse {
  results: Judgment[];

  pagination: Pagination;

  searchTime: number;

  suggestions?: string[];
}