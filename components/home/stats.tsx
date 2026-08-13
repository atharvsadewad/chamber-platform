import {
  BadgeCheck,
  BookOpen,
  Building2,
  FileText,
  Gavel,
  Landmark,
  Scale,
  ScrollText,
} from "lucide-react";

import { Eyebrow, H2, Lead } from "@/components/ui/typography";

const COVERAGE = [
  {
    icon: Landmark,
    title: "Central Acts",
  },
  {
    icon: Building2,
    title: "State Acts",
  },
  {
    icon: Scale,
    title: "Supreme Court",
  },
  {
    icon: Gavel,
    title: "High Courts",
  },
  {
    icon: ScrollText,
    title: "Tribunals",
  },
  {
    icon: FileText,
    title: "Rules & Notifications",
  },
  {
    icon: BookOpen,
    title: "Legal Drafts",
  },
  {
    icon: BadgeCheck,
    title: "Legal Dictionary",
  },
] as const;

const STATS = [
  {
    value: "700+",
    label: "Central Acts",
  },
  {
    value: "3000+",
    label: "Legal Drafts",
  },
  {
    value: "100+",
    label: "Research Categories",
  },
  {
    value: "24×7",
    label: "Platform Availability",
  },
] as const;

export function Stats() {
  return (
    <section className="border-y border-border bg-secondary/20 py-20 lg:py-24">
      <div className="container-laws-and-judgments">

        <div className="mx-auto max-w-3xl text-center">

          <Eyebrow>Trusted Legal Coverage</Eyebrow>

          <H2 className="mt-4">
            Everything required for modern legal research.
          </H2>

          <Lead className="mt-5">
            Laws & Judgments brings together legislation,
            judicial precedents, legal terminology and research
            tools into one unified legal workspace.
          </Lead>

        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {COVERAGE.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-5 transition-all duration-300 hover:border-primary hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">

                  <Icon
                    className="h-5 w-5"
                    strokeWidth={2}
                  />

                </div>

                <span className="font-medium">

                  {item.title}

                </span>

              </div>
            );

          })}

        </div>

        <div className="mt-16 grid gap-8 border-t border-border pt-12 sm:grid-cols-2 lg:grid-cols-4">

          {STATS.map((item) => (

            <div
              key={item.label}
              className="text-center lg:text-left"
            >

              <h3 className="font-serif text-5xl font-semibold tracking-tight text-primary">

                {item.value}

              </h3>

              <p className="mt-3 text-muted-foreground">

                {item.label}

              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}