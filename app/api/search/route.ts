import { NextResponse } from "next/server";

import { chamberSupabase } from "@/lib/chamberSupabase";

type SearchMode =
  | "all"
  | "act_name"
  | "section"
  | "year"
  | "act_number"
  | "subject";

const ACT_SELECT =
  "id, act_name, short_name, year, act_number, description, subject, instrument_type, source, source_url";

const SECTION_SELECT =
  "id, act_id, section, title, content, description";

export async function GET(
  request: Request,
) {
  const { searchParams } =
    new URL(request.url);

  const query =
    searchParams.get("q")?.trim();

  const mode =
    (searchParams.get(
      "mode",
    ) as SearchMode | null) || "all";

  if (!query) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Search query is required",
      },
      { status: 400 },
    );
  }

  try {
    /*
     * -------------------------------------------------------
     * UNIVERSAL SEARCH
     * -------------------------------------------------------
     *
     * Uses the same Chamber database pipeline.
     * No separate database or new search service.
     */
    if (mode === "all") {
      const [
        actsResponse,
        sectionsResponse,
      ] = await Promise.all([
        chamberSupabase
          .from("acts")
          .select(ACT_SELECT)
          .or(
            `act_name.ilike.%${query}%,short_name.ilike.%${query}%,description.ilike.%${query}%,subject.ilike.%${query}%`,
          )
          .order("act_name", {
            ascending: true,
          })
          .limit(25),

        chamberSupabase
          .from("act_sections")
          .select(SECTION_SELECT)
          .or(
            `section.ilike.%${query}%,title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`,
          )
          .order("section", {
            ascending: true,
          })
          .limit(25),
      ]);

      if (actsResponse.error) {
        throw actsResponse.error;
      }

      if (sectionsResponse.error) {
        throw sectionsResponse.error;
      }

      const acts = (
        actsResponse.data ?? []
      ).map((item) => ({
        ...item,
        type: "act" as const,
      }));

      const sections = (
        sectionsResponse.data ?? []
      ).map((item) => ({
        ...item,
        type: "section" as const,
      }));

      const data = [
        ...sections,
        ...acts,
      ];

      return NextResponse.json({
        success: true,
        count: data.length,
        data,
      });
    }

    /*
     * -------------------------------------------------------
     * ACT NAME
     * -------------------------------------------------------
     */
    if (mode === "act_name") {
      const { data, error } =
        await chamberSupabase
          .from("acts")
          .select(ACT_SELECT)
          .or(
            `act_name.ilike.%${query}%,short_name.ilike.%${query}%`,
          )
          .order("act_name", {
            ascending: true,
          })
          .limit(50);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        count: data?.length ?? 0,
        data: data ?? [],
      });
    }

    /*
     * -------------------------------------------------------
     * SECTION
     * -------------------------------------------------------
     */
    if (mode === "section") {
      const { data, error } =
        await chamberSupabase
          .from("act_sections")
          .select(
            `${SECTION_SELECT}, acts:act_id (id, act_name, short_name, year, act_number, subject)`,
          )
          .or(
            `section.ilike.%${query}%,title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`,
          )
          .order("section", {
            ascending: true,
          })
          .limit(50);

      if (error) {
        throw error;
      }

      const normalized = (
        data ?? []
      ).map((item) => {
        const parent =
          Array.isArray(item.acts)
            ? item.acts[0]
            : item.acts;

        return {
          ...item,
          act_name:
            parent?.act_name ?? null,
          short_name:
            parent?.short_name ?? null,
          year:
            parent?.year ?? null,
          act_number:
            parent?.act_number ?? null,
          subject:
            parent?.subject ?? null,
        };
      });

      return NextResponse.json({
        success: true,
        count: normalized.length,
        data: normalized,
      });
    }

    /*
     * -------------------------------------------------------
     * YEAR
     * -------------------------------------------------------
     */
    if (mode === "year") {
      const numericYear =
        Number(query);

      if (
        !Number.isInteger(
          numericYear,
        )
      ) {
        return NextResponse.json({
          success: true,
          count: 0,
          data: [],
        });
      }

      const { data, error } =
        await chamberSupabase
          .from("acts")
          .select(ACT_SELECT)
          .eq("year", numericYear)
          .order("act_name", {
            ascending: true,
          })
          .limit(50);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        count: data?.length ?? 0,
        data: data ?? [],
      });
    }

    /*
     * -------------------------------------------------------
     * ACT NUMBER
     * -------------------------------------------------------
     */
    if (mode === "act_number") {
      const { data, error } =
        await chamberSupabase
          .from("acts")
          .select(ACT_SELECT)
          .ilike(
            "act_number",
            `%${query}%`,
          )
          .order("act_name", {
            ascending: true,
          })
          .limit(50);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        count: data?.length ?? 0,
        data: data ?? [],
      });
    }

    /*
     * -------------------------------------------------------
     * SUBJECT
     * -------------------------------------------------------
     */
    if (mode === "subject") {
      const { data, error } =
        await chamberSupabase
          .from("acts")
          .select(ACT_SELECT)
          .ilike(
            "subject",
            `%${query}%`,
          )
          .order("act_name", {
            ascending: true,
          })
          .limit(50);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
        count: data?.length ?? 0,
        data: data ?? [],
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unsupported search mode.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error(
      "Chamber search error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to complete the search.",
      },
      { status: 500 },
    );
  }
}