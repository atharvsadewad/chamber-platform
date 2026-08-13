"use client";

import { ReactNode, useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  assistant?: ReactNode;
}

export function AppShell({
  children,
  header,
  sidebar,
  assistant,
}: AppShellProps) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  return (
    <div className="container mx-auto max-w-[1800px] px-4 py-6 lg:px-6">

      {/* Header */}
      {header && (
        <div className="mb-6">
          {header}
        </div>
      )}

      <div
        className={cn(
          "grid gap-6",
          assistant
            ? "grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_360px]"
            : "grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)]"
        )}
      >

        {/* LEFT SIDEBAR */}

        {sidebar && (
          <aside
            className={cn(
              "hidden xl:block",
              leftCollapsed ? "w-20" : "w-full"
            )}
          >
            <div className="sticky top-24">

              <div className="relative rounded-2xl border bg-card shadow-sm">

                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-3 top-3 z-20"
                  onClick={() => setLeftCollapsed(!leftCollapsed)}
                >
                  {leftCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4" />
                  )}
                </Button>

                <div
                  className={cn(
                    "transition-all duration-300",
                    leftCollapsed
                      ? "pointer-events-none opacity-0 h-0 overflow-hidden"
                      : "opacity-100"
                  )}
                >
                  {sidebar}
                </div>

              </div>

            </div>
          </aside>
        )}

        {/* CENTER */}

        <main className="min-w-0">
          {children}
        </main>

        {/* AI PANEL */}

        {assistant && (
          <aside
            className={cn(
              "hidden xl:block",
              rightCollapsed ? "w-20" : "w-full"
            )}
          >
            <div className="sticky top-24">

              <div className="relative rounded-2xl border bg-card shadow-sm">

                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-3 top-3 z-20"
                  onClick={() => setRightCollapsed(!rightCollapsed)}
                >
                  {rightCollapsed ? (
                    <PanelRightOpen className="h-4 w-4" />
                  ) : (
                    <PanelRightClose className="h-4 w-4" />
                  )}
                </Button>

                <div
                  className={cn(
                    "transition-all duration-300",
                    rightCollapsed
                      ? "pointer-events-none opacity-0 h-0 overflow-hidden"
                      : "opacity-100"
                  )}
                >
                  {assistant}
                </div>

              </div>

            </div>
          </aside>
        )}

      </div>

    </div>
  );
}