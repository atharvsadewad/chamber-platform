import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai/gemini";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_INPUT_LENGTH = 12000;

async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null };
  }

  return { supabase, user };
}

export async function GET(request: Request) {
  try {
    const { supabase, user } = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to use AI conversation history." },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const conversationId = url.searchParams.get("conversationId");

    if (conversationId) {
      const { data: conversation, error: conversationError } =
        await supabase
          .from("ai_conversations")
          .select("id, title, created_at, updated_at")
          .eq("id", conversationId)
          .eq("user_id", user.id)
          .single();

      if (conversationError) {
        console.error("[AI] Conversation load failed:", conversationError);
        return NextResponse.json(
          { error: "Unable to load this conversation." },
          { status: 404 },
        );
      }

      const { data: messages, error: messagesError } = await supabase
        .from("ai_messages")
        .select("id, role, content, created_at")
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("[AI] Message history load failed:", messagesError);
        return NextResponse.json(
          { error: "Unable to load conversation messages." },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { conversation, messages: messages ?? [] },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const { data: conversations, error } = await supabase
      .from("ai_conversations")
      .select("id, title, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[AI] Conversation list failed:", error);
      return NextResponse.json(
        { error: "Unable to load conversation history." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { conversations: conversations ?? [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[AI] GET failed:", error);

    return NextResponse.json(
      { error: "Unable to load AI conversation history." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const { supabase, user } = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to save AI conversations." },
        { status: 401 },
      );
    }

    const body = await request.json();

    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    const conversationId =
      typeof body?.conversationId === "string" && body.conversationId.trim()
        ? body.conversationId.trim()
        : null;

    const regenerate = body?.regenerate === true;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    if (message.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: "Your message is too long. Please shorten your query.",
        },
        { status: 413 },
      );
    }

    let activeConversationId = conversationId;

    if (activeConversationId) {
      const { data: existingConversation, error } = await supabase
        .from("ai_conversations")
        .select("id")
        .eq("id", activeConversationId)
        .eq("user_id", user.id)
        .single();

      if (error || !existingConversation) {
        return NextResponse.json(
          { error: "Conversation not found." },
          { status: 404 },
        );
      }
    } else {
      const title =
        message.length > 80 ? `${message.slice(0, 77)}...` : message;

      const { data: conversation, error } = await supabase
        .from("ai_conversations")
        .insert({
          user_id: user.id,
          title,
        })
        .select("id")
        .single();

      if (error || !conversation) {
        console.error("[AI] Conversation creation failed:", error);
        return NextResponse.json(
          { error: "Unable to create the conversation." },
          { status: 500 },
        );
      }

      activeConversationId = conversation.id;
    }

    if (!regenerate) {
      const { error: userMessageError } = await supabase
        .from("ai_messages")
        .insert({
          conversation_id: activeConversationId,
          user_id: user.id,
          role: "user",
          content: message,
        });

      if (userMessageError) {
        console.error("[AI] User message save failed:", userMessageError);
        return NextResponse.json(
          { error: "Unable to save your message." },
          { status: 500 },
        );
      }
    }

    const response = await generateAIResponse(message);

    const { data: assistantMessage, error: assistantMessageError } =
      await supabase
        .from("ai_messages")
        .insert({
          conversation_id: activeConversationId,
          user_id: user.id,
          role: "assistant",
          content: response,
        })
        .select("id, created_at")
        .single();

    if (assistantMessageError || !assistantMessage) {
      console.error(
        "[AI] Assistant message save failed:",
        assistantMessageError,
      );
      return NextResponse.json(
        { error: "The AI response was generated but could not be saved." },
        { status: 500 },
      );
    }

    const { error: updateError } = await supabase
      .from("ai_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", activeConversationId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[AI] Conversation timestamp update failed:", updateError);
    }

    const duration = Date.now() - startTime;

    console.log(`[AI] Response generated and saved in ${duration}ms`);

    return NextResponse.json(
      {
        message: response,
        conversationId: activeConversationId,
        messageId: assistantMessage.id,
        createdAt: assistantMessage.created_at,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const duration = Date.now() - startTime;

    console.error("[AI] Request failed:", {
      duration,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate an AI response.",
      },
      { status: 500 },
    );
  }
}
