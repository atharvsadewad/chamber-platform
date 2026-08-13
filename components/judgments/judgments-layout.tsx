"use client";

import { AppShell } from "@/components/layout/app-shell";

import { useJudgments } from "@/hooks/use-judgments";

import { JudgmentsSearch } from "./judgments-search";
import { JudgmentsResults } from "./judgments-results";
import { JudgmentsSidebar } from "./judgments-sidebar";
import { JudgmentsAiPanel } from "./judgments-ai-panel";

export function JudgmentsLayout() {
  const judgments = useJudgments();

  return (
    <AppShell
      sidebar={<JudgmentsSidebar />}
      assistant={<JudgmentsAiPanel />}
    >
      <JudgmentsSearch judgments={judgments} />

      <div className="mt-6">
        <JudgmentsResults judgments={judgments} />
      </div>
    </AppShell>
  );
}