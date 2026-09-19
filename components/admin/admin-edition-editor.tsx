"use client";

import {
  CalendarDays,
  CheckCircle2,
  FileText,
  ImagePlus,
  Loader2,
  Save,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminEditionEditorProps {
  edition: {
    id: string;
    editionDate: string;
    title: string;
    subtitle: string | null;
    coverImagePath: string | null;
    coverImageUrl: string | null;
    status: "draft" | "published";
    publishedAt: string | null;
  };
  articleCount: number;
}

export function AdminEditionEditor({
  edition,
  articleCount,
}: AdminEditionEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(edition.title);
  const [subtitle, setSubtitle] = useState(
    edition.subtitle ?? "",
  );
  const [editionDate, setEditionDate] = useState(
    edition.editionDate,
  );
  const [status, setStatus] = useState<
    "draft" | "published"
  >(edition.status);

  const [coverUrl, setCoverUrl] = useState(
    edition.coverImageUrl,
  );

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveEdition() {
    if (!title.trim()) {
      setError("Edition title is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/newspaper/${edition.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            subtitle: subtitle.trim(),
            editionDate,
            status,
          }),
        },
      );

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.error ||
            payload.message ||
            "Unable to save the edition.",
        );
      }

      setMessage(
        payload.message || "Edition saved successfully.",
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the edition.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadCover(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Cover image must be 10 MB or smaller.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("cover", file);

      const response = await fetch(
        `/api/admin/newspaper/${edition.id}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        publicUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.error ||
            payload.message ||
            "Unable to upload the cover.",
        );
      }

      if (payload.publicUrl) {
        setCoverUrl(
          `${payload.publicUrl}?v=${Date.now()}`,
        );
      }

      setMessage(
        payload.message || "Cover uploaded successfully.",
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload the cover.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-5">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Edition Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Update the information displayed for this newspaper.
          </p>
        </div>

        <div className="space-y-6 p-5">
          <div>
            <label
              htmlFor="admin-edition-title"
              className="block text-sm font-semibold text-foreground"
            >
              Title
            </label>

            <input
              id="admin-edition-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              maxLength={200}
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="admin-edition-subtitle"
              className="block text-sm font-semibold text-foreground"
            >
              Subtitle
            </label>

            <input
              id="admin-edition-subtitle"
              type="text"
              value={subtitle}
              onChange={(event) =>
                setSubtitle(event.target.value)
              }
              maxLength={300}
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="admin-edition-date"
              className="block text-sm font-semibold text-foreground"
            >
              Edition Date
            </label>

            <div className="relative mt-2">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="admin-edition-date"
                type="date"
                value={editionDate}
                onChange={(event) =>
                  setEditionDate(event.target.value)
                }
                className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-edition-status"
              className="block text-sm font-semibold text-foreground"
            >
              Status
            </label>

            <select
              id="admin-edition-status"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | "draft"
                    | "published",
                )
              }
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Published editions are visible in the public
              newspaper archive.
            </p>
          </div>

          {error ? (
            <div
              className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>
          ) : null}

          <div className="border-t border-border pt-5">
            <button
              type="button"
              onClick={() => void saveEdition()}
              disabled={saving || uploading}
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Edition
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        <section className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-5">
            <h2 className="font-serif text-xl font-bold text-foreground">
              Front Page
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Upload the cover used by the public newspaper
              archive.
            </p>
          </div>

          <div className="p-5">
            <div className="overflow-hidden rounded-lg border border-border bg-secondary">
              <div className="aspect-[3/4]">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={`${title} cover`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                    <ImagePlus className="h-9 w-9 text-muted-foreground/60" />

                    <p className="mt-3 font-serif text-lg font-bold text-foreground">
                      No cover uploaded
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Upload the finished newspaper front page.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <label
              htmlFor="admin-cover-upload"
              className="mt-4 inline-flex min-h-10 w-full cursor-pointer items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {coverUrl
                    ? "Replace Cover"
                    : "Upload Cover"}
                </>
              )}

              <input
                id="admin-cover-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={uploadCover}
                disabled={uploading}
                className="sr-only"
              />
            </label>

            <p className="mt-2 text-center text-[11px] leading-5 text-muted-foreground">
              PNG, JPG, JPEG or WebP · Maximum 10 MB
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>

            <div>
              <h2 className="font-serif text-lg font-bold text-foreground">
                Articles
              </h2>

              <p className="text-xs text-muted-foreground">
                {articleCount}{" "}
                {articleCount === 1
                  ? "article"
                  : "articles"}{" "}
                in this edition
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="mt-4 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground opacity-60"
          >
            Article Management — Next
          </button>
        </section>
      </div>
    </div>
  );
}