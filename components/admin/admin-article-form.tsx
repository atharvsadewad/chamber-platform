"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminArticleFormProps {
  editionId: string;
  categories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    display_order: number;
  }[];
}

export function AdminArticleForm({
  editionId,
  categories,
}: AdminArticleFormProps) {
  const router = useRouter();

  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanHeadline = headline.trim();

    if (!cleanHeadline) {
      setError("Headline is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const numericOrder = displayOrder.trim()
        ? Number(displayOrder)
        : undefined;

      if (
        numericOrder !== undefined &&
        (!Number.isInteger(numericOrder) ||
          numericOrder < 0)
      ) {
        setError(
          "Display order must be a non-negative whole number.",
        );
        setSaving(false);
        return;
      }

      const response = await fetch(
        `/api/admin/newspaper/${editionId}/articles`,
        {
          method: "POST",
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
        articleId?: string;
        message?: string;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.error ||
            payload.message ||
            "Unable to create the article.",
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
          : "Unable to create the article.",
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
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Article Content
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Write the article exactly as it should appear in the
          newspaper reader.
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
              placeholder="Automatic"
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Leave empty to place the article after the existing
              articles.
            </p>
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
              Mark this article as a featured story in the
              newspaper.
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
      </section>

      {error ? (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push(
              `/admin/newspaper/${editionId}`,
            )
          }
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
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Article
            </>
          )}
        </button>
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