"use client";

import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "@/providers/database/supabase";

interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
}

interface AdminArticleEditorProps {
  editionId: string;
  article: {
    id: string;
    headline: string;
    subheadline: string | null;
    summary: string | null;
    content: string | null;
    category_id: string | null;
    image_path: string | null;
    source_name: string | null;
    source_url: string | null;
    author: string | null;
    is_featured: boolean;
    display_order: number;
  };
  categories: ArticleCategory[];
}

const NEWSPAPER_MEDIA_BUCKET = "newspaper-media";

export function AdminArticleEditor({
  editionId,
  article,
  categories,
}: AdminArticleEditorProps) {
  const router = useRouter();

  const [headline, setHeadline] = useState(article.headline);
  const [subheadline, setSubheadline] = useState(
    article.subheadline ?? "",
  );
  const [summary, setSummary] = useState(
    article.summary ?? "",
  );
  const [content, setContent] = useState(
    article.content ?? "",
  );
  const [categoryId, setCategoryId] = useState(
    article.category_id ?? "",
  );
  const [sourceName, setSourceName] = useState(
    article.source_name ?? "",
  );
  const [sourceUrl, setSourceUrl] = useState(
    article.source_url ?? "",
  );
  const [author, setAuthor] = useState(
    article.author ?? "",
  );
  const [isFeatured, setIsFeatured] = useState(
    article.is_featured,
  );
  const [displayOrder, setDisplayOrder] = useState(
    String(article.display_order),
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [imagePath, setImagePath] = useState(
    article.image_path,
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    null,
  );
  const [uploadingImage, setUploadingImage] =
    useState(false);
  const [removingImage, setRemovingImage] =
    useState(false);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (!imagePath) {
      setImageUrl(null);
      return;
    }

    const { data } = supabase.storage
      .from(NEWSPAPER_MEDIA_BUCKET)
      .getPublicUrl(imagePath);

    setImageUrl(data.publicUrl);
  }, [imagePath]);

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadingImage(true);
    setImageError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `/api/admin/newspaper/${editionId}/articles/${article.id}/media`,
        {
          method: "POST",
          body: formData,
        },
      );

      const payload = (await response.json()) as {
        success?: boolean;
        imagePath?: string;
        imageUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.error ||
            "Unable to upload the article image.",
        );
      }

      setImagePath(payload.imagePath ?? null);
      setImageUrl(payload.imageUrl ?? null);
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : "Unable to upload the article image.",
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleImageRemove() {
    const confirmed = window.confirm(
      "Remove this article image?",
    );

    if (!confirmed) {
      return;
    }

    setRemovingImage(true);
    setImageError("");

    try {
      const response = await fetch(
        `/api/admin/newspaper/${editionId}/articles/${article.id}/media`,
        {
          method: "DELETE",
        },
      );

      const payload = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.error ||
            "Unable to remove the article image.",
        );
      }

      setImagePath(null);
      setImageUrl(null);
    } catch (err) {
      setImageError(
        err instanceof Error
          ? err.message
          : "Unable to remove the article image.",
      );
    } finally {
      setRemovingImage(false);
    }
  }

  async function handleSave(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanHeadline = headline.trim();

    if (!cleanHeadline) {
      setError("Headline is required.");
      setSuccess("");
      return;
    }

    const numericOrder = Number(displayOrder);

    if (
      !Number.isInteger(numericOrder) ||
      numericOrder < 0
    ) {
      setError(
        "Display order must be a non-negative whole number.",
      );
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/newspaper/${editionId}/articles?articleId=${encodeURIComponent(article.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            headline: cleanHeadline,
            subheadline,
            summary,
            content,
            categoryId: categoryId || null,
            sourceName,
            sourceUrl,
            author,
            isFeatured,
            displayOrder: numericOrder,
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
            "Unable to update the article.",
        );
      }

      setSuccess(
        payload.message ||
          "Article updated successfully.",
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the article.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${article.headline}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/admin/newspaper/${editionId}/articles?articleId=${encodeURIComponent(article.id)}`,
        {
          method: "DELETE",
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
            "Unable to delete the article.",
        );
      }

      router.push(
        `/admin/newspaper/${editionId}`,
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the article.",
      );
      setDeleting(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6"
    >
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Article Content
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Update the story content displayed in the newspaper.
        </p>

        <div className="mt-6 space-y-6">
          <Field
            id="article-headline"
            label="Headline"
            value={headline}
            onChange={setHeadline}
            placeholder="Enter the article headline"
            required
          />

          <Field
            id="article-subheadline"
            label="Subheadline"
            value={subheadline}
            onChange={setSubheadline}
            placeholder="Optional supporting headline"
          />

          <TextAreaField
            id="article-summary"
            label="Summary"
            value={summary}
            onChange={setSummary}
            placeholder="Short summary shown before the article body"
            rows={5}
          />

          <TextAreaField
            id="article-content"
            label="Content"
            value={content}
            onChange={setContent}
            placeholder="Write the full article content..."
            rows={16}
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Classification
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="article-category"
              className="block text-sm font-semibold text-foreground"
            >
              Category
            </label>

            <select
              id="article-category"
              value={categoryId}
              onChange={(event) =>
                setCategoryId(event.target.value)
              }
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">
                Select category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            {categoryId ? (
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {
                  categories.find(
                    (category) =>
                      category.id === categoryId,
                  )?.description
                }
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="article-order"
              className="block text-sm font-semibold text-foreground"
            >
              Display Order
            </label>

            <input
              id="article-order"
              type="number"
              min="0"
              step="1"
              value={displayOrder}
              onChange={(event) =>
                setDisplayOrder(event.target.value)
              }
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/20 p-4">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) =>
              setIsFeatured(event.target.checked)
            }
            className="mt-0.5 h-4 w-4 rounded border-border"
          />

          <span>
            <span className="block text-sm font-semibold text-foreground">
              Featured Article
            </span>

            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              Mark this article as a featured story.
            </span>
          </span>
        </label>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Attribution
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Field
            id="article-source"
            label="Source Name"
            value={sourceName}
            onChange={setSourceName}
            placeholder="e.g. Supreme Court of India"
          />

          <Field
            id="article-author"
            label="Author"
            value={author}
            onChange={setAuthor}
            placeholder="Optional author name"
          />
        </div>

        <div className="mt-6">
          <Field
            id="article-source-url"
            label="Source URL"
            value={sourceUrl}
            onChange={setSourceUrl}
            placeholder="https://..."
            type="url"
          />
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Article Image
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Upload an image to accompany this article in the
              public newspaper.
            </p>
          </div>

          {imageUrl ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-border bg-secondary/20">
              <div className="aspect-[16/9] max-h-[420px] overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Article preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-border p-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 truncate text-xs text-muted-foreground">
                  {imagePath}
                </p>

                <button
                  type="button"
                  onClick={() => void handleImageRemove()}
                  disabled={
                    removingImage || uploadingImage
                  }
                  className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-destructive/20 px-3 text-xs font-semibold text-destructive hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {removingImage ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <label className="mt-4 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/20 px-5 text-center transition-colors hover:bg-secondary/40">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="sr-only"
              />

              {uploadingImage ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              )}

              <span className="mt-3 text-sm font-semibold text-foreground">
                {uploadingImage
                  ? "Uploading image..."
                  : "Upload Article Image"}
              </span>

              <span className="mt-1 text-xs text-muted-foreground">
                PNG, JPG, JPEG or WebP · Maximum 10 MB
              </span>
            </label>
          )}

          {imageError ? (
            <div
              className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive"
              role="alert"
            >
              {imageError}
            </div>
          ) : null}
        </div>
      </section>

      {error ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {success ? (
        <div
          className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary"
          role="status"
        >
          {success}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => void handleDelete()}
          disabled={saving || deleting || uploadingImage}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-destructive/20 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete Article
        </button>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/admin/newspaper/${editionId}`,
              )
            }
            disabled={
              saving ||
              deleting ||
              uploadingImage ||
              removingImage
            }
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Edition
          </button>

          <button
            type="submit"
            disabled={
              saving ||
              deleting ||
              uploadingImage ||
              removingImage
            }
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "url";
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-foreground"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows: number;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-foreground"
      >
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}