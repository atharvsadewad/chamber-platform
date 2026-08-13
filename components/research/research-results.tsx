import { SearchResultCard, type SearchResult } from "@/components/research/search-result-card";

const RESULTS: SearchResult[] = [
  {
    id: "1",
    title: "State of Maharashtra v. Anil Kumar",
    source: "Supreme Court of India",
    year: "2024",
    summary:
      "Clarifies the evidentiary requirements under Section 302 of the Bharatiya Nyaya Sanhita while discussing circumstantial evidence.",
    tags: ["BNS", "Criminal Law", "Evidence"],
  },
  {
    id: "2",
    title: "Article 21 — Right to Life",
    source: "Constitution of India",
    year: "Updated",
    summary:
      "Complete constitutional provision with historical amendments, landmark judgments and related Articles.",
    tags: ["Constitution", "Fundamental Rights"],
  },
  {
    id: "3",
    title: "Negotiable Instruments Act",
    source: "Bare Act",
    year: "2025",
    summary:
      "Latest consolidated Bare Act including amendments and important judicial interpretations.",
    tags: ["Cheque Bounce", "Commercial"],
  },
];

export function ResearchResults() {
  return (
    <section className="mt-8">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold">
            Search Results
          </h2>

          <p className="text-sm text-muted-foreground">
            {RESULTS.length} results found
          </p>
        </div>

      </div>

      <div className="space-y-5">

        {RESULTS.map((result) => (
          <SearchResultCard
            key={result.id}
            result={result}
          />
        ))}

      </div>

    </section>
  );
}