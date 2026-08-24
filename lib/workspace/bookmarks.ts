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

const STORAGE_KEY =
  "lawsandjudgments:bookmarks:v1";

export const BOOKMARK_EVENT =
  "lawsandjudgments:bookmarks-changed";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function loadBookmarks(): BookmarkItem[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
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
      (item): item is BookmarkItem =>
        Boolean(
          item &&
            typeof item === "object" &&
            "id" in item &&
            "title" in item,
        ),
    );
  } catch {
    return [];
  }
}

function persist(items: BookmarkItem[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items),
  );

  window.dispatchEvent(
    new CustomEvent(BOOKMARK_EVENT),
  );
}

export function isBookmarked(
  id: string | number,
) {
  const normalizedId = String(id);

  return loadBookmarks().some(
    (item) => item.id === normalizedId,
  );
}

export function toggleBookmark(
  item: BookmarkItem,
) {
  const normalizedItem: BookmarkItem = {
    ...item,
    id: String(item.id),
  };

  const current = loadBookmarks();

  const exists = current.some(
    (saved) =>
      saved.id === normalizedItem.id,
  );

  if (exists) {
    persist(
      current.filter(
        (saved) =>
          saved.id !== normalizedItem.id,
      ),
    );

    return false;
  }

  persist([
    normalizedItem,
    ...current,
  ]);

  return true;
}

export function removeBookmark(
  id: string | number,
) {
  const normalizedId = String(id);

  persist(
    loadBookmarks().filter(
      (item) => item.id !== normalizedId,
    ),
  );
}

export function clearBookmarks() {
  persist([]);
}