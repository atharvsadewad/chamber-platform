"use client";

import {
  ArrowRight,
  FileText,
  FolderOpen,
  Gavel,
  Search,
  Sparkles,
} from "lucide-react";

import { WorkspaceLayout } from "@/components/workspace/workspace-layout";
import { CollectionsGrid } from "@/components/workspace/collections-grid";
import { RecentActivity } from "@/components/workspace/recent-activity";

interface WorkspaceDashboardProps {
  userName: string;
}

const quickActions = [
  {
    title: "Research",
    description: "Search judgments and legal materials.",
    href: "/research",
    icon: Search,
  },
  {
    title: "AI Assistant",
    description: "Ask questions about Indian law.",
    href: "/ai",
    icon: Sparkles,
  },
  {
    title: "Drafts",
    description: "Create and manage legal drafts.",
    href: "/drafts",
    icon: FileText,
  },
  {
    title: "Bare Acts",
    description: "Browse Indian statutes and provisions.",
    href: "/bare-acts",
    icon: Gavel,
  },
];

export function WorkspaceDashboard({
  userName,
}: WorkspaceDashboardProps) {
  return (
    <WorkspaceLayout>
      <div className="space-y-10">
        <section className="space-y-2">
          <p className="text-sm font-medium text-primary">
            Your Workspace
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome back, {userName}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Your central workspace for legal research,
                drafting, and analysis.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Quick actions
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Jump directly into your legal workflow.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <a
                  key={action.title}
                  href={action.href}
                  className="group rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>

                  <h3 className="mt-5 font-semibold">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {action.description}
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Your collections
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Organize research and saved legal material in one
              place.
            </p>
          </div>

          <CollectionsGrid />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Recent activity
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your recent workspace activity will appear here.
            </p>
          </div>

          <RecentActivity />
        </section>
      </div>
    </WorkspaceLayout>
  );
}