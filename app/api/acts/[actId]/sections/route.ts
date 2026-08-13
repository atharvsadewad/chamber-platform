import { NextResponse } from "next/server";
import { chamberSupabase } from "@/lib/chamberSupabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ actId: string }> }
) {
  const { actId } = await params;

  const numericActId = Number(actId);

  if (!Number.isInteger(numericActId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid act ID",
      },
      { status: 400 }
    );
  }

  const { data, error } = await chamberSupabase
    .from("act_sections")
    .select("id, act_id, section, title, content, description")
    .eq("act_id", numericActId)
    .order("section", { ascending: true });

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
    data,
  });
}