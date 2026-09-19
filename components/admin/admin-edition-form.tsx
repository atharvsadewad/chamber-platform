"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { supabase } from "@/providers/database/supabase";

export function AdminEditionForm() {
  const router = useRouter();

  const [editionDate, setEditionDate] = useState("");
  const [title, setTitle] = useState("Legal Newspaper");
  const [subtitle, setSubtitle] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const date = editionDate.trim();
    const cleanTitle = title.trim();
    const cleanSubtitle = subtitle.trim();

    if (!date) {
      setError("Edition date is required.");
      return;
    }

    if (!cleanTitle) {
      setError("Edition title is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { data: existing, error: existingError } =
        await supabase
          .from("newspaper_editions")
          .select("id")
          .eq("edition_date", date)
          .maybeSingle();

      if (existingError) {
        throw new Error(
          "Unable to check whether this edition already exists.",
        );
      }

      if (existing) {
        setError(
          "An edition already exists for this date.",
        );
        return;
      }

      const { data, error: insertError } =
        await supabase
          .from("newspaper_editions")
          .insert({
            edition_date: date,
            title: cleanTitle,
            subtitle: cleanSubtitle || null,
            status: "draft",
          })
          .select("id")
          .single();

      if (insertError) {
        console.error(
          "Newspaper edition creation failed:",
          insertError,
        );

        throw new Error(
          "Unable to create the newspaper edition.",
        );
      }

      router.push(`/admin/newspaper/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create the newspaper edition.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="edition-date"
          className="block text-sm font-semibold text-foreground"
        >
          Edition Date
        </label>

        <p className="mt-1 text-xs text-muted-foreground">
          The date shown in the public newspaper archive.
        </p>

        <input
          id="edition-date"
          type="date"
          value={editionDate}
          onChange={(event) =>
            setEditionDate(event.target.value)
          }
          required
          className="mt-3 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div>
        <label
          htmlFor="edition-title"
          className="block text-sm font-semibold text-foreground"
        >
          Title
        </label>

        <p className="mt-1 text-xs text-muted-foreground">
          The main title displayed for this edition.
        </p>

        <input
          id="edition-title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Legal Newspaper"
          required
          maxLength={200}
          className="mt-3 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div>
        <label
          htmlFor="edition-subtitle"
          className="block text-sm font-semibold text-foreground"
        >
          Subtitle
        </label>

        <p className="mt-1 text-xs text-muted-foreground">
          Optional supporting text for the edition.
        </p>

        <input
          id="edition-subtitle"
          type="text"
          value={subtitle}
          onChange={(event) =>
            setSubtitle(event.target.value)
          }
          placeholder="Daily legal news and developments"
          maxLength={300}
          className="mt-3 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {error && (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/newspaper")}
          disabled={saving}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Draft Edition"
          )}
        </button>
      </div>
    </form>
  );
}