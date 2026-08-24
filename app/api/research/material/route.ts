import { NextResponse } from "next/server";

import { chamberSupabase } from "@/lib/chamberSupabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json(
      {
        success: false,
        error: "INVALID_REQUEST",
        message: "Material type and ID are required.",
      },
      { status: 400 },
    );
  }

  if (!["act", "section"].includes(type)) {
    return NextResponse.json(
      {
        success: false,
        error: "UNSUPPORTED_TYPE",
        message: "This material type is not supported yet.",
      },
      { status: 400 },
    );
  }

  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: "INVALID_ID",
        message: "The requested material ID is invalid.",
      },
      { status: 400 },
    );
  }

  /*
   * ---------------------------------------------------------
   * ACT
   * ---------------------------------------------------------
   *
   * The Act response also contains a lightweight list of its
   * sections. Full section content is fetched only when the
   * user opens a section.
   *
   * This keeps the same material API pipeline while avoiding
   * unnecessary loading of every provision's full text.
   */
  if (type === "act") {
    const { data: act, error: actError } =
      await chamberSupabase
        .from("acts")
        .select(
          "id, act_name, short_name, year, act_number, description, subject, instrument_type, source, source_url",
        )
        .eq("id", numericId)
        .maybeSingle();

    if (actError) {
      console.error("Act lookup error:", actError);

      return NextResponse.json(
        {
          success: false,
          error: "ACT_LOOKUP_FAILED",
          message: "Unable to load this Bare Act.",
        },
        { status: 500 },
      );
    }

    if (!act) {
      return NextResponse.json(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Bare Act not found.",
        },
        { status: 404 },
      );
    }

    const { data: sections, error: sectionsError } =
      await chamberSupabase
        .from("act_sections")
        .select(
          "id, act_id, section, title, description",
        )
        .eq("act_id", numericId)
        .order("id", {
          ascending: true,
        });

    if (sectionsError) {
      console.error(
        "Act sections lookup error:",
        sectionsError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "SECTIONS_LOOKUP_FAILED",
          message: "Unable to load the sections of this Act.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        act,
        sections: sections ?? [],
      },
    });
  }

  /*
   * ---------------------------------------------------------
   * SECTION
   * ---------------------------------------------------------
   *
   * Full provision content is fetched only when the user
   * opens a specific section.
   */
  const { data: section, error: sectionError } =
    await chamberSupabase
      .from("act_sections")
      .select(
        "id, act_id, section, title, content, description",
      )
      .eq("id", numericId)
      .maybeSingle();

  if (sectionError) {
    console.error(
      "Section lookup error:",
      sectionError,
    );

    return NextResponse.json(
      {
        success: false,
        error: "SECTION_LOOKUP_FAILED",
        message: "Unable to load this section.",
      },
      { status: 500 },
    );
  }

  if (!section) {
    return NextResponse.json(
      {
        success: false,
        error: "NOT_FOUND",
        message: "Section not found.",
      },
      { status: 404 },
    );
  }

  let act = null;

  if (section.act_id) {
    const { data: actData, error: actError } =
      await chamberSupabase
        .from("acts")
        .select(
          "id, act_name, short_name, year, act_number, subject, instrument_type, source, source_url",
        )
        .eq("id", section.act_id)
        .maybeSingle();

    if (actError) {
      console.error(
        "Section Act lookup error:",
        actError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "ACT_LOOKUP_FAILED",
          message: "Unable to load the parent Act.",
        },
        { status: 500 },
      );
    }

    act = actData;
  }

  return NextResponse.json({
    success: true,
    data: {
      section,
      act,
    },
  });
}