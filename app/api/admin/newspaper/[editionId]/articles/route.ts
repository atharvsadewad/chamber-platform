import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{
    editionId: string;
  }>;
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function cleanOptionalString(
  value: unknown,
  maxLength: number,
) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const clean = value.trim();

  if (!clean) {
    return null;
  }

  return clean.slice(0, maxLength);
}

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    await requireAdmin();

    const { editionId } = await params;

    if (!isValidUuid(editionId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid edition ID.",
        },
        { status: 400 },
      );
    }

    let body: Record<string, unknown>;

    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    const headline =
      typeof body.headline === "string"
        ? body.headline.trim()
        : "";

    if (!headline) {
      return NextResponse.json(
        {
          success: false,
          error: "Headline is required.",
        },
        { status: 400 },
      );
    }

    if (headline.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: "Headline is too long.",
        },
        { status: 400 },
      );
    }

    const categoryId =
      typeof body.categoryId === "string" &&
      isValidUuid(body.categoryId)
        ? body.categoryId
        : null;

    const subheadline = cleanOptionalString(
      body.subheadline,
      1000,
    );

    const summary = cleanOptionalString(
      body.summary,
      3000,
    );

    const content = cleanOptionalString(
      body.content,
      50000,
    );

    const sourceName = cleanOptionalString(
      body.sourceName,
      300,
    );

    const sourceUrl = cleanOptionalString(
      body.sourceUrl,
      2000,
    );

    const author = cleanOptionalString(
      body.author,
      300,
    );

    const isFeatured =
      body.isFeatured === true;

    const requestedDisplayOrder =
      typeof body.displayOrder === "number" &&
      Number.isFinite(body.displayOrder) &&
      Number.isInteger(body.displayOrder) &&
      body.displayOrder >= 0
        ? body.displayOrder
        : null;

    const { data: edition, error: editionError } =
      await supabaseAdmin
        .from("newspaper_editions")
        .select("id")
        .eq("id", editionId)
        .maybeSingle();

    if (editionError) {
      console.error(
        "Admin article edition lookup failed:",
        editionError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load the edition.",
        },
        { status: 500 },
      );
    }

    if (!edition) {
      return NextResponse.json(
        {
          success: false,
          error: "Newspaper edition not found.",
        },
        { status: 404 },
      );
    }

    if (categoryId) {
      const { data: category, error: categoryError } =
        await supabaseAdmin
          .from("newspaper_categories")
          .select("id")
          .eq("id", categoryId)
          .maybeSingle();

      if (categoryError) {
        console.error(
          "Admin article category lookup failed:",
          categoryError,
        );

        return NextResponse.json(
          {
            success: false,
            error: "Unable to validate the selected category.",
          },
          { status: 500 },
        );
      }

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            error: "Selected category does not exist.",
          },
          { status: 400 },
        );
      }
    }

    let displayOrder = requestedDisplayOrder;

    if (displayOrder === null) {
      const { data: lastArticle, error: lastArticleError } =
        await supabaseAdmin
          .from("newspaper_articles")
          .select("display_order")
          .eq("edition_id", editionId)
          .order("display_order", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      if (lastArticleError) {
        console.error(
          "Admin article order lookup failed:",
          lastArticleError,
        );

        return NextResponse.json(
          {
            success: false,
            error: "Unable to determine article order.",
          },
          { status: 500 },
        );
      }

      displayOrder =
        typeof lastArticle?.display_order === "number"
          ? lastArticle.display_order + 1
          : 0;
    }

    const { data: article, error: insertError } =
      await supabaseAdmin
        .from("newspaper_articles")
        .insert({
          edition_id: editionId,
          category_id: categoryId,
          headline,
          subheadline,
          summary,
          content,
          source_name: sourceName,
          source_url: sourceUrl,
          author,
          is_featured: isFeatured,
          display_order: displayOrder,
        })
        .select("id")
        .single();

    if (insertError) {
      console.error(
        "Admin newspaper article creation failed:",
        insertError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to create the article.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Article created successfully.",
        articleId: article.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Admin newspaper article POST failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create the article.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    await requireAdmin();

    const { editionId } = await params;

    if (!isValidUuid(editionId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid edition ID.",
        },
        { status: 400 },
      );
    }

    const articleId = new URL(request.url).searchParams.get(
      "articleId",
    );

    if (!articleId || !isValidUuid(articleId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid article ID.",
        },
        { status: 400 },
      );
    }

    let body: Record<string, unknown>;

    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    const headline =
      typeof body.headline === "string"
        ? body.headline.trim()
        : "";

    if (!headline) {
      return NextResponse.json(
        {
          success: false,
          error: "Headline is required.",
        },
        { status: 400 },
      );
    }

    if (headline.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: "Headline is too long.",
        },
        { status: 400 },
      );
    }

    const categoryId =
      typeof body.categoryId === "string" &&
      isValidUuid(body.categoryId)
        ? body.categoryId
        : null;

    const subheadline = cleanOptionalString(
      body.subheadline,
      1000,
    );

    const summary = cleanOptionalString(
      body.summary,
      3000,
    );

    const content = cleanOptionalString(
      body.content,
      50000,
    );

    const sourceName = cleanOptionalString(
      body.sourceName,
      300,
    );

    const sourceUrl = cleanOptionalString(
      body.sourceUrl,
      2000,
    );

    const author = cleanOptionalString(
      body.author,
      300,
    );

    const isFeatured =
      body.isFeatured === true;

    const displayOrder =
      typeof body.displayOrder === "number" &&
      Number.isFinite(body.displayOrder) &&
      Number.isInteger(body.displayOrder) &&
      body.displayOrder >= 0
        ? body.displayOrder
        : null;

    const { data: existingArticle, error: articleError } =
      await supabaseAdmin
        .from("newspaper_articles")
        .select(
          "id, edition_id, image_path, display_order",
        )
        .eq("id", articleId)
        .eq("edition_id", editionId)
        .maybeSingle();

    if (articleError) {
      console.error(
        "Admin article lookup failed:",
        articleError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load the article.",
        },
        { status: 500 },
      );
    }

    if (!existingArticle) {
      return NextResponse.json(
        {
          success: false,
          error: "Article not found.",
        },
        { status: 404 },
      );
    }

    if (categoryId) {
      const { data: category, error: categoryError } =
        await supabaseAdmin
          .from("newspaper_categories")
          .select("id")
          .eq("id", categoryId)
          .maybeSingle();

      if (categoryError) {
        console.error(
          "Admin article category lookup failed:",
          categoryError,
        );

        return NextResponse.json(
          {
            success: false,
            error: "Unable to validate the selected category.",
          },
          { status: 500 },
        );
      }

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            error: "Selected category does not exist.",
          },
          { status: 400 },
        );
      }
    }

    const { data: article, error: updateError } =
      await supabaseAdmin
        .from("newspaper_articles")
        .update({
          category_id: categoryId,
          headline,
          subheadline,
          summary,
          content,
          source_name: sourceName,
          source_url: sourceUrl,
          author,
          is_featured: isFeatured,
          display_order:
            displayOrder ?? existingArticle.display_order,
        })
        .eq("id", articleId)
        .eq("edition_id", editionId)
        .select(
          `
          id,
          edition_id,
          category_id,
          headline,
          subheadline,
          summary,
          content,
          image_path,
          source_name,
          source_url,
          author,
          is_featured,
          display_order
        `,
        )
        .single();

    if (updateError) {
      console.error(
        "Admin newspaper article update failed:",
        updateError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to update the article.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article updated successfully.",
      article,
    });
  } catch (error) {
    console.error(
      "Admin newspaper article PATCH failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update the article.",
      },
      { status: 500 },
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: RouteContext,
) {
  try {
    await requireAdmin();

    const { editionId } = await params;
    const articleId = new URL(request.url).searchParams.get(
      "articleId",
    );

    if (
      !isValidUuid(editionId) ||
      !articleId ||
      !isValidUuid(articleId)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid edition or article ID.",
        },
        { status: 400 },
      );
    }

    const { data: article, error: lookupError } =
      await supabaseAdmin
        .from("newspaper_articles")
        .select("id")
        .eq("id", articleId)
        .eq("edition_id", editionId)
        .maybeSingle();

    if (lookupError) {
      console.error(
        "Admin article delete lookup failed:",
        lookupError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to find the article.",
        },
        { status: 500 },
      );
    }

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "Article not found.",
        },
        { status: 404 },
      );
    }

    const { error: deleteError } =
      await supabaseAdmin
        .from("newspaper_articles")
        .delete()
        .eq("id", articleId)
        .eq("edition_id", editionId);

    if (deleteError) {
      console.error(
        "Admin newspaper article deletion failed:",
        deleteError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to delete the article.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Admin newspaper article DELETE failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete the article.",
      },
      { status: 500 },
    );
  }
}