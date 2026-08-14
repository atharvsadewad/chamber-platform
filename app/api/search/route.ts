import { NextResponse } from "next/server";
import { chamberSupabase } from "@/lib/chamberSupabase";

type SearchMode =
  | "act_name"
  | "section"
  | "year"
  | "act_number"
  | "subject";

type SearchResult = {
  id: number;
  act_id?: number;
  section?: string;
  title?: string;
  content?: string;
  description?: string;

  act_name?: string;
  short_name?: string;
  year?: number;
  act_number?: string;
  subject?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.trim();
  const mode = searchParams.get(
    "mode"
  ) as SearchMode | null;

  if (!query) {
    return NextResponse.json(
      {
        success: false,
        error: "Search query is required",
      },
      { status: 400 }
    );
  }

  /*
   * ---------------------------------------------------------
   * FILTER 1: ACT NAME
   * ---------------------------------------------------------
   */

  if (mode === "act_name") {
    const { data, error } = await chamberSupabase
      .from("acts")
      .select(
        "id, act_name, short_name, year, act_number, description, subject, instrument_type, source, source_url"
      )
      .ilike("act_name", `%${query}%`)
      .order("act_name", {
        ascending: true,
      })
      .limit(50);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: data?.length ?? 0,
      data: data ?? [],
    });
  }

  /*
   * ---------------------------------------------------------
   * FILTERS 2-5
   *
   * These fields belong to the acts table except Section,
   * which belongs to act_sections.
   * ---------------------------------------------------------
   */

  if (
    mode === "year" ||
    mode === "act_number" ||
    mode === "subject"
  ) {
    let data: SearchResult[] = [];
    let error: { message: string } | null = null;

    if (mode === "year") {
      const numericYear = Number(query);

      if (Number.isNaN(numericYear)) {
        return NextResponse.json({
          success: true,
          count: 0,
          data: [],
        });
      }

      const response = await chamberSupabase
        .from("acts")
        .select(
          "id, act_name, short_name, year, act_number, description, subject, instrument_type, source, source_url"
        )
        .eq("year", numericYear)
        .order("act_name", {
          ascending: true,
        })
        .limit(50);

      data = response.data ?? [];
      error = response.error;
    }

    if (mode === "act_number") {
      const response = await chamberSupabase
        .from("acts")
        .select(
          "id, act_name, short_name, year, act_number, description, subject, instrument_type, source, source_url"
        )
        .ilike(
          "act_number",
          `%${query}%`
        )
        .order("act_name", {
          ascending: true,
        })
        .limit(50);

      data = response.data ?? [];
      error = response.error;
    }

    if (mode === "subject") {
      const response = await chamberSupabase
        .from("acts")
        .select(
          "id, act_name, short_name, year, act_number, description, subject, instrument_type, source, source_url"
        )
        .ilike(
          "subject",
          `%${query}%`
        )
        .order("act_name", {
          ascending: true,
        })
        .limit(50);

      data = response.data ?? [];
      error = response.error;
    }

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
    });
  }

  /*
   * ---------------------------------------------------------
   * FILTER 2: SECTION
   * ---------------------------------------------------------
   */

  if (mode === "section") {
    const { data, error } = await chamberSupabase
      .from("act_sections")
      .select(
        "id, act_id, section, title, content, description"
      )
      .ilike(
        "section",
        `%${query}%`
      )
      .limit(100);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    /*
     * Get corresponding Act information so result cards
     * can display the actual Act name instead of hardcoded BNS.
     */

    const actIds = [
      ...new Set(
        (data ?? []).map(
          (item) => item.act_id
        )
      ),
    ];

    let actsMap = new Map<
      number,
      {
        act_name?: string;
        short_name?: string;
        year?: number;
        act_number?: string;
        subject?: string;
      }
    >();

    if (actIds.length > 0) {
      const {
        data: acts,
        error: actsError,
      } = await chamberSupabase
        .from("acts")
        .select(
          "id, act_name, short_name, year, act_number, subject"
        )
        .in("id", actIds);

      if (actsError) {
        return NextResponse.json(
          {
            success: false,
            error: actsError.message,
          },
          { status: 500 }
        );
      }

      actsMap = new Map(
        (acts ?? []).map((act) => [
          act.id,
          {
            act_name: act.act_name,
            short_name: act.short_name,
            year: act.year,
            act_number: act.act_number,
            subject: act.subject,
          },
        ])
      );
    }

    const results = (data ?? []).map(
      (section) => {
        const act = actsMap.get(
          section.act_id
        );

        return {
          ...section,
          act_name: act?.act_name,
          short_name: act?.short_name,
          year: act?.year,
          act_number: act?.act_number,
          subject: act?.subject,
        };
      }
    );

    /*
     * Exact section number gets priority.
     *
     * Example:
     * Searching "103" should show section 103 before
     * section 103A / 103B / 1103 etc.
     */

    const normalizedQuery =
      query.toLowerCase();

    results.sort((a, b) => {
      const aSection = String(
        a.section ?? ""
      ).toLowerCase();

      const bSection = String(
        b.section ?? ""
      ).toLowerCase();

      const aExact =
        aSection === normalizedQuery;

      const bExact =
        bSection === normalizedQuery;

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts =
        aSection.startsWith(
          normalizedQuery
        );

      const bStarts =
        bSection.startsWith(
          normalizedQuery
        );

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return 0;
    });

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results.slice(0, 50),
    });
  }

  /*
   * ---------------------------------------------------------
   * NO FILTER SELECTED
   *
   * Keep your existing broad/global search behaviour.
   * ---------------------------------------------------------
   */

  const searchTerm = `%${query}%`;

  const [
    { data: sectionData, error: sectionError },
    { data: titleData, error: titleError },
    { data: descriptionData, error: descriptionError },
    { data: contentData, error: contentError },
  ] = await Promise.all([
    chamberSupabase
      .from("act_sections")
      .select(
        "id, act_id, section, title, content, description"
      )
      .ilike("section", searchTerm)
      .limit(100),

    chamberSupabase
      .from("act_sections")
      .select(
        "id, act_id, section, title, content, description"
      )
      .ilike("title", searchTerm)
      .limit(100),

    chamberSupabase
      .from("act_sections")
      .select(
        "id, act_id, section, title, content, description"
      )
      .ilike("description", searchTerm)
      .limit(100),

    chamberSupabase
      .from("act_sections")
      .select(
        "id, act_id, section, title, content, description"
      )
      .ilike("content", searchTerm)
      .limit(100),
  ]);

  const error =
    sectionError ||
    titleError ||
    descriptionError ||
    contentError;

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  const candidates = new Map<
    number,
    SearchResult
  >();

  const allData = [
    ...(sectionData ?? []),
    ...(titleData ?? []),
    ...(descriptionData ?? []),
    ...(contentData ?? []),
  ];

  for (const item of allData) {
    candidates.set(item.id, item);
  }

  const normalizedQuery =
    query.toLowerCase();

  const words = normalizedQuery
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  function countOccurrences(
    text: string,
    word: string
  ) {
    if (!text || !word) return 0;

    let count = 0;
    let position = 0;

    while (
      (position = text.indexOf(
        word,
        position
      )) !== -1
    ) {
      count++;
      position += word.length;
    }

    return count;
  }

  function calculateScore(
    item: SearchResult
  ) {
    const section = String(
      item.section ?? ""
    ).toLowerCase();

    const title = String(
      item.title ?? ""
    ).toLowerCase();

    const description = String(
      item.description ?? ""
    ).toLowerCase();

    const content = String(
      item.content ?? ""
    ).toLowerCase();

    let score = 0;

    if (
      section === normalizedQuery
    ) {
      score += 1000;
    } else if (
      section.startsWith(
        normalizedQuery
      )
    ) {
      score += 700;
    } else if (
      section.includes(
        normalizedQuery
      )
    ) {
      score += 500;
    }

    if (
      title === normalizedQuery
    ) {
      score += 900;
    } else if (
      title.startsWith(
        normalizedQuery
      )
    ) {
      score += 750;
    } else if (
      title.includes(
        normalizedQuery
      )
    ) {
      score += 600;
    }

    if (
      description ===
      normalizedQuery
    ) {
      score += 450;
    } else if (
      description.includes(
        normalizedQuery
      )
    ) {
      score += 300;
    }

    if (
      content.includes(
        normalizedQuery
      )
    ) {
      score += 100;

      score += Math.min(
        countOccurrences(
          content,
          normalizedQuery
        ) * 5,
        50
      );
    }

    for (const word of words) {
      if (word.length < 2) continue;

      if (section.includes(word)) {
        score += 150;
      }

      if (title.includes(word)) {
        score += 120;
      }

      if (
        description.includes(word)
      ) {
        score += 50;
      }

      if (content.includes(word)) {
        score += 10;
      }
    }

    return score;
  }

  const results = Array.from(
    candidates.values()
  )
    .map((item) => ({
      ...item,
      _score: calculateScore(item),
    }))
    .sort(
      (a, b) =>
        b._score - a._score
    )
    .slice(0, 50)
    .map(
      ({
        _score,
        ...item
      }) => item
    );

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}