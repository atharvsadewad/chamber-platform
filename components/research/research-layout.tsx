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

      <div className="grid gap-6 xl:grid-cols-[260px_1fr_360px]">

        <aside>

          {sidebar}

        </aside>

        <main>

          {content}

        </main>

        <aside className="hidden xl:block">

          {assistant}

        </aside>

      </div>

    </section>
  );
}