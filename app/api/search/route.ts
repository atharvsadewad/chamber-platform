import { NextResponse } from "next/server";
import { chamberSupabase } from "@/lib/chamberSupabase";

type SectionResult = {
  id: number;
  act_id: number;
  section: string;
  title: string;
  content: string;
  description: string;
};

type ScoredResult = SectionResult & {
  _score: number;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      {
        success: false,
        error: "Search query is required",
      },
      { status: 400 }
    );
  }

  const searchTerm = `%${query}%`;
  const isNumericSection = /^\d+$/.test(query);

  /*
   * ---------------------------------------------------------
   * 1. Fetch candidates separately by field
   * ---------------------------------------------------------
   *
   * We deliberately search fields separately instead of using
   * one giant OR query. This gives us control over relevance.
   */

  const [
    { data: sectionData, error: sectionError },
    { data: titleData, error: titleError },
    { data: descriptionData, error: descriptionError },
    { data: contentData, error: contentError },
  ] = await Promise.all([
    chamberSupabase
      .from("act_sections")
      .select("id, act_id, section, title, content, description")
      .ilike("section", searchTerm)
      .limit(100),

    chamberSupabase
      .from("act_sections")
      .select("id, act_id, section, title, content, description")
      .ilike("title", searchTerm)
      .limit(100),

    chamberSupabase
      .from("act_sections")
      .select("id, act_id, section, title, content, description")
      .ilike("description", searchTerm)
      .limit(100),

    chamberSupabase
      .from("act_sections")
      .select("id, act_id, section, title, content, description")
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

  /*
   * ---------------------------------------------------------
   * 2. Merge all candidates
   * ---------------------------------------------------------
   */

  const candidates = new Map<number, SectionResult>();

  const allData = [
    ...(sectionData ?? []),
    ...(titleData ?? []),
    ...(descriptionData ?? []),
    ...(contentData ?? []),
  ];

  for (const item of allData) {
    candidates.set(item.id, item);
  }

  /*
   * ---------------------------------------------------------
   * 3. Relevance scoring
   * ---------------------------------------------------------
   */

  const normalizedQuery = query.toLowerCase();

  const words = normalizedQuery
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  function countOccurrences(text: string, word: string) {
    if (!text || !word) return 0;

    const normalizedText = text.toLowerCase();

    let count = 0;
    let position = 0;

    while ((position = normalizedText.indexOf(word, position)) !== -1) {
      count++;
      position += word.length;
    }

    return count;
  }

  function calculateScore(item: SectionResult): number {
    const section = String(item.section ?? "").toLowerCase();
    const title = String(item.title ?? "").toLowerCase();
    const description = String(item.description ?? "").toLowerCase();
    const content = String(item.content ?? "").toLowerCase();

    let score = 0;

    /*
     * -------------------------------------------------------
     * SECTION
     * Highest priority
     * -------------------------------------------------------
     */

    if (section === normalizedQuery) {
      score += 1000;
    } else if (section.startsWith(normalizedQuery)) {
      score += 700;
    } else if (section.includes(normalizedQuery)) {
      score += 500;
    }

    /*
     * -------------------------------------------------------
     * TITLE
     * Very high priority
     * -------------------------------------------------------
     */

    if (title === normalizedQuery) {
      score += 900;
    } else if (title.startsWith(normalizedQuery)) {
      score += 750;
    } else if (title.includes(normalizedQuery)) {
      score += 600;
    }

    /*
     * -------------------------------------------------------
     * DESCRIPTION
     * -------------------------------------------------------
     */

    if (description === normalizedQuery) {
      score += 450;
    } else if (description.includes(normalizedQuery)) {
      score += 300;
    }

    /*
     * -------------------------------------------------------
     * CONTENT
     * Lowest priority
     * -------------------------------------------------------
     */

    if (content.includes(normalizedQuery)) {
      score += 100;

      // Small bonus for repeated meaningful matches
      score += Math.min(
        countOccurrences(content, normalizedQuery) * 5,
        50
      );
    }

    /*
     * -------------------------------------------------------
     * MULTI-WORD SEARCH
     *
     * Give additional relevance when individual words appear
     * in important fields.
     * -------------------------------------------------------
     */

    for (const word of words) {
      if (word.length < 2) continue;

      if (section.includes(word)) {
        score += 150;
      }

      if (title.includes(word)) {
        score += 120;
      }

      if (description.includes(word)) {
        score += 50;
      }

      if (content.includes(word)) {
        score += 10;
      }
    }

    return score;
  }

  /*
   * ---------------------------------------------------------
   * 4. Score every candidate
   * ---------------------------------------------------------
   */

  let results: ScoredResult[] = Array.from(candidates.values()).map(
    (item) => ({
      ...item,
      _score: calculateScore(item),
    })
  );

  /*
   * ---------------------------------------------------------
   * 5. Numeric section searches get special treatment
   * ---------------------------------------------------------
   *
   * Example:
   * q=103
   *
   * Section 103 must come first.
   */

  if (isNumericSection) {
    results.sort((a, b) => {
      const aExact = String(a.section) === query;
      const bExact = String(b.section) === query;

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      return b._score - a._score;
    });
  } else {
    /*
     * Normal keyword search
     */
    results.sort((a, b) => b._score - a._score);
  }

  /*
   * ---------------------------------------------------------
   * 6. Remove internal scoring field
   * ---------------------------------------------------------
   */

  const finalResults = results.slice(0, 50).map(
    ({ _score, ...item }) => item
  );

  return NextResponse.json({
    success: true,
    count: finalResults.length,
    data: finalResults,
  });
}