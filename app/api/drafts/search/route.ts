import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const BUCKET = "drafts";

type SearchResult = {
  id: string;
  name: string;
  path: string;
  folderPath: string;
  size?: number;
  updatedAt?: string;
};

type StorageItem = {
  name: string;
  id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  metadata?: {
    size?: number;
    mimetype?: string;
    [key: string]: unknown;
  } | null;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query =
      searchParams.get("q")?.trim().toLowerCase() || "";

    if (!query) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },

          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(
                ({ name, value, options }) => {
                  cookieStore.set(name, value, options);
                },
              );
            } catch {
              /*
               * This route only reads Storage data.
               * Cookie-setting failures can safely be ignored.
               */
            }
          },
        },
      },
    );

    const results: SearchResult[] = [];

    await searchFolder(
      supabase,
      "",
      query,
      results,
    );

    results.sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error(
      "Draft search API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to search the draft library.",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================================================
   OPTIMIZED RECURSIVE STORAGE SEARCH
========================================================= */

async function searchFolder(
  supabase: ReturnType<typeof createServerClient>,
  path: string,
  query: string,
  results: SearchResult[],
) {
  const {
    data,
    error,
  } = await supabase.storage
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

  if (!data?.length) {
    return;
  }

  const folders: string[] = [];

  /*
   * Process files in the current folder immediately.
   * Folder traversal is collected separately so all
   * subfolders can be searched concurrently.
   */
  for (const item of data as StorageItem[]) {
    const currentPath = path
      ? `${path}/${item.name}`
      : item.name;

    const isFolder =
      !item.metadata ||
      item.metadata.mimetype === undefined;

    if (isFolder) {
      folders.push(currentPath);
      continue;
    }

    const name = item.name.toLowerCase();
    const fullPath = currentPath.toLowerCase();

    /*
     * Match:
     * 1. File name
     * 2. Complete storage path
     *
     * Since the path contains folder names,
     * this also allows folder/category matching.
     */
    if (
      !name.includes(query) &&
      !fullPath.includes(query)
    ) {
      continue;
    }

    const folderPath =
      currentPath.includes("/")
        ? currentPath
            .split("/")
            .slice(0, -1)
            .join("/")
        : "";

    results.push({
      id:
        item.id ??
        `file-${currentPath}`,

      name: item.name,

      path: currentPath,

      folderPath,

      size:
        typeof item.metadata?.size === "number"
          ? item.metadata.size
          : undefined,

      updatedAt:
        item.updated_at ??
        item.created_at ??
        undefined,
    });
  }

  /*
   * IMPORTANT OPTIMIZATION:
   *
   * The old version searched folders one after another:
   *
   *   folder A → wait → folder B → wait → folder C
   *
   * This version searches all folders concurrently:
   *
   *   folder A ─┐
   *   folder B ─┼─→ concurrently
   *   folder C ─┘
   */
  if (folders.length) {
    await Promise.all(
      folders.map((folderPath) =>
        searchFolder(
          supabase,
          folderPath,
          query,
          results,
        ),
      ),
    );
  }
}