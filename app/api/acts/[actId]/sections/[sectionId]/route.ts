import { NextResponse } from "next/server";
import { chamberSupabase } from "@/lib/chamberSupabase";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      actId: string;
      sectionId: string;
    }>;
  }
) {
  const { actId, sectionId } = await params;

  const numericActId = Number(actId);
  const numericSectionId = Number(sectionId);

  if (!Number.isInteger(numericActId) || !Number.isInteger(numericSectionId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid act ID or section ID",
      },
      { status: 400 }
    );
  }

  const { data, error } = await chamberSupabase
    .from("act_sections")
    .select("id, act_id, section, title, content, description")
    .eq("act_id", numericActId)
    .eq("id", numericSectionId)
    .single();

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data,
  });
}