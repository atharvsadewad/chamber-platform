import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const NEWSPAPER_MEDIA_BUCKET = "newspaper-media";

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

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);

  return !Number.isNaN(date.getTime());
}

function isValidStatus(value: unknown): value is "draft" | "published" {
  return value === "draft" || value === "published";
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

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const subtitle =
      typeof body.subtitle === "string"
        ? body.subtitle.trim()
        : null;

    const editionDate = body.editionDate;
    const status = body.status;

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "Edition title is required.",
        },
        { status: 400 },
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: "Edition title is too long.",
        },
        { status: 400 },
      );
    }

    if (
      subtitle !== null &&
      subtitle.length > 300
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Edition subtitle is too long.",
        },
        { status: 400 },
      );
    }

    if (!isValidDate(editionDate)) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid edition date is required.",
        },
        { status: 400 },
      );
    }

    if (!isValidStatus(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid edition status.",
        },
        { status: 400 },
      );
    }

    const { data: existingEdition, error: existingError } =
      await supabaseAdmin
        .from("newspaper_editions")
        .select("id, edition_date, status")
        .eq("id", editionId)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Admin newspaper edition lookup failed:",
        existingError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to load the edition.",
        },
        { status: 500 },
      );
    }

    if (!existingEdition) {
      return NextResponse.json(
        {
          success: false,
          error: "Newspaper edition not found.",
        },
        { status: 404 },
      );
    }

    const { data: duplicateEdition, error: duplicateError } =
      await supabaseAdmin
        .from("newspaper_editions")
        .select("id")
        .eq("edition_date", editionDate)
        .neq("id", editionId)
        .maybeSingle();

    if (duplicateError) {
      console.error(
        "Admin newspaper duplicate check failed:",
        duplicateError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to validate the edition date.",
        },
        { status: 500 },
      );
    }

    if (duplicateEdition) {
      return NextResponse.json(
        {
          success: false,
          error: "Another edition already exists for this date.",
        },
        { status: 409 },
      );
    }

    const update: Record<string, unknown> = {
      title,
      subtitle: subtitle || null,
      edition_date: editionDate,
      status,
    };

    if (
      status === "published" &&
      existingEdition.status !== "published"
    ) {
      update.published_at = new Date().toISOString();
    }

    if (
      status === "draft" &&
      existingEdition.status === "published"
    ) {
      update.published_at = null;
    }

    const { error: updateError } =
      await supabaseAdmin
        .from("newspaper_editions")
        .update(update)
        .eq("id", editionId);

    if (updateError) {
      console.error(
        "Admin newspaper edition update failed:",
        updateError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to save the edition.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Edition saved successfully.",
    });
  } catch (error) {
    console.error(
      "Admin newspaper edition PATCH failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to save the edition.",
      },
      { status: 500 },
    );
  }
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

    const { data: edition, error: editionError } =
      await supabaseAdmin
        .from("newspaper_editions")
        .select("id, edition_date")
        .eq("id", editionId)
        .maybeSingle();

    if (editionError) {
      console.error(
        "Admin newspaper edition lookup failed:",
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

    const formData = await request.formData();
    const file = formData.get("cover");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Cover image is required.",
        },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Cover must be an image.",
        },
        { status: 400 },
      );
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Cover image must be 10 MB or smaller.",
        },
        { status: 400 },
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "png";

    const allowedExtensions = [
      "png",
      "jpg",
      "jpeg",
      "webp",
    ];

    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supported cover formats are PNG, JPG, JPEG and WebP.",
        },
        { status: 400 },
      );
    }

    const path = `${edition.edition_date}/front-page.${extension}`;

    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } =
      await supabaseAdmin.storage
        .from(NEWSPAPER_MEDIA_BUCKET)
        .upload(path, fileBuffer, {
          contentType: file.type,
          upsert: true,
          cacheControl: "3600",
        });

    if (uploadError) {
      console.error(
        "Newspaper cover upload failed:",
        uploadError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to upload the cover image.",
        },
        { status: 500 },
      );
    }

    const { error: updateError } =
      await supabaseAdmin
        .from("newspaper_editions")
        .update({
          cover_image_path: path,
        })
        .eq("id", editionId);

    if (updateError) {
      console.error(
        "Newspaper cover path update failed:",
        updateError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Cover uploaded but could not be linked to the edition.",
        },
        { status: 500 },
      );
    }

    const { data: publicUrlData } =
      supabaseAdmin.storage
        .from(NEWSPAPER_MEDIA_BUCKET)
        .getPublicUrl(path);

    return NextResponse.json({
      success: true,
      message: "Cover uploaded successfully.",
      path,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (error) {
    console.error(
      "Admin newspaper cover upload failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to upload the cover image.",
      },
      { status: 500 },
    );
  }
}