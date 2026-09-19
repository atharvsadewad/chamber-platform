import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const NEWSPAPER_MEDIA_BUCKET = "newspaper-media";
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);

interface RouteContext {
  params: Promise<{
    editionId: string;
    articleId: string;
  }>;
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function isOwnedArticleImage(
  path: string,
  editionDate: string,
  articleId: string,
) {
  return (
    path.startsWith(`${editionDate}/articles/${articleId}/`) &&
    !path.includes("..")
  );
}

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  try {
    await requireAdmin();

    const { editionId, articleId } = await params;

    if (!isValidUuid(editionId) || !isValidUuid(articleId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid edition or article ID.",
        },
        { status: 400 },
      );
    }

    const { data: article, error: articleError } =
      await supabaseAdmin
        .from("newspaper_articles")
        .select("id, edition_id, image_path")
        .eq("id", articleId)
        .eq("edition_id", editionId)
        .maybeSingle();

    if (articleError) {
      console.error("Article media lookup failed:", articleError);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load the article.",
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

    const { data: edition, error: editionError } =
      await supabaseAdmin
        .from("newspaper_editions")
        .select("edition_date")
        .eq("id", editionId)
        .maybeSingle();

    if (editionError) {
      console.error(
        "Edition lookup for article media failed:",
        editionError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to determine the edition.",
        },
        { status: 500 },
      );
    }

    if (!edition) {
      return NextResponse.json(
        {
          success: false,
          error: "Edition not found.",
        },
        { status: 404 },
      );
    }

    const editionDate = edition.edition_date;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No image file was provided.",
        },
        { status: 400 },
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "The image file is empty.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Image must be 10 MB or smaller.",
        },
        { status: 400 },
      );
    }

    const extension = ALLOWED_TYPES.get(file.type);

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unsupported image type. Use PNG, JPG, JPEG, or WebP.",
        },
        { status: 400 },
      );
    }

    const imagePath =
      `${editionDate}/articles/${articleId}/image.${extension}`;

    const { error: uploadError } =
      await supabaseAdmin.storage
        .from(NEWSPAPER_MEDIA_BUCKET)
        .upload(imagePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: true,
        });

    if (uploadError) {
      console.error(
        "Newspaper article image upload failed:",
        uploadError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to upload the article image.",
        },
        { status: 500 },
      );
    }

    const { error: updateError } =
      await supabaseAdmin
        .from("newspaper_articles")
        .update({
          image_path: imagePath,
        })
        .eq("id", articleId)
        .eq("edition_id", editionId);

    if (updateError) {
      console.error(
        "Article image path update failed:",
        updateError,
      );

      await supabaseAdmin.storage
        .from(NEWSPAPER_MEDIA_BUCKET)
        .remove([imagePath]);

      return NextResponse.json(
        {
          success: false,
          error:
            "Image uploaded, but the article could not be updated.",
        },
        { status: 500 },
      );
    }

    if (
      article.image_path &&
      article.image_path !== imagePath &&
      isOwnedArticleImage(
        article.image_path,
        editionDate,
        articleId,
      )
    ) {
      const { error: removeError } =
        await supabaseAdmin.storage
          .from(NEWSPAPER_MEDIA_BUCKET)
          .remove([article.image_path]);

      if (removeError) {
        console.warn(
          "Unable to remove previous article image:",
          removeError,
        );
      }
    }

    const { data: publicUrl } =
      supabaseAdmin.storage
        .from(NEWSPAPER_MEDIA_BUCKET)
        .getPublicUrl(imagePath);

    return NextResponse.json({
      success: true,
      message: "Article image uploaded successfully.",
      imagePath,
      imageUrl: publicUrl.publicUrl,
    });
  } catch (error) {
    console.error("Article media upload failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to upload the article image.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    await requireAdmin();

    const { editionId, articleId } = await params;

    if (!isValidUuid(editionId) || !isValidUuid(articleId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid edition or article ID.",
        },
        { status: 400 },
      );
    }

    const { data: article, error: articleError } =
      await supabaseAdmin
        .from("newspaper_articles")
        .select("id, image_path")
        .eq("id", articleId)
        .eq("edition_id", editionId)
        .maybeSingle();

    if (articleError) {
      console.error(
        "Article media delete lookup failed:",
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

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "Article not found.",
        },
        { status: 404 },
      );
    }

    if (!article.image_path) {
      return NextResponse.json({
        success: true,
        message: "Article has no image.",
      });
    }

    const { data: edition, error: editionError } =
      await supabaseAdmin
        .from("newspaper_editions")
        .select("edition_date")
        .eq("id", editionId)
        .maybeSingle();

    if (editionError) {
      console.error(
        "Edition lookup for article media delete failed:",
        editionError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to determine the edition.",
        },
        { status: 500 },
      );
    }

    if (!edition) {
      return NextResponse.json(
        {
          success: false,
          error: "Edition not found.",
        },
        { status: 404 },
      );
    }

    const editionDate = edition.edition_date;

    if (
      !isOwnedArticleImage(
        article.image_path,
        editionDate,
        articleId,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid article image path.",
        },
        { status: 400 },
      );
    }

    const { error: removeError } =
      await supabaseAdmin.storage
        .from(NEWSPAPER_MEDIA_BUCKET)
        .remove([article.image_path]);

    if (removeError) {
      console.error(
        "Article image removal failed:",
        removeError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to remove the article image.",
        },
        { status: 500 },
      );
    }

    const { error: updateError } =
      await supabaseAdmin
        .from("newspaper_articles")
        .update({
          image_path: null,
        })
        .eq("id", articleId)
        .eq("edition_id", editionId);

    if (updateError) {
      console.error(
        "Article image path cleanup failed:",
        updateError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Image was removed, but the article could not be updated.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article image removed successfully.",
    });
  } catch (error) {
    console.error("Article media DELETE failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to remove the article image.",
      },
      { status: 500 },
    );
  }
}