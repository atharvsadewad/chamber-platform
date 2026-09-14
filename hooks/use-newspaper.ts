"use client";

import * as React from "react";
import {
  getNewspaperCategories,
  getPublishedEdition,
  getPublishedEditions,
  type NewspaperEditionWithArticles,
} from "@/services/newspaper.service";
import type { NewspaperCategory, NewspaperEdition } from "@/types/newspaper";

const PUBLIC_ERROR =
  "We’re having trouble loading the newspaper. Please try again.";

export function useNewspaper() {
  const [editions, setEditions] = React.useState<NewspaperEdition[]>([]);
  const [edition, setEdition] =
    React.useState<NewspaperEditionWithArticles | null>(null);
  const [categories, setCategories] = React.useState<NewspaperCategory[]>([]);
  const [selectedEditionId, setSelectedEditionId] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async (editionId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const [nextEditions, nextCategories] = await Promise.all([
        getPublishedEditions(),
        getNewspaperCategories(),
      ]);

      setEditions(nextEditions);
      setCategories(nextCategories);

      const targetId =
        editionId && nextEditions.some((item) => item.id === editionId)
          ? editionId
          : nextEditions[0]?.id;

      setSelectedEditionId(targetId ?? "");
      setEdition(targetId ? await getPublishedEdition(targetId) : null);
    } catch (err) {
      console.error("Newspaper load error:", err);
      setEditions([]);
      setCategories([]);
      setEdition(null);
      setError(PUBLIC_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const selectEdition = React.useCallback(
    async (editionId: string) => {
      if (!editionId || editionId === selectedEditionId) return;

      setLoading(true);
      setError(null);

      try {
        const nextEdition = await getPublishedEdition(editionId);
        setEdition(nextEdition);
        setSelectedEditionId(editionId);
      } catch (err) {
        console.error("Newspaper edition error:", err);
        setError(PUBLIC_ERROR);
      } finally {
        setLoading(false);
      }
    },
    [selectedEditionId],
  );

  return {
    editions,
    edition,
    categories,
    selectedEditionId,
    loading,
    error,
    selectEdition,
    reload: load,
  };
}
