import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Gavel,
  Library,
  Newspaper,
  Scale,
} from "lucide-react";

import { Eyebrow, H2, Lead } from "@/components/ui/typography";

type Module = {
  title: string;
  description: string;
  href: string;
  icon: typeof FileText;
  comingSoon?: boolean;
  action: string;
};

const MODULES: Module[] = [
  {
    title: "Legal Newspaper",
    description:
      "Read the latest legal news, updates, judgments, notifications and important developments from across India.",
    href: "/newspaper",
    icon: Newspaper,
    action: "Explore News",
  },
  {
    title: "Legal Drafts",
    description:
      "Access practical legal drafts and templates for common legal requirements.",
    href: "/drafts",
    icon: FileText,
    action: "Explore Drafts",
  },
  {
    title: "Legal Procedures",
    description:
      "Follow step-by-step procedural guides for litigation, compliance and legal practice.",
    href: "/procedures",
    icon: Gavel,
    action: "Explore Procedures",
  },
  {
    title: "Dictionary",
    description:
      "Understand legal terminology with definitions, explanations and examples.",
    href: "/dictionary",
    icon: BookOpen,
    action: "Explore Words",
  },
  {
    title: "Research",
    description:
      "Search across Acts, Judgments, Sections and legal references from one unified research workspace.",
    href: "/research",
    icon: Scale,
    comingSoon: true,
    action: "Coming Soon",
  },
  {
    title: "Bare Acts",
    description:
      "Browse Central Acts, State Acts, Rules, Amendments and Sections.",
    href: "/bare-acts",
    icon: Library,
    comingSoon: true,
    action: "Coming Soon",
  },
  {
    title: "Judgments",
    description:
      "Explore Supreme Court, High Court and Tribunal decisions with intelligent search.",
    href: "/judgments",
    icon: Scale,
    comingSoon: true,
    action: "Coming Soon",
  },
];

export function ModuleGrid() {
  const primaryModules = MODULES.slice(0, 4);
  const additionalModules = MODULES.slice(4);

  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-[1600px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20 xl:px-16">
        {/* Heading */}
        <div className="mx-auto max-w-[820px] text-center">
          <Eyebrow>Platform Modules</Eyebrow>

          <H2 className="mt-3 text-balance">
            Everything you need for modern legal work.
          </H2>

          <Lead className="mt-4 text-base sm:text-lg">
            A unified legal workspace designed for advocates, law students,
            researchers, institutions and legal professionals.
          </Lead>
        </div>

        {/* Main four modules */}
        <div className="mx-auto mt-8 grid max-w-[1500px] gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {primaryModules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.title}
                href={module.href}
                className="group block h-full"
              >
                <article
                  className="
                    relative flex h-full min-h-[190px] flex-col
                    overflow-hidden rounded-2xl
                    border border-border/80
                    bg-card/75
                    p-5
                    shadow-[0_4px_20px_hsl(var(--foreground)/0.025)]
                    backdrop-blur-md
                    transition-all duration-300
                    ease-out
                    hover:-translate-y-1
                    hover:border-primary/35
                    hover:bg-card/90
                    hover:shadow-[0_16px_35px_hsl(var(--foreground)/0.07)]
                    active:scale-[0.99]
                    sm:min-h-[250px]
                    sm:rounded-3xl
                    sm:p-6
                  "
                >
                  {/* Soft glass highlight */}
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute inset-x-0 top-0 h-px
                      bg-gradient-to-r from-transparent via-primary/20 to-transparent
                    "
                  />

                  <div className="flex items-start gap-4 sm:block">
                    {/* Icon */}
                    <div
                      className="
                        flex h-13 w-13 shrink-0 items-center justify-center
                        rounded-2xl bg-primary/10 text-primary
                        transition-transform duration-300
                        group-hover:scale-105
                        sm:h-14 sm:w-14
                      "
                    >
                      <Icon
                        className="h-6 w-6 sm:h-7 sm:w-7"
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 sm:mt-6">
                      <h3 className="font-serif text-[21px] font-bold leading-tight sm:text-2xl">
                        {module.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground sm:mt-3 sm:leading-7">
                        {module.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2 font-medium text-primary sm:mt-6">
                        <span className="text-sm">
                          {module.action}
                        </span>

                        <ArrowRight
                          className="
                            h-4 w-4
                            transition-transform duration-300
                            group-hover:translate-x-1
                          "
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Development modules */}
        <div className="mx-auto mt-4 grid max-w-[1500px] grid-cols-3 gap-2 sm:mt-5 sm:gap-4">
          {additionalModules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.title}
                href={module.href}
                className="group block"
              >
                <article
                  className="
                    flex min-h-[68px] items-center gap-2
                    rounded-xl border border-border/70
                    bg-card/50 p-3
                    backdrop-blur-md
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-primary/30
                    hover:bg-card/80
                    sm:min-h-[82px]
                    sm:gap-3
                    sm:rounded-2xl
                    sm:p-4
                  "
                >
                  <div
                    className="
                      flex h-9 w-9 shrink-0 items-center justify-center
                      rounded-lg bg-primary/10 text-primary
                      sm:h-10 sm:w-10 sm:rounded-xl
                    "
                  >
                    <Icon
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold sm:text-sm">
                      {module.title}
                    </p>

                    <p className="mt-0.5 text-[9px] uppercase tracking-wide text-primary/70 sm:text-[10px]">
                      Soon
                    </p>
                  </div>

                  <ArrowRight
                    className="
                      hidden h-4 w-4 shrink-0 text-primary
                      transition-transform duration-300
                      group-hover:translate-x-1
                      sm:block
                    "
                    strokeWidth={1.8}
                  />
                </article>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}