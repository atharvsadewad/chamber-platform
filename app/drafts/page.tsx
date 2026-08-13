"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Folder,
  FolderOpen,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/providers/database/supabase";
import { cn } from "@/lib/utils";

type DraftFile = {
  type: "file";
  id: string;
  name: string;
  path: string;
};

type DraftFolder = {
  type: "folder";
  id: string;
  name: string;
  path: string;
  children: DraftNode[];
};

type DraftNode = DraftFolder | DraftFile;

const BUCKET = "drafts";

export default function DraftsPage() {
  const [tree, setTree] = React.useState<DraftFolder | null>(null);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadDrafts = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const root = await buildFolder("");
      
      setTree({
        type: "folder",
        id: "root",
        name: "Draft Library",
        path: "",
        children: root,
      });
    } catch (err) {
      console.error("Draft library error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load the draft library."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const filteredTree = React.useMemo(() => {
    if (!tree) return null;

    const query = search.trim().toLowerCase();

    if (!query) {
      return tree;
    }

    return {
      ...tree,
      children: filterTree(tree.children, query),
    };
  }, [tree, search]);

  return (
    <main className="min-h-screen bg-background">
      {/* Page header */}
      <section className="border-b border-border">
        <div className="container-laws-and-judgments py-8 sm:py-10">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
              <FileText className="h-3.5 w-3.5" />
              Legal Draft Library
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Drafts
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Browse, search and use legal document drafts.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container-laws-and-judgments py-8 sm:py-10">
        {/* Library heading */}
        <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Draft Library
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Folders and documents from the Laws & Judgments library.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDrafts}
            disabled={loading}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            title="Refresh draft library"
          >
            <RefreshCw
              className={cn(
                "h-4 w-4",
                loading && "animate-spin"
              )}
            />

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search drafts by name..."
            className="h-11 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-5 rounded-2xl border border-border bg-background">
            <div className="flex items-center gap-3 px-5 py-6 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading draft library...
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredTree &&
          filteredTree.children.length === 0 && (
            <div className="mt-5 rounded-2xl border border-border px-6 py-12 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium text-foreground">
                {search.trim()
                  ? "No drafts found"
                  : "No drafts available"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {search.trim()
                  ? "Try another search term."
                  : "Upload documents to the drafts bucket in Supabase."}
              </p>
            </div>
          )}

        {/* Draft tree */}
        {!loading &&
          !error &&
          filteredTree &&
          filteredTree.children.length > 0 && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
              {filteredTree.children.map((node) => (
                <DraftNode
                  key={node.id}
                  node={node}
                  level={0}
                />
              ))}
            </div>
          )}
      </section>

      {/* AI Draft Assistant trigger */}
      <button
        type="button"
        onClick={() => {
          console.log("AI Draft Assistant");
        }}
        className="fixed bottom-6 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:scale-[1.02] hover:opacity-95 sm:bottom-7 sm:right-7"
      >
        <Sparkles className="h-4 w-4" />
        <span>Draft with AI</span>
      </button>
    </main>
  );
}

/* =========================================================
   Recursive Draft Node
========================================================= */

function DraftNode({
  node,
  level,
}: {
  node: DraftNode;
  level: number;
}) {
  if (node.type === "file") {
    return <DraftFile node={node} level={level} />;
  }

  return <DraftFolder node={node} level={level} />;
}

/* =========================================================
   Folder
========================================================= */

function DraftFolder({
  node,
  level,
}: {
  node: DraftFolder;
  level: number;
}) {
  const [open, setOpen] = React.useState(false);

  const fileCount = countFiles(node.children);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 border-b border-border px-5 py-4 text-left transition-colors hover:bg-secondary/50"
        style={{
          paddingLeft: `${20 + level * 28}px`,
        }}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {hasChildren &&
            (open ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ))}
        </span>

        {open ? (
          <FolderOpen className="h-5 w-5 shrink-0 text-primary" />
        ) : (
          <Folder className="h-5 w-5 shrink-0 text-primary" />
        )}

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground sm:text-base">
          {node.name}
        </span>

        <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">
          {fileCount} {fileCount === 1 ? "draft" : "drafts"}
        </span>
      </button>

      {open && hasChildren && (
        <div>
          {node.children.map((child) => (
            <DraftNode
              key={child.id}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   File
========================================================= */

function DraftFile({
  node,
  level,
}: {
  node: DraftFile;
  level: number;
}) {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (downloading) return;

    try {
      setDownloading(true);

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(node.path, 300);

      if (error) {
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error("Unable to create document URL.");
      }

      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Download error:", error);
      alert("Unable to open this document.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="group flex min-h-[68px] items-center gap-3 border-b border-border/70 px-5 py-3 transition-colors hover:bg-secondary/40"
      style={{
        paddingLeft: `${20 + level * 28}px`,
      }}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <FileText className="h-4 w-4 text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium text-foreground"
          title={node.name}
        >
          {node.name}
        </p>

        <p className="mt-0.5 text-xs uppercase text-muted-foreground">
          {getExtension(node.name)}
        </p>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        title="Open document"
        aria-label={`Open ${node.name}`}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        {downloading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

/* =========================================================
   Supabase Storage → Recursive Tree
========================================================= */

async function buildFolder(path: string): Promise<DraftNode[]> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(path, {
      limit: 1000,
      offset: 0,
      sortBy: {
        column: "name",
        order: "asc",
      },
    });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  const nodes: DraftNode[] = [];

  for (const item of data) {
    /*
     * Supabase Storage represents folders as entries without
     * a file extension / metadata.
     */
    const isFolder =
      !item.metadata ||
      item.metadata === null ||
      item.metadata.mimetype === undefined;

    const currentPath = path
      ? `${path}/${item.name}`
      : item.name;

    if (isFolder) {
      const children = await buildFolder(currentPath);

      nodes.push({
        type: "folder",
        id: `folder-${currentPath}`,
        name: item.name,
        path: currentPath,
        children,
      });
    } else {
      nodes.push({
        type: "file",
        id: `file-${currentPath}`,
        name: item.name,
        path: currentPath,
      });
    }
  }

  return nodes;
}

/* =========================================================
   Search
========================================================= */

function filterTree(
  nodes: DraftNode[],
  query: string
): DraftNode[] {
  const result: DraftNode[] = [];

  for (const node of nodes) {
    if (node.type === "file") {
      const matches =
        node.name.toLowerCase().includes(query) ||
        node.path.toLowerCase().includes(query);

      if (matches) {
        result.push(node);
      }

      continue;
    }

    const folderMatches = node.name
      .toLowerCase()
      .includes(query);

    const filteredChildren = filterTree(
      node.children,
      query
    );

    if (folderMatches || filteredChildren.length > 0) {
      result.push({
        ...node,
        children: folderMatches
          ? node.children
          : filteredChildren,
      });
    }
  }

  return result;
}

/* =========================================================
   Helpers
========================================================= */

function countFiles(nodes: DraftNode[]): number {
  return nodes.reduce((total, node) => {
    if (node.type === "file") {
      return total + 1;
    }

    return total + countFiles(node.children);
  }, 0);
}

function getExtension(filename: string): string {
  const parts = filename.split(".");

  if (parts.length < 2) {
    return "FILE";
  }

  return parts.pop()?.toUpperCase() || "FILE";
}