import { fetcher } from "@/lib/api/fetcher";
import type {
  JudgmentSearchParams,
  JudgmentSearchResponse,
} from "@/types/search";

const API_BASE = "/api/judgments";

export async function searchJudgments(
  params: JudgmentSearchParams
): Promise<JudgmentSearchResponse> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      query.append(key, String(value));
    }
  });

  return fetcher<JudgmentSearchResponse>(
    `${API_BASE}/search?${query.toString()}`
  );
}

export async function getJudgment(id: string) {
  return fetcher(`${API_BASE}/${id}`);
}

export async function getRelatedJudgments(id: string) {
  return fetcher(`${API_BASE}/${id}/related`);
}