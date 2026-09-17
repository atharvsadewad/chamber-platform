import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Role = "user" | "admin";

interface RoleUpdateBody {
  userId?: unknown;
  role?: unknown;
}

function isValidRole(
  value: unknown,
): value is Role {
  return value === "user" || value === "admin";
}

export async function PATCH(
  request: Request,
) {
  try {
    const { user } = await requireAdmin();

    let body: RoleUpdateBody;

    try {
      body =
        (await request.json()) as RoleUpdateBody;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    const targetUserId =
      typeof body.userId === "string"
        ? body.userId.trim()
        : "";

    const targetRole = body.role;

    if (!targetUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required.",
        },
        { status: 400 },
      );
    }

    if (!isValidRole(targetRole)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid role.",
        },
        { status: 400 },
      );
    }

    /*
     * An administrator must never be able to remove
     * their own administrator access through this
     * endpoint.
     */
    if (targetUserId === user.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You cannot change your own administrator role.",
        },
        { status: 400 },
      );
    }

    const supabase =
      await createSupabaseServerClient();

    /*
     * Use the authenticated server client here rather
     * than the service-role client.
     *
     * This preserves auth.uid() so the database-level
     * role protection trigger and RLS policies remain
     * active.
     */
    const { data: targetProfile, error: lookupError } =
      await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", targetUserId)
        .maybeSingle();

    if (lookupError) {
      console.error(
        "Unable to find target profile:",
        lookupError,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to find the selected user.",
        },
        { status: 500 },
      );
    }

    if (!targetProfile) {
      return NextResponse.json(
        {
          success: false,
          error: "User profile not found.",
        },
        { status: 404 },
      );
    }

    if (targetProfile.role === targetRole) {
      return NextResponse.json({
        success: true,
        message: "User role is already up to date.",
      });
    }

    const { error: updateError } =
      await supabase
        .from("profiles")
        .update({
          role: targetRole,
        })
        .eq("id", targetUserId);

    if (updateError) {
      console.error(
        "Unable to update user role:",
        updateError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to update the user role.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        targetRole === "admin"
          ? "Administrator access granted."
          : "Administrator access removed.",
    });
  } catch (error) {
    console.error(
      "Admin role update failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to complete the role update.",
      },
      { status: 500 },
    );
  }
}