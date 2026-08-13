import { NextResponse } from "next/server";
import { chamberSupabase } from "@/lib/chamberSupabase";

export async function GET() {
  const { data, error } = await chamberSupabase
    .from("acts")
    .select("id, act_name, short_name, year")
    .limit(10);

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