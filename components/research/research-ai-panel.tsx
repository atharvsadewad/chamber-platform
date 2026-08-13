"use client";

import {
  Bot,
  Sparkles,
  ArrowRight,
  History,
  ShieldCheck,
} from "lucide-react";

const SUGGESTIONS = [
  "Summarise this judgment",
  "Explain Section 302 BNS",
  "Compare IPC & BNS",
  "Latest Supreme Court ruling",
];

const HISTORY = [
  "Article 21",
  "Cheque Bounce",
  "GST Notice",
];

export function ResearchAIPanel() {
  return (
    <div className="sticky top-24 space-y-5">

      {/* AI Card */}

      <div className="rounded-2xl border border-border bg-card p-6">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-primary/10 p-3">

            <Bot className="h-5 w-5 text-primary" />

          </div>

          <div>

            <h2 className="font-semibold">
              Laws & Judgments AI
            </h2>

            <p className="text-sm text-muted-foreground">
              Your legal research copilot
            </p>

          </div>

        </div>

        <div className="mt-6">

          <textarea
            rows={5}
            placeholder="Ask any legal question..."
            className="w-full resize-none rounded-xl border border-border bg-background p-4 outline-none transition focus:border-primary"
          />

        </div>

        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">

          Ask AI

          <ArrowRight className="h-4 w-4" />

        </button>

      </div>

      {/* Suggested Prompts */}

      <div className="rounded-2xl border border-border bg-card p-6">

        <div className="mb-4 flex items-center gap-2">

          <Sparkles className="h-4 w-4 text-primary" />

          <h3 className="font-medium">

            Suggested Questions

          </h3>

        </div>

        <div className="space-y-2">

          {SUGGESTIONS.map((item) => (

            <button
              key={item}
              className="w-full rounded-lg border border-border px-3 py-3 text-left text-sm transition hover:bg-secondary"
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* Recent AI */}

      <div className="rounded-2xl border border-border bg-card p-6">

        <div className="mb-4 flex items-center gap-2">

          <History className="h-4 w-4" />

          <h3 className="font-medium">

            Recent AI Chats

          </h3>

        </div>

        <div className="space-y-2">

          {HISTORY.map((item) => (

            <button
              key={item}
              className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-secondary"
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* Disclaimer */}

      <div className="rounded-2xl border border-border bg-primary/5 p-5">

        <div className="flex items-start gap-3">

          <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />

          <p className="text-xs leading-6 text-muted-foreground">
            AI responses are generated to assist legal research and should
            always be verified against the original Bare Acts, Judgments and
            official legal sources.
          </p>

        </div>

      </div>

    </div>
  );
}