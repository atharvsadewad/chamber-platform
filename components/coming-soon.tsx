import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  FileSearch,
  Library,
  Scale,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Eyebrow, H2, Lead } from "@/components/ui/typography";

type ComingSoonProps = {
  title: string;
  description: string;
  icon: "research" | "bare-acts" | "judgments";
};

const ICONS = {
  research: FileSearch,
  "bare-acts": Library,
  judgments: Scale,
} as const;

export function ComingSoon({
  title,
  description,
  icon,
}: ComingSoonProps) {
  const Icon = ICONS[icon];

  return (
    <main className="min-h-[70vh]">
      <section className="container-laws-and-judgments flex min-h-[70vh] items-center py-16 sm:py-24">
        <div className="mx-auto w-full max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-7 w-7" strokeWidth={1.7} />
          </div>

          <Eyebrow className="mt-7">
            <Clock3 className="mr-2 inline-block h-3.5 w-3.5" />
            Coming Soon
          </Eyebrow>

          <H2 className="mt-4 text-3xl sm:text-4xl">
            {title}
          </H2>

          <Lead className="mx-auto mt-5 max-w-xl">
            {description}
          </Lead>

          <div className="mt-8 rounded-2xl border border-border bg-secondary/30 p-5 text-left sm:p-6">
            <p className="text-sm leading-6 text-muted-foreground">
              This module is currently being developed and will
              be released as part of the next phase of Laws &
              Judgments.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              In development
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="accent"
              size="lg"
              asChild
            >
              <Link href="/">
                Read Legal Newspaper
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/dictionary">
                Explore Legal Dictionary
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}