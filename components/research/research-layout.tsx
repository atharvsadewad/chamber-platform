import { ReactNode } from "react";

interface ResearchLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
  assistant: ReactNode;
}

export function ResearchLayout({
  sidebar,
  content,
  assistant,
}: ResearchLayoutProps) {
  return (
    <section className="container-laws-and-judgments py-8">
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="min-w-0">
          {sidebar}
        </aside>

        <main className="min-w-0">
          {content}

          <div className="mt-8 lg:hidden">
            {assistant}
          </div>
        </main>
      </div>
    </section>
  );
}