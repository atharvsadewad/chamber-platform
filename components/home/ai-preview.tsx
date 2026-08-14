import Link from "next/link";
import { ArrowRight, Bot, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { H2, Lead } from "@/components/ui/typography";

const PROMPTS = [
  "Explain Article 21",
  "Summarise BNS Section 302",
  "Latest cheque bounce judgments",
  "Difference between FIR and Complaint",
];

export function AIPreview() {
  return (
    <section className="border-t border-border bg-primary text-primary-foreground">
      <div className="container-laws-and-judgments py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4" />
            Laws & Judgments AI
          </div>

          <H2 className="mt-8 text-primary-foreground">
            Ask legal questions in plain English.
          </H2>

          <Lead className="mx-auto mt-6 max-w-2xl text-primary-foreground/75">
            Search statutes, explain legal concepts, summarise judgments,
            compare provisions and generate legal drafts with AI assistance.
          </Lead>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-background p-6 shadow-2xl">
          <Link
            href="/ai"
            className="flex items-center gap-4 rounded-2xl border border-border px-5 py-4 transition-colors hover:border-primary"
          >
            <Bot className="h-6 w-6 text-primary" />

            <span className="flex-1 text-left text-muted-foreground">
              Ask a legal question...
            </span>

            <Button
              size="icon"
              tabIndex={-1}
              aria-label="Open AI Assistant"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <div className="mt-6 flex flex-wrap gap-3">
            {PROMPTS.map((prompt) => (
              <Link
                key={prompt}
                href={`/laws-and-judgments-ai?q=${encodeURIComponent(prompt)}`}
                className="rounded-full border border-border px-4 py-2 text-sm text-foreground transition-all hover:border-primary hover:bg-primary/5"
              >
                {prompt}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            variant="accent"
            size="lg"
            asChild
          >
            <Link href="/ai">
              Open AI Assistant
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}