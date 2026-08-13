import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { TRENDING_SEARCHES } from "@/config/trending";
import { Eyebrow, H2, Lead } from "@/components/ui/typography";

const RECENT_UPDATES = [
  "Bharatiya Nyaya Sanhita, 2023",
  "Consumer Protection Rules",
  "GST Notifications",
  "Motor Vehicles Act",
  "Income Tax Act",
];

const AI_PROMPTS = [
  "Explain Article 21",
  "Difference between FIR & Complaint",
  "Summarise Section 302 BNS",
  "Latest cheque bounce judgments",
];

export function Trending() {
  return (
    <section className="border-t border-border py-20 lg:py-24">
      <div className="container-laws-and-judgments">

        <div className="max-w-2xl">
          <Eyebrow>Live Platform Activity</Eyebrow>

          <H2 className="mt-3">
            Discover what legal professionals are exploring.
          </H2>

          <Lead className="mt-4">
            Popular research topics, recently updated legislation and AI
            prompts used across the platform.
          </Lead>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[2fr_1fr]">

          {/* LEFT */}

          <div className="rounded-2xl border border-border bg-card p-8">

            <div className="mb-8 flex items-center gap-3">

              <TrendingUp className="h-5 w-5 text-primary" />

              <h3 className="text-xl font-semibold">
                Trending Searches
              </h3>

            </div>

            <div className="space-y-4">

              {TRENDING_SEARCHES.map((item) => (

                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl border border-border px-5 py-4 transition-all hover:border-primary hover:bg-secondary/40"
                >

                  <div>

                    <p className="font-medium">

                      {item.title}

                    </p>

                    <span className="text-sm text-muted-foreground">

                      {item.category}

                    </span>

                  </div>

                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />

                </Link>

              ))}

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            <div className="rounded-2xl border border-border bg-card p-6">

              <div className="mb-5 flex items-center gap-2">

                <Clock3 className="h-5 w-5 text-primary" />

                <h3 className="font-semibold">

                  Recently Updated

                </h3>

              </div>

              <div className="space-y-3">

                {RECENT_UPDATES.map((item) => (

                  <div
                    key={item}
                    className="rounded-lg bg-secondary/40 px-3 py-2 text-sm"
                  >
                    {item}
                  </div>

                ))}

              </div>

            </div>

            <div className="rounded-2xl border border-border bg-card p-6">

              <div className="mb-5 flex items-center gap-2">

                <Sparkles className="h-5 w-5 text-primary" />

                <h3 className="font-semibold">

                  Popular AI Prompts

                </h3>

              </div>

              <div className="flex flex-wrap gap-2">

                {AI_PROMPTS.map((item) => (

                  <span
                    key={item}
                    className="rounded-full border border-border px-3 py-2 text-sm transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    {item}
                  </span>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}