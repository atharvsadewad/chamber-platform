import { supabase } from "@/providers/database/supabase";

export type BookmarkItem = {
  id: string;
  type: string;
  title: string;
  source?: string;
  year?: string;
  summary?: string;
  section?: string;
  actName?: string;
  actNumber?: string;
  path?: string;
  url?: string;
};

export const BOOKMARK_EVENT =
  "lawsandjudgments:bookmarks-changed";

const LEGACY_STORAGE_KEY =
  "lawsandjudgments:bookmarks:v1";

function normalizeBookmark(
  item: BookmarkItem,
): BookmarkItem {
  return {
    ...item,
    id: String(item.id),
    type: String(item.type),
    title: String(item.title),
  };
}

function toDatabaseRow(
  item: BookmarkItem,
  userId: string,
) {
  const normalized = normalizeBookmark(item);

  return {
    user_id: userId,
    item_id: normalized.id,
    item_type: normalized.type,
    title: normalized.title,
    source: normalized.source ?? null,
    year: normalized.year ?? null,
    summary: normalized.summary ?? null,
    section: normalized.section ?? null,
    act_name: normalized.actName ?? null,
    act_number: normalized.actNumber ?? null,
    path: normalized.path ?? null,
    url: normalized.url ?? null,
  };
}

function fromDatabaseRow(
  row: Record<string, unknown>,
): BookmarkItem {
  return {
    id: String(row.item_id ?? ""),
    type: String(row.item_type ?? ""),
    title: String(row.title ?? ""),
    source:
      typeof row.source === "string"
        ? row.source
        : undefined,
    year:
      typeof row.year === "string"
        ? row.year
        : undefined,
    summary:
      typeof row.summary === "string"
        ? row.summary
        : undefined,
    section:
      typeof row.section === "string"
        ? row.section
        : undefined,
    actName:
      typeof row.act_name === "string"
        ? row.act_name
        : undefined,
    actNumber:
      typeof row.act_number === "string"
        ? row.act_number
        : undefined,
    path:
      typeof row.path === "string"
        ? row.path
        : undefined,
    url:
      typeof row.url === "string"
        ? row.url
        : undefined,
  };
}

function dispatchBookmarkChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(BOOKMARK_EVENT),
  );
}

function readLegacyBookmarks(): BookmarkItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        LEGACY_STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (
        item,
      ): item is BookmarkItem =>
        Boolean(
          item &&
            typeof item === "object" &&
            "id" in item &&
            "type" in item &&
            "title" in item,
        ),
    );
  } catch {
    return [];
  }
}

/**
 * Migrates bookmarks created by the old localStorage
 * implementation into the authenticated user's account.
 *
 * The local copy is removed only after Supabase confirms
 * the migration succeeded.
 */
async function migrateLegacyBookmarks(
  userId: string,
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const legacyBookmarks =
    readLegacyBookmarks();

  if (legacyBookmarks.length === 0) {
    return;
  }

  const rows = legacyBookmarks.map(
    (item) =>
      toDatabaseRow(
        item,
        userId,
      ),
  );

  const { error } =
    await supabase
      .from("user_bookmarks")
      .upsert(rows, {
        onConflict:
          "user_id,item_type,item_id",
        ignoreDuplicates: true,
      });

  if (error) {
    console.error(
      "Unable to migrate legacy bookmarks:",
      error,
    );
    return;
  }

  window.localStorage.removeItem(
    LEGACY_STORAGE_KEY,
  );

  dispatchBookmarkChange();
}

export async function loadBookmarks(): Promise<
  BookmarkItem[]
> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  await migrateLegacyBookmarks(
    user.id,
  );

  const { data, error } =
    await supabase
      .from("user_bookmarks")
      .select(
        `
          item_id,
          item_type,
          title,
          source,
          year,
          summary,
          section,
          act_name,
          act_number,
          path,
          url,
          created_at
        `,
      )
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Unable to load bookmarks:",
      error,
    );
    return [];
  }

  return (data ?? []).map(
    (row) =>
      fromDatabaseRow(
        row as Record<
          string,
          unknown
        >,
      ),
  );
}

export async function isBookmarked(
  id: string | number,
  type: string,
): Promise<boolean> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  const { data, error } =
    await supabase
      .from("user_bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_id", String(id))
      .eq("item_type", type)
      .maybeSingle();

  if (error) {
    console.error(
      "Unable to check bookmark:",
      error,
    );
    return false;
  }

  return Boolean(data);
}

export async function toggleBookmark(
  item: BookmarkItem,
): Promise<boolean> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  const normalized =
    normalizeBookmark(item);

  const { data: existing, error: lookupError } =
    await supabase
      .from("user_bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_id", normalized.id)
      .eq("item_type", normalized.type)
      .maybeSingle();

  if (lookupError) {
    console.error(
      "Unable to check existing bookmark:",
      lookupError,
    );
    return false;
  }

  if (existing) {
    const { error } =
      await supabase
        .from("user_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("item_id", normalized.id)
        .eq("item_type", normalized.type);

    if (error) {
      console.error(
        "Unable to remove bookmark:",
        error,
      );
      return true;
    }

    dispatchBookmarkChange();

    return false;
  }

  const { error } =
    await supabase
      .from("user_bookmarks")
      .insert(
        toDatabaseRow(
          normalized,
          user.id,
        ),
      );

  if (error) {
    console.error(
      "Unable to save bookmark:",
      error,
    );
    return false;
  }

  dispatchBookmarkChange();

  return true;
}

export async function removeBookmark(
  id: string | number,
  type: string,
): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return;
  }

  const { error } =
    await supabase
      .from("user_bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("item_id", String(id))
      .eq("item_type", type);

  if (error) {
    console.error(
      "Unable to remove bookmark:",
      error,
    );
    return;
  }

  dispatchBookmarkChange();
}

export async function clearBookmarks(): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return;
  }

  const { error } =
    await supabase
      .from("user_bookmarks")
      .delete()
      .eq("user_id", user.id);

  if (error) {
    console.error(
      "Unable to clear bookmarks:",
      error,
    );
    return;
  }

  dispatchBookmarkChange();
}