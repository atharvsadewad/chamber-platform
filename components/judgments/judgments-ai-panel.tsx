import {
  BookOpen,
  BrainCircuit,
  FileText,
  Gavel,
  Scale,
  Sparkles,
} from "lucide-react";

interface PanelProps {
  title: string;
  icon: React.ReactNode;
}

export function JudgmentsAiPanel() {
  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />

          <h2 className="font-semibold">
            Judgment Intelligence
          </h2>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Select a judgment to begin AI-assisted legal research.
        </p>
      </div>

      {/* Panels */}
      <div className="space-y-6 p-5">
        <Panel
          title="AI Summary"
          icon={<BrainCircuit className="h-4 w-4" />}
        />

        <Panel
          title="Ratio Decidendi"
          icon={<Scale className="h-4 w-4" />}
        />

        <Panel
          title="Key Issues"
          icon={<Gavel className="h-4 w-4" />}
        />

        <Panel
          title="Statutes Cited"
          icon={<BookOpen className="h-4 w-4" />}
        />

        <Panel
          title="Related Cases"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}

function Panel({ title, icon }: PanelProps) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <div className="text-primary">
          {icon}
        </div>

        <h3 className="text-sm font-medium">
          {title}
        </h3>
      </div>

      <div className="mt-3 rounded-lg border border-dashed bg-muted/20 p-4">
        <p className="text-xs leading-6 text-muted-foreground">
          Available after selecting a judgment.
        </p>
      </div>
    </section>
  );
}