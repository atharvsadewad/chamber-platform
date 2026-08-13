import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      {
        success: false,
        error: "INVALID_QUERY",
        message: "Search query is required.",
      },
      {
        status: 400,
      }
    );
  }

  if (!env.indianKanoonApiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "API_KEY_MISSING",
        message:
          "Indian Kanoon API key has not been configured.",
      },
      {
        status: 501,
      }
    );
  }

  /*
    Next Batch

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