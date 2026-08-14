"use client";

import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1600px]">
        <WorkspaceSidebar />

        <main className="min-w-0 flex-1">
          <div className="px-5 py-8 sm:px-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}