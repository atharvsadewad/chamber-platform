import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  FileSearch,
  Gavel,
  Library,
  Scale,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eyebrow, H2, Lead } from "@/components/ui/typography";

import { FEATURES } from "@/config/features";

export function ModuleGrid() {
  return (
    <section className="border-t border-border py-20 lg:py-28">
      <div className="container-laws-and-judgments">

        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Platform Modules</Eyebrow>

          <H2 className="mt-4">
            Everything you need for legal research.
          </H2>

          <Lead className="mt-5">
            A unified legal workspace designed for advocates, law students,
            researchers, institutions and legal professionals.
          </Lead>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {FEATURES.map((feature) => {

            const Icon = feature.icon;

            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group"
              >
                <Card className="h-full rounded-2xl border border-border transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl">

                  <CardHeader>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">

                      <Icon
                        className="h-7 w-7"
                        strokeWidth={1.8}
                      />

                    </div>

                    <CardTitle className="mt-6 text-xl">
                      {feature.title}
                    </CardTitle>

                    <CardDescription className="mt-3 text-sm leading-7">
                      {feature.description}
                    </CardDescription>

                    <div className="mt-8 flex items-center gap-2 font-medium text-primary">

                      <span>Explore</span>

                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        strokeWidth={2}
                      />

                    </div>

                  </CardHeader>

                </Card>
              </Link>
            );

          })}

        </div>

      </div>
    </section>
  );
}