"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [input, setInput] = useState("");

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();

    if (!question) return;

    router.push(`/ai?q=${encodeURIComponent(question)}&send=1`);
  }

  function selectPrompt(prompt: string) {
    setInput(prompt);
  }

  return (
    <section className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 xl:px-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Laws & Judgments AI
          </div>

          <H2 className="mt-6 text-balance text-primary-foreground sm:mt-8">
            Ask legal questions in plain English.
          </H2>

          <Lead className="mx-auto mt-5 max-w-2xl text-base text-primary-foreground/75 sm:mt-6 sm:text-lg">
            Search statutes, explain legal concepts, summarise judgments,
            compare provisions and generate legal drafts with AI assistance.
          </Lead>
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-background/95 p-3 shadow-2xl backdrop-blur-md sm:mt-12 sm:rounded-3xl sm:p-5">
          <form onSubmit={submitQuestion}>
            <div className="flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-2 transition-all duration-200 focus-within:border-primary focus-within:shadow-md sm:gap-4 sm:rounded-2xl sm:px-5 sm:py-3">
              <Bot className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" />

              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a legal question..."
                aria-label="Ask a legal question"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
              />

              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                aria-label="Ask AI"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:mt-6 sm:flex-wrap sm:overflow-visible">
            {PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => selectPrompt(prompt)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs transition-all duration-200 sm:px-4 sm:text-sm ${
                  input === prompt
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-primary hover:bg-primary/5"
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center sm:mt-12">
          <Button
            variant="accent"
            size="lg"
            className="h-11 rounded-xl"
            onClick={() => router.push("/ai")}
          >
            Open AI Assistant
          </Button>
        </div>
      </div>
    </section>
  );
}