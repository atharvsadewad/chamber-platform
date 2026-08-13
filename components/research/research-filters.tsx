"use client";

const FILTERS = [
  "Supreme Court",
  "High Courts",
  "District Courts",
  "Tribunals",
];

export function ResearchFilters() {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-5">

      <div className="flex flex-wrap gap-3">

        <select className="rounded-xl border border-border bg-background px-4 py-2 text-sm">
          <option>Court</option>
          {FILTERS.map(item => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select className="rounded-xl border border-border bg-background px-4 py-2 text-sm">
          <option>Year</option>
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
        </select>

        <select className="rounded-xl border border-border bg-background px-4 py-2 text-sm">
          <option>Act</option>
        </select>

        <select className="rounded-xl border border-border bg-background px-4 py-2 text-sm">
          <option>Judge</option>
        </select>

        <select className="rounded-xl border border-border bg-background px-4 py-2 text-sm">
          <option>Sort</option>
          <option>Relevance</option>
          <option>Newest</option>
          <option>Oldest</option>
        </select>

      </div>

    </div>
  );
}