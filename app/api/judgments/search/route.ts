import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json(
      {
        success: false,
        error: "INVALID_QUERY",
        message: "Search query is required.",
      },
      {
        status: 400,
      },
    );
  }

  /*
   * Provider integration will be connected here.
   *
   * The provider itself is intentionally not exposed to the client.
   */

  if (!env.indianKanoonApiKey) {
    console.error(
      "Judgment search service is unavailable: provider API key is not configured.",
    );

    return NextResponse.json(
      {
        success: false,
        error: "SEARCH_SERVICE_UNAVAILABLE",
        message:
          "Search is temporarily unavailable. Please try again later.",
      },
      {
        status: 503,
      },
    );
  }

  /*
   * Next step:
   *
   * const response = await indianKanoon.search(...)
   *
   * Then normalize the provider response into our own
   * ResearchResult structure before returning it.
   */

  return NextResponse.json({
    success: true,
    data: {
      results: [],
      pagination: {
        page: 1,
        pageSize: 20,
        totalResults: 0,
        totalPages: 0,
      },
      searchTime: 0,
    },
  });
}