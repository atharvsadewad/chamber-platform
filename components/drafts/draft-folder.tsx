"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
} from "lucide-react";

import type {
  DraftFolder,
  DraftNode,
} from "@/lib/drafts/mock-drafts";

import { DraftFileRow } from "@/components/drafts/draft-file";

type DraftFolderProps = {
  folder: DraftFolder;
  level?: number;
};

export function DraftFolderRow({
  folder,
  level = 0,
}: DraftFolderProps) {
  const [open, setOpen] = React.useState(false);

  const fileCount = countFiles(folder);
  const hasChildren = folder.children.length > 0;

  return (
    <div>
      {/* Folder row */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex w-full items-center gap-3 border-b border-border px-5 py-4 text-left transition-colors hover:bg-secondary/50"
        style={{
          paddingLeft: `${20 + level * 28}px`,
        }}
        aria-expanded={open}
      >
        {/* Chevron */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {hasChildren ? (
            open ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : null}
        </span>

        {/* Folder icon */}
        {open ? (
          <FolderOpen className="h-5 w-5 shrink-0 text-primary" />
        ) : (
          <Folder className="h-5 w-5 shrink-0 text-primary" />
        )}

        {/* Folder name */}
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground sm:text-base">
          {folder.name}
        </span>

        {/* File count */}
        <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">
          {fileCount} {fileCount === 1 ? "draft" : "drafts"}
        </span>
      </button>

      {/* Children */}
      {open && hasChildren && (
        <div>
          {folder.children.map((node) => (
            <DraftNodeRenderer
              key={node.id}
              node={node}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Recursive node renderer
----------------------------------------- */

function DraftNodeRenderer({
  node,
  level,
}: {
  node: DraftNode;
  level: number;
}) {
  if (node.type === "folder") {
    return (
      <DraftFolderRow
        folder={node}
        level={level}
      />
    );
  }

  return (
    <DraftFileRow
      file={node}
      level={level}
    />
  );
}

/* ----------------------------------------
   Count files recursively
----------------------------------------- */

function countFiles(folder: DraftFolder): number {
  return folder.children.reduce((total, child) => {
    if (child.type === "file") {
      return total + 1;
    }

    return total + countFiles(child);
  }, 0);
}
