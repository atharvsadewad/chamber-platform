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
    Next Batch

    The judgment search provider integration will be
    connected here.

    const response =
      await indianKanoon.search(...)
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