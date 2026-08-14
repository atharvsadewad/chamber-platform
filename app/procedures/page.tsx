"use client";

import * as React from "react";
import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Folder,
  FolderOpen,
  Loader2,
  Search,
} from "lucide-react";

import { supabase } from "@/providers/database/supabase";

type ProcedureFile = {
  id: string;
  name: string;
  path: string;
  extension: string;
  url: string;
};

type ProcedureFolder = {
  name: string;
  path: string;
  files: ProcedureFile[];
  children: ProcedureFolder[];
};

const BUCKET = "procedures";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

function getExtension(name: string) {
  const parts = name.split(".");
  const extension = parts[parts.length - 1];

  if (!extension || parts.length < 2) {
    return "FILE";
  }

  return extension.toUpperCase();
}

function getFileName(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 1] || path;
}

function buildTree(files: ProcedureFile[]): ProcedureFolder {
  const root: ProcedureFolder = {
    name: "Procedures",
    path: "",
    files: [],
    children: [],
  };

  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean);

    if (parts.length === 1) {
      root.files.push(file);
      continue;
    }

    let current = root;

    // Ignore the actual filename.
    const folders = parts.slice(0, -1);

    for (const folderName of folders) {
      let child = current.children.find(
        (folder) => folder.name === folderName
      );

      if (!child) {
        child = {
          name: folderName,
          path: current.path
            ? `${current.path}/${folderName}`
            : folderName,
          files: [],
          children: [],
        };

        current.children.push(child);
      }

      current = child;
    }

    current.files.push(file);
  }

  sortTree(root);

  return root;
}

function sortTree(folder: ProcedureFolder) {
  folder.children.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  folder.files.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  for (const child of folder.children) {
    sortTree(child);
  }
}

function countFiles(folder: ProcedureFolder): number {
  return (
    folder.files.length +
    folder.children.reduce(
      (total, child) => total + countFiles(child),
      0
    )
  );
}

function flattenFiles(folder: ProcedureFolder): ProcedureFile[] {
  return [
    ...folder.files,
    ...folder.children.flatMap((child) =>
      flattenFiles(child)
    ),
  ];
}

/* -------------------------------------------------------
   Page
------------------------------------------------------- */

export default function ProceduresPage() {
  const [files, setFiles] = React.useState<ProcedureFile[]>([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [bookmarked, setBookmarked] = React.useState<
    Set<string>
  >(new Set());

  React.useEffect(() => {
    loadProcedures();
  }, []);

  async function loadProcedures() {
    setLoading(true);
    setError("");

    try {
      const { data, error: storageError } =
        await supabase.storage
          .from(BUCKET)
          .list("", {
            limit: 1000,
            sortBy: {
              column: "name",
              order: "asc",
            },
          });

      if (storageError) {
        throw storageError;
      }

      if (!data) {
        setFiles([]);
        return;
      }

      /*
       * Supabase's list() returns folders at the current level.
       *
       * We recursively walk the bucket so that the frontend
       * automatically discovers folders and files.
       */

      const discovered: ProcedureFile[] = [];

      async function walkFolder(folderPath: string) {
        const { data: entries, error } =
          await supabase.storage
            .from(BUCKET)
            .list(folderPath, {
              limit: 1000,
              sortBy: {
                column: "name",
                order: "asc",
              },
            });

        if (error) {
          throw error;
        }

        for (const entry of entries ?? []) {
          const currentPath = folderPath
            ? `${folderPath}/${entry.name}`
            : entry.name;

          /*
           * Supabase Storage folders have no MIME type.
           * A file normally has metadata, while a folder does not.
           */
          const isFile = Boolean(
            entry.metadata &&
              typeof entry.metadata === "object"
          );

          if (isFile) {
            const { data: publicData } =
              supabase.storage
                .from(BUCKET)
                .getPublicUrl(currentPath);

            discovered.push({
              id: currentPath,
              name: getFileName(currentPath),
              path: currentPath,
              extension: getExtension(currentPath),
              url: publicData.publicUrl,
            });
          } else {
            await walkFolder(currentPath);
          }
        }
      }

      await walkFolder("");

      setFiles(discovered);
    } catch (err) {
      console.error("Procedure storage error:", err);

      setError(
        "Unable to load procedures. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleBookmark(fileId: string) {
    setBookmarked((previous) => {
      const next = new Set(previous);

      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }

      return next;
    });
  }

  function openFile(file: ProcedureFile) {
    window.open(file.url, "_blank", "noopener,noreferrer");
  }

  function downloadFile(file: ProcedureFile) {
    const link = document.createElement("a");

    link.href = file.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = file.name;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const tree = React.useMemo(
    () => buildTree(files),
    [files]
  );

  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const filteredFiles = React.useMemo(() => {
    if (!normalizedSearch) return [];

    return flattenFiles(tree).filter((file) =>
      file.name
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [tree, normalizedSearch]);

  return (
    <main className="container-laws-and-judgments py-10 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Procedures
        </p>

        <h1 className="mt-2 text-4xl font-serif font-bold">
          Legal Procedures
        </h1>

        <p className="mt-3 max-w-3xl text-muted-foreground">
          Browse procedural guides and legal materials
          organized for quick reference.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search procedures..."
          className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-border bg-background">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading procedures...
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={loadProcedures}
            className="mt-3 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty bucket */}
      {!loading &&
        !error &&
        files.length === 0 && (
          <div className="rounded-2xl border border-border bg-background p-10 text-center">
            <Folder className="mx-auto h-9 w-9 text-muted-foreground" />

            <h2 className="mt-4 text-lg font-semibold">
              No procedures available yet
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Procedure documents uploaded to the
              library will appear here.
            </p>
          </div>
        )}

      {/* Search Results */}
      {!loading &&
        !error &&
        normalizedSearch && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Search Results
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredFiles.length}{" "}
                  {filteredFiles.length === 1
                    ? "result"
                    : "results"}{" "}
                  found
                </p>
              </div>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="rounded-2xl border border-border bg-background p-10 text-center">
                <Search className="mx-auto h-8 w-8 text-muted-foreground" />

                <h3 className="mt-4 font-semibold">
                  No procedures found
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different procedure name or
                  keyword.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-background">
                {filteredFiles.map((file) => (
                  <ProcedureFileRow
                    key={file.id}
                    file={file}
                    bookmarked={bookmarked.has(file.id)}
                    onBookmark={() =>
                      toggleBookmark(file.id)
                    }
                    onPreview={() => openFile(file)}
                    onDownload={() =>
                      downloadFile(file)
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}

      {/* Library Tree */}
      {!loading &&
        !error &&
        !normalizedSearch &&
        files.length > 0 && (
          <section>
            <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Procedure Library
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Browse procedures by category and
                  document.
                </p>
              </div>

              <span className="hidden text-sm text-muted-foreground sm:block">
                {countFiles(tree)}{" "}
                {countFiles(tree) === 1
                  ? "document"
                  : "documents"}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-background">
              {tree.children.map((folder) => (
                <ProcedureFolderRow
                  key={folder.path}
                  folder={folder}
                  level={0}
                  bookmarked={bookmarked}
                  onBookmark={toggleBookmark}
                  onPreview={openFile}
                  onDownload={downloadFile}
                />
              ))}

              {tree.files.map((file) => (
                <ProcedureFileRow
                  key={file.id}
                  file={file}
                  bookmarked={bookmarked.has(
                    file.id
                  )}
                  onBookmark={() =>
                    toggleBookmark(file.id)
                  }
                  onPreview={() => openFile(file)}
                  onDownload={() =>
                    downloadFile(file)
                  }
                />
              ))}
            </div>
          </section>
        )}
    </main>
  );
}

/* -------------------------------------------------------
   Folder
------------------------------------------------------- */

function ProcedureFolderRow({
  folder,
  level,
  bookmarked,
  onBookmark,
  onPreview,
  onDownload,
}: {
  folder: ProcedureFolder;
  level: number;
  bookmarked: Set<string>;
  onBookmark: (id: string) => void;
  onPreview: (file: ProcedureFile) => void;
  onDownload: (file: ProcedureFile) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const fileCount = countFiles(folder);

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className="group flex w-full items-center gap-3 border-b border-border px-5 py-4 text-left transition-colors hover:bg-secondary/50"
        style={{
          paddingLeft: `${20 + level * 28}px`,
        }}
        aria-expanded={open}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </span>

        {open ? (
          <FolderOpen className="h-5 w-5 shrink-0 text-primary" />
        ) : (
          <Folder className="h-5 w-5 shrink-0 text-primary" />
        )}

        <span className="min-w-0 flex-1 truncate text-sm font-medium sm:text-base">
          {folder.name}
        </span>

        <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">
          {fileCount}{" "}
          {fileCount === 1
            ? "document"
            : "documents"}
        </span>
      </button>

      {open && (
        <div>
          {folder.children.map((child) => (
            <ProcedureFolderRow
              key={child.path}
              folder={child}
              level={level + 1}
              bookmarked={bookmarked}
              onBookmark={onBookmark}
              onPreview={onPreview}
              onDownload={onDownload}
            />
          ))}

          {folder.files.map((file) => (
            <ProcedureFileRow
              key={file.id}
              file={file}
              level={level + 1}
              bookmarked={bookmarked.has(
                file.id
              )}
              onBookmark={() =>
                onBookmark(file.id)
              }
              onPreview={() => onPreview(file)}
              onDownload={() =>
                onDownload(file)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   File
------------------------------------------------------- */

function ProcedureFileRow({
  file,
  level = 0,
  bookmarked,
  onBookmark,
  onPreview,
  onDownload,
}: {
  file: ProcedureFile;
  level?: number;
  bookmarked: boolean;
  onBookmark: () => void;
  onPreview: () => void;
  onDownload: () => void;
}) {
  return (
    <div
      className="group flex min-h-[72px] items-center gap-3 border-b border-border/70 px-5 py-3 transition-colors hover:bg-secondary/40"
      style={{
        paddingLeft: `${20 + level * 28}px`,
      }}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FileText className="h-4 w-4" />
      </div>

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

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {/* View */}
        <button
          type="button"
          title="View procedure"
          aria-label={`View ${file.name}`}
          onClick={onPreview}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Eye className="h-4 w-4" />
        </button>

        {/* Download */}
        <button
          type="button"
          title="Download procedure"
          aria-label={`Download ${file.name}`}
          onClick={onDownload}
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
              : "Bookmark procedure"
          }
          aria-label={
            bookmarked
              ? `Remove bookmark from ${file.name}`
              : `Bookmark ${file.name}`
          }
          onClick={onBookmark}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bookmark
            className="h-4 w-4"
            fill={
              bookmarked
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </div>
    </div>
  );
}