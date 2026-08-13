"use client";

import * as React from "react";
import {
  Send,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AIDraftFloat() {
  const [open, setOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const [generating, setGenerating] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;

    setGenerating(true);
    setSubmitted(false);

    /*
     * AI integration will be connected here.
     *
     * For now we simulate the generation state so
     * the interaction is functional for the demo.
     */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setGenerating(false);
    setSubmitted(true);
  };

  return (
    <div className="pointer-events-auto fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">
      {/* Assistant panel */}
      {open && (
        <div
          className={cn(
            "w-[calc(100vw-2rem)] max-w-[380px]",
            "overflow-hidden rounded-2xl border border-border",
            "bg-background shadow-2xl",
            "animate-in fade-in slide-in-from-bottom-3 duration-200"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  AI Draft Assistant
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  Create a legal draft from your instructions
                </p>
              </div>
            </div>

          <button
            type="button"
            onClick={() => {
              console.log("AI FLOAT CLICKED");
              setOpen((value) => !value);
            }}
            className={cn(
              "pointer-events-auto relative flex items-center gap-2 rounded-full",
              "bg-primary px-5 py-3",
              "text-sm font-medium text-primary-foreground",
              "shadow-lg transition-all duration-200",
              "hover:scale-[1.02] hover:opacity-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              open && "bg-foreground text-background"
            )}
            aria-label={open ? "Close AI Draft Assistant" : "Open AI Draft Assistant"}
            aria-expanded={open}
          >

              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <label
              htmlFor="ai-draft-prompt"
              className="text-sm font-medium text-foreground"
            >
              What do you want to draft?
            </label>

            <textarea
              id="ai-draft-prompt"
              value={prompt}
              onChange={(event) => {
                setPrompt(event.target.value);
                setSubmitted(false);
              }}
              placeholder="Example: Draft a legal notice for recovery of an unpaid invoice..."
              className="mt-2 min-h-28 w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />

            <Button
              type="button"
              className="mt-3 w-full"
              disabled={!prompt.trim() || generating}
              onClick={handleGenerate}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing Draft...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Generate Draft
                </>
              )}
            </Button>

            {submitted && (
              <div className="mt-3 rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
                <span className="font-medium text-foreground">
                  Draft request received.
                </span>{" "}
                AI generation will be connected to the legal drafting engine
                here.
              </div>
            )}

            <p className="mt-3 text-center text-[11px] leading-4 text-muted-foreground">
              AI-generated drafts should be reviewed before use.
            </p>
          </div>
        </div>
      )}

      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex items-center gap-2 rounded-full",
          "bg-primary px-5 py-3",
          "text-sm font-medium text-primary-foreground",
          "shadow-lg transition-all duration-200",
          "hover:scale-[1.02] hover:opacity-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          open && "bg-foreground text-background"
        )}
        aria-label={
          open
            ? "Close AI Draft Assistant"
            : "Open AI Draft Assistant"
        }
        aria-expanded={open}
      >
        {open ? (
          <X className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}

        <span>
          {open ? "Close" : "Draft with AI"}
        </span>
      </button>
    </div>
  );
}