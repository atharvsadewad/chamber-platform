import { NextResponse } from "next/server";

import { generateAIResponse } from "@/lib/ai/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message =
      typeof body?.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await generateAIResponse(message);

    return NextResponse.json({
      message: response,
    });
 } catch (error) {
  console.error("AI API error:", error);

  return Response.json(
    {
      error: "Unable to generate an AI response.",
      details: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
 }}