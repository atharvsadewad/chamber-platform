"use client";

import * as React from "react";
import {
  Bookmark,
  Download,
  Eye,
  FileText,
} from "lucide-react";

import type { DraftFile } from "@/lib/drafts/mock-drafts";

type DraftFileRowProps = {
  file: DraftFile;
  level?: number;
};

export function DraftFileRow({
  file,
  level = 0,
}: DraftFileRowProps) {
  const [bookmarked, setBookmarked] = React.useState(false);

  const handlePreview = () => {
    console.log("Preview:", file.name);
  };

  const handleDownload = () => {
    console.log("Download:", file.name);
  };

  const handleUseDraft = () => {
    console.log("Use draft:", file.name);
  };

  return (
    <div
      className="group flex min-h-[72px] items-center gap-3 border-b border-border/70 px-5 py-3 transition-colors hover:bg-secondary/40"
      style={{
        paddingLeft: `${20 + level * 28}px`,
      }}
    >
      {/* File icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FileText className="h-4 w-4" />
      </div>

      {/* File information */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium text-foreground"
          title={file.name}
        >
          {file.name}
        </p>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {file.extension}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {/* Preview */}
        <button
          type="button"
          title="Preview draft"
          aria-label={`Preview ${file.name}`}
          onClick={handlePreview}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Eye className="h-4 w-4" />
        </button>

        {/* Download */}
        <button
          type="button"
          title="Download draft"
          aria-label={`Download ${file.name}`}
          onClick={handleDownload}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Download className="h-4 w-4" />
        </button>

        {/* Bookmark */}
        <button
          type="button"
          title={
            bookmarked
              ? "Remove bookmark"
              : "Bookmark draft"
          }
          aria-label={
            bookmarked
              ? `Remove bookmark from ${file.name}`
              : `Bookmark ${file.name}`
          }
          onClick={() => setBookmarked((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bookmark
            className="h-4 w-4"
            fill={bookmarked ? "currentColor" : "none"}
          />
        </button>

        {/* Use Draft */}
        <button
          type="button"
          onClick={handleUseDraft}
          className="ml-1 inline-flex rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <span className="hidden sm:inline">
            Use Draft
          </span>

          <span className="sm:hidden">
            Use
          </span>
        </button>
      </div>
    </div>
  );
}