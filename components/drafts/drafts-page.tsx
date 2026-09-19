"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Folder,
  FolderOpen,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { supabase } from "@/providers/database/supabase";
import { cn } from "@/lib/utils";

type DraftFile = {
  type: "file";
  id: string;
  name: string;
  path: string;
  size?: number;
  updatedAt?: string;
};

type DraftFolder = {
  type: "folder";
  id: string;
  name: string;
  path: string;
  children: DraftNode[];
  loaded: boolean;
  loading: boolean;
  open?: boolean;
};

type DraftNode = DraftFolder | DraftFile;

type SearchResult = {
  id: string;
  name: string;
  path: string;
  folderPath: string;
  size?: number;
  updatedAt?: string;
};

const BUCKET = "drafts";
export default function DraftsPage() {
  const searchParams = useSearchParams();
  
  const [folders, setFolders] = React.useState<DraftFolder[]>(
    [],
  );

  const [search, setSearch] = React.useState(
    () => searchParams.get("q")?.trim() ?? "",
  );

  const [searchResults, setSearchResults] =
    React.useState<SearchResult[]>([]);

  const [searching, setSearching] =
    React.useState(false);

  const [loading, setLoading] =
    React.useState(true);

  const [error, setError] =
    React.useState<string | null>(null);

  const [previewFile, setPreviewFile] =
    React.useState<DraftFile | null>(null);

  const [aiOpen, setAiOpen] =
    React.useState(false);

  /*
   * ---------------------------------------------------------
   * LOAD ROOT FOLDERS ONLY
   * ---------------------------------------------------------
   */

  const loadRootFolders =
    React.useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: storageError } =
          await supabase.storage
            .from(BUCKET)
            .list("", {
              limit: 1000,
              offset: 0,
              sortBy: {
                column: "name",
                order: "asc",
              },
            });

        if (storageError) {
          throw storageError;
        }

        const rootFolders: DraftFolder[] = (
          data ?? []
        )
          .filter((item) => isFolder(item))
          .map((item) => ({
            type: "folder",
            id: `folder-${item.name}`,
            name: item.name,
            path: item.name,
            children: [],
            loaded: false,
            loading: false,
            open: false,
          }));

        setFolders(rootFolders);
      } catch (err) {
        console.error(
          "Draft library error:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load the draft library.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  React.useEffect(() => {
    void loadRootFolders();
  }, [loadRootFolders]);

  React.useEffect(() => {
    const query = searchParams.get("q")?.trim() ?? "";
    setSearch(query);
  }, [searchParams]);

  /*
   * ---------------------------------------------------------
   * GLOBAL SEARCH
   * ---------------------------------------------------------
   */

  React.useEffect(() => {
    const query = search.trim();

    if (!query) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const controller =
      new AbortController();

    const timeout = window.setTimeout(
      async () => {
        try {
          setSearching(true);
          setError(null);

          const response = await fetch(
            `/api/drafts/search?q=${encodeURIComponent(
              query,
            )}`,
            {
              method: "GET",
              cache: "no-store",
              signal: controller.signal,
            },
          );

          const payload =
            await response
              .json()
              .catch(() => null);

          if (
            !response.ok ||
            !payload?.success
          ) {
            throw new Error(
              payload?.message ||
                "Unable to search the draft library.",
            );
          }

          setSearchResults(
            Array.isArray(payload.data)
              ? payload.data
              : [],
          );
        } catch (err) {
          if (controller.signal.aborted) {
            return;
          }

          console.error(
            "Draft search error:",
            err,
          );

          setSearchResults([]);

          setError(
            err instanceof Error
              ? err.message
              : "Unable to search the draft library.",
          );
        } finally {
          if (!controller.signal.aborted) {
            setSearching(false);
          }
        }
      },
      300,
    );

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [search]);

  /*
   * ---------------------------------------------------------
   * LOAD A SINGLE FOLDER
   * ---------------------------------------------------------
   */

  async function loadFolder(
    folderPath: string,
  ) {
    setFolders((current) =>
      updateFolder(
        current,
        folderPath,
        (folder) => ({
          ...folder,
          loading: true,
        }),
      ),
    );

    try {
      const { data, error: storageError } =
        await supabase.storage
          .from(BUCKET)
          .list(folderPath, {
            limit: 1000,
            offset: 0,
            sortBy: {
              column: "name",
              order: "asc",
            },
          });

      if (storageError) {
        throw storageError;
      }

      const children: DraftNode[] = (
        data ?? []
      )
        .map((item): DraftNode => {
          const currentPath =
            `${folderPath}/${item.name}`;

          if (isFolder(item)) {
            return {
              type: "folder",
              id: `folder-${currentPath}`,
              name: item.name,
              path: currentPath,
              children: [],
              loaded: false,
              loading: false,
              open: false,
            };
          }

          return {
            type: "file",
            id: `file-${currentPath}`,
            name: item.name,
            path: currentPath,
            size:
              typeof item.metadata
                ?.size === "number"
                ? item.metadata.size
                : undefined,
            updatedAt:
              item.updated_at ??
              item.created_at ??
              undefined,
          };
        })
        .sort((a, b) => {
          if (
            a.type !== b.type
          ) {
            return a.type ===
              "folder"
              ? -1
              : 1;
          }

          return a.name.localeCompare(
            b.name,
          );
        });

      setFolders((current) =>
        updateFolder(
          current,
          folderPath,
          (folder) => ({
            ...folder,
            children,
            loaded: true,
            loading: false,
          }),
        ),
      );
    } catch (err) {
      console.error(
        "Folder load error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load this folder.",
      );

      setFolders((current) =>
        updateFolder(
          current,
          folderPath,
          (folder) => ({
            ...folder,
            loading: false,
          }),
        ),
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * TOGGLE FOLDER
   * ---------------------------------------------------------
   */

  async function toggleFolder(
    folderPath: string,
  ) {
    const folder = findFolder(
      folders,
      folderPath,
    );

    if (!folder) {
      return;
    }

    if (!folder.loaded) {
      await loadFolder(folderPath);
    }

    setFolders((current) =>
      updateFolder(
        current,
        folderPath,
        (item) => ({
          ...item,
          open: !item.open,
        }),
      ),
    );
  }

  /*
   * ---------------------------------------------------------
   * AUTO-OPEN SEARCH MATCH FOLDERS
   * ---------------------------------------------------------
   */

  React.useEffect(() => {
    if (
      !search.trim() ||
      searchResults.length === 0
    ) {
      return;
    }

    const folderPaths = Array.from(
      new Set(
        searchResults.map(
          (result) =>
            result.folderPath,
        ),
      ),
    );

    void openSearchFolders(
      folderPaths,
    );
  }, [searchResults]);

  async function openSearchFolders(
    paths: string[],
  ) {
    for (const path of paths) {
      await ensureFolderPathLoaded(
        path,
      );
    }
  }

  async function ensureFolderPathLoaded(
    folderPath: string,
  ) {
    const parts = folderPath
      .split("/")
      .filter(Boolean);

    if (parts.length === 0) {
      return;
    }

    let currentPath = "";

    for (const part of parts) {
      currentPath = currentPath
        ? `${currentPath}/${part}`
        : part;

      const folder = findFolder(
        folders,
        currentPath,
      );

      if (!folder) {
        continue;
      }

      if (!folder.loaded) {
        await loadFolder(
          currentPath,
        );
      }

      setFolders((current) =>
        updateFolder(
          current,
          currentPath,
          (item) => ({
            ...item,
            open: true,
          }),
        ),
      );
    }
  }

  const displayedSearchResults =
    search.trim()
      ? searchResults
      : [];

  return (
    <main className="min-h-screen bg-background">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="border-b border-border">
        <div className="container-laws-and-judgments py-8 sm:py-10">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent">
              <FileText className="h-3.5 w-3.5" />
              Legal Draft Library
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Drafts
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Browse, search and use legal
              document drafts.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="container-laws-and-judgments py-8 sm:py-10">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Draft Library
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Open a folder to load its documents.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadRootFolders()
            }
            disabled={loading}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            title="Refresh draft library"
          >
            <RefreshCw
              className={cn(
                "h-4 w-4",
                loading &&
                  "animate-spin",
              )}
            />

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>
        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search drafts across the entire library..."
            className="h-11 w-full rounded-xl border border-input bg-background pl-11 pr-11 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search status */}

        {search.trim() && (
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            {searching ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Searching the draft library...
              </>
            ) : (
              <>
                <Search className="h-3.5 w-3.5" />
                {displayedSearchResults.length}{" "}
                {displayedSearchResults.length ===
                1
                  ? "matching document"
                  : "matching documents"}
              </>
            )}
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mt-5 flex items-start justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                setError(null)
              }
              className="shrink-0"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Initial loading */}

        {loading && (
          <div className="mt-5 rounded-2xl border border-border bg-background">
            <div className="flex items-center gap-3 px-5 py-6 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading draft folders...
            </div>
          </div>
        )}

        {/* =================================================
            SEARCH RESULTS
        ================================================= */}

        {!loading &&
          search.trim() &&
          !searching &&
          displayedSearchResults.length >
            0 && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
              <div className="border-b border-border bg-secondary/30 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Search Results
                </p>
              </div>

              <div className="divide-y divide-border">
                {displayedSearchResults.map(
                  (result) => (
                    <SearchResultRow
                      key={result.id}
                      result={result}
                      onPreview={() =>
                        setPreviewFile({
                          type: "file",
                          id: result.id,
                          name: result.name,
                          path: result.path,
                          size: result.size,
                          updatedAt:
                            result.updatedAt,
                        })
                      }
                    />
                  ),
                )}
              </div>
            </div>
          )}

        {/* Search empty */}

        {!loading &&
          search.trim() &&
          !searching &&
          displayedSearchResults.length ===
            0 && (
            <div className="mt-5 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium text-foreground">
                No drafts found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try another document name or
                keyword.
              </p>
            </div>
          )}

        {/* =================================================
            FOLDER BROWSER
        ================================================= */}

        {!loading &&
          !search.trim() && (
            <>
              {folders.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-border px-6 py-12 text-center">
                  <Folder className="mx-auto h-8 w-8 text-muted-foreground" />

                  <p className="mt-3 text-sm font-medium text-foreground">
                    No draft folders available
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Add folders and documents
                    to the drafts storage bucket.
                  </p>
                </div>
              ) : (
                <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
                  {folders.map(
                    (folder) => (
                      <DraftFolder
                        key={folder.id}
                        node={folder}
                        level={0}
                        onToggle={
                          toggleFolder
                        }
                        onPreview={
                          setPreviewFile
                        }
                      />
                    ),
                  )}
                </div>
              )}
            </>
          )}
      </section>

      {/* =====================================================
          AI DRAFT ASSISTANT
      ===================================================== */}

      <button
        type="button"
        onClick={() =>
          setAiOpen(true)
        }
        className="fixed bottom-6 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg transition hover:scale-[1.02] hover:opacity-95 sm:bottom-7 sm:right-7"
      >
        <Sparkles className="h-4 w-4" />
        <span>Draft with AI</span>
      </button>

      {/* Preview */}

      {previewFile && (
        <DraftPreviewModal
          file={previewFile}
          onClose={() =>
            setPreviewFile(null)
          }
        />
      )}

      {/* AI modal */}

      {aiOpen && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onMouseDown={() =>
              setAiOpen(false)
            }
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>

                <h2 className="mt-4 font-serif text-2xl font-semibold">
                  Draft with AI
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  AI-assisted drafting will be
                  connected to the legal drafting
                  workflow here.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAiOpen(false)
                }
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Close AI Draft Assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-border bg-secondary/20 px-4 py-5 text-sm text-muted-foreground">
              Select a draft workflow or provide
              drafting instructions to begin.
            </div>

            <button
              type="button"
              onClick={() =>
                setAiOpen(false)
              }
              className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   FOLDER
========================================================= */

function DraftFolder({
  node,
  level,
  onToggle,
  onPreview,
}: {
  node: DraftFolder;
  level: number;
  onToggle: (
    path: string,
  ) => Promise<void>;
  onPreview: (
    file: DraftFile,
  ) => void;
}) {
  const hasChildren =
    node.children.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          void onToggle(node.path)
        }
        aria-expanded={node.open}
        className="flex w-full items-center gap-3 border-b border-border px-5 py-4 text-left transition-colors hover:bg-secondary/50"
        style={{
          paddingLeft: `${
            20 + level * 28
          }px`,
        }}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {node.loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : node.open ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </span>

        {node.open ? (
          <FolderOpen className="h-5 w-5 shrink-0 text-primary" />
        ) : (
          <Folder className="h-5 w-5 shrink-0 text-primary" />
        )}

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground sm:text-base">
          {node.name}
        </span>

        {node.loaded && (
          <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">
            {countFiles(
              node.children,
            )}{" "}
            {countFiles(
              node.children,
            ) === 1
              ? "draft"
              : "drafts"}
          </span>
        )}
      </button>

      {node.open &&
        node.loaded &&
        hasChildren && (
          <div>
            {node.children.map(
              (child) =>
                child.type ===
                "folder" ? (
                  <DraftFolder
                    key={child.id}
                    node={child}
                    level={
                      level + 1
                    }
                    onToggle={
                      onToggle
                    }
                    onPreview={
                      onPreview
                    }
                  />
                ) : (
                  <DraftFile
                    key={child.id}
                    node={child}
                    level={
                      level + 1
                    }
                    onPreview={
                      onPreview
                    }
                  />
                ),
            )}
          </div>
        )}

      {node.open &&
        node.loaded &&
        !hasChildren && (
          <div
            className="border-b border-border/70 px-5 py-5 text-sm text-muted-foreground"
            style={{
              paddingLeft: `${
                48 +
                level * 28
              }px`,
            }}
          >
            This folder is empty.
          </div>
        )}
    </div>
  );
}

/* =========================================================
   FILE
========================================================= */

function DraftFile({
  node,
  level,
  onPreview,
}: {
  node: DraftFile;
  level: number;
  onPreview: (
    file: DraftFile,
  ) => void;
}) {
  const [
    downloading,
    setDownloading,
  ] = React.useState(false);

  async function handleDownload() {
    if (downloading) {
      return;
    }

    try {
      setDownloading(true);

      const {
        data,
        error,
      } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(
          node.path,
          300,
          {
            download: node.name,
          },
        );

      if (error) {
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error(
          "Unable to create document download URL.",
        );
      }

      const link =
        document.createElement(
          "a",
        );

      link.href =
        data.signedUrl;
      link.download =
        node.name;
      link.target = "_blank";
      link.rel =
        "noopener noreferrer";

      document.body.appendChild(
        link,
      );

      link.click();
      link.remove();
    } catch (error) {
      console.error(
        "Draft download error:",
        error,
      );

      window.alert(
        "Unable to download this document.",
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className="group flex min-h-[68px] items-center gap-3 border-b border-border/70 px-5 py-3 transition-colors hover:bg-secondary/40"
      style={{
        paddingLeft: `${
          20 + level * 28
        }px`,
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
          {getExtension(
            node.name,
          )}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() =>
            onPreview(node)
          }
          title="Preview document"
          aria-label={`Preview ${node.name}`}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Eye className="h-4 w-4" />

          <span className="hidden sm:inline">
            Preview
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            void handleDownload()
          }
          disabled={downloading}
          title="Download document"
          aria-label={`Download ${node.name}`}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}

          <span className="hidden sm:inline">
            Download
          </span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   SEARCH RESULT
========================================================= */

function SearchResultRow({
  result,
  onPreview,
}: {
  result: SearchResult;
  onPreview: () => void;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <FileText className="h-4 w-4 text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium text-foreground"
          title={result.name}
        >
          {result.name}
        </p>

        <p className="mt-1 truncate text-xs text-muted-foreground">
          {result.path}
        </p>
      </div>

      <button
        type="button"
        onClick={onPreview}
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Eye className="h-4 w-4" />

        <span className="hidden sm:inline">
          Preview
        </span>
      </button>
    </div>
  );
}

/* =========================================================
   PREVIEW MODAL
========================================================= */

function DraftPreviewModal({
  file,
  onClose,
}: {
  file: DraftFile;
  onClose: () => void;
}) {
  const [url, setUrl] =
    React.useState("");

  const [loading, setLoading] =
    React.useState(true);

  const [error, setError] =
    React.useState("");

  React.useEffect(() => {
    let cancelled = false;

    async function loadPreview() {
      try {
        setLoading(true);
        setError("");

        const {
          data,
          error,
        } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(
            file.path,
            600,
          );

        if (error) {
          throw error;
        }

        if (!data?.signedUrl) {
          throw new Error(
            "Unable to create preview URL.",
          );
        }

        if (!cancelled) {
          setUrl(
            data.signedUrl,
          );
        }
      } catch (previewError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Draft preview error:",
          previewError,
        );

        setError(
          previewError instanceof
            Error
            ? previewError.message
            : "Unable to preview this document.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPreview();

    return () => {
      cancelled = true;
    };
  }, [file.path]);

  React.useEffect(() => {
    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [onClose]);

  const extension =
    getExtension(file.name);

  const isPdf =
    extension === "PDF";

  const isImage =
    extension === "PNG" ||
    extension === "JPG" ||
    extension === "JPEG" ||
    extension === "WEBP" ||
    extension === "GIF";

  async function download() {
    try {
      const {
        data,
        error,
      } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(
          file.path,
          300,
          {
            download:
              file.name,
          },
        );

      if (error) {
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error(
          "Unable to create download URL.",
        );
      }

      const link =
        document.createElement(
          "a",
        );

      link.href =
        data.signedUrl;
      link.download =
        file.name;
      link.target = "_blank";
      link.rel =
        "noopener noreferrer";

      document.body.appendChild(
        link,
      );

      link.click();
      link.remove();
    } catch (downloadError) {
      console.error(
        "Preview download error:",
        downloadError,
      );

      window.alert(
        "Unable to download this document.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onMouseDown={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="draft-preview-title"
        className="absolute left-1/2 top-1/2 flex h-[90vh] w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Document Preview
            </p>

            <h2
              id="draft-preview-title"
              className="mt-1 truncate text-sm font-semibold text-foreground"
              title={file.name}
            >
              {file.name}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                void download()
              }
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Download className="h-4 w-4" />

              <span className="hidden sm:inline">
                Download
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 bg-secondary/20">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />

              <p className="mt-4 text-sm font-medium">
                Preparing preview...
              </p>
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <FileText className="h-8 w-8 text-muted-foreground" />

              <h3 className="mt-4 text-base font-semibold">
                Preview unavailable
              </h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void download()
                }
                className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Download document
              </button>
            </div>
          ) : isPdf &&
            url ? (
            <iframe
              src={url}
              title={`Preview of ${file.name}`}
              className="h-full w-full border-0"
            />
          ) : isImage &&
            url ? (
            <div className="flex h-full items-center justify-center overflow-auto p-6">
              <img
                src={url}
                alt={file.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />

              <h3 className="mt-4 text-base font-semibold">
                Preview not available
                for {extension}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                This document format cannot
                be rendered directly in the
                browser. You can download the
                original document instead.
              </p>

              <button
                type="button"
                onClick={() =>
                  void download()
                }
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function isFolder(item: {
  metadata?: Record<
    string,
    unknown
  > | null;
}) {
  return (
    !item.metadata ||
    item.metadata.mimetype ===
      undefined
  );
}

/*
 * IMPORTANT:
 *
 * This implementation never returns undefined.
 * That fixes the TypeScript error from the previous
 * recursive implementation.
 */
function updateFolder(
  folders: DraftFolder[],
  targetPath: string,
  updater: (
    folder: DraftFolder,
  ) => DraftFolder,
): DraftFolder[] {
  return folders.map(
    (folder): DraftFolder => {
      if (
        folder.path ===
        targetPath
      ) {
        return updater(folder);
      }

      if (
        folder.children.length ===
        0
      ) {
        return folder;
      }

      const updatedChildren =
        folder.children.map(
          (
            child,
          ): DraftNode => {
            if (
              child.type ===
              "file"
            ) {
              return child;
            }

            const updated =
              updateFolder(
                [child],
                targetPath,
                updater,
              );

            return (
              updated[0] ?? child
            );
          },
        );

      return {
        ...folder,
        children:
          updatedChildren,
      };
    },
  );
}

function findFolder(
  folders: DraftFolder[],
  targetPath: string,
): DraftFolder | null {
  for (const folder of folders) {
    if (
      folder.path ===
      targetPath
    ) {
      return folder;
    }

    const nested =
      folder.children.filter(
        (
          child,
        ): child is DraftFolder =>
          child.type ===
          "folder",
      );

    const found =
      findFolder(
        nested,
        targetPath,
      );

    if (found) {
      return found;
    }
  }

  return null;
}

function countFiles(
  nodes: DraftNode[],
): number {
  return nodes.reduce(
    (total, node) => {
      if (
        node.type ===
        "file"
      ) {
        return total + 1;
      }

      return (
        total +
        countFiles(
          node.children,
        )
      );
    },
    0,
  );
}

function getExtension(
  filename: string,
): string {
  const parts =
    filename.split(".");

  if (
    parts.length <
    2
  ) {
    return "FILE";
  }

  return (
    parts.pop()?.toUpperCase() ||
    "FILE"
  );
}